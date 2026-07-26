export type CommunityLink = {
  title: string;
  url: string;
  source: "reddit" | "forum";
  why: string;
};

type RedditChild = {
  data?: {
    title?: string;
    permalink?: string;
    url?: string;
    subreddit?: string;
    selftext?: string;
    score?: number;
    num_comments?: number;
    over_18?: boolean;
  };
};

type RedditHit = CommunityLink & {
  score: number;
  comments: number;
  blob: string;
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function relevanceScore(
  text: string,
  needles: string[]
): { score: number; hits: string[] } {
  const hay = text.toLowerCase();
  const hits: string[] = [];
  let score = 0;
  for (const needle of needles) {
    if (!needle || needle.length < 3) continue;
    if (hay.includes(needle.toLowerCase())) {
      score += needle.length > 6 ? 3 : 2;
      hits.push(needle);
    }
  }
  return { score, hits };
}

function uniqueQueries(items: string[]) {
  return Array.from(
    new Set(
      items
        .map((q) => q.replace(/\s+/g, " ").trim())
        .filter((q) => q.length > 8)
    )
  );
}

async function searchReddit(query: string, limit = 8): Promise<RedditHit[]> {
  const url = new URL("https://www.reddit.com/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "relevance");
  url.searchParams.set("t", "all");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("type", "link");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "TransitHealthPassport/1.0 (healthcare relocation research)",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];

  const json = (await response.json()) as {
    data?: { children?: RedditChild[] };
  };

  return (json.data?.children || [])
    .map((child) => child.data)
    .filter(Boolean)
    .filter((post) => !post?.over_18)
    .map((post) => {
      const permalink = post?.permalink
        ? `https://www.reddit.com${post.permalink}`
        : post?.url || "";
      return {
        title: (post?.title || "Discussion").trim(),
        url: permalink,
        source: "reddit" as const,
        why: post?.subreddit ? `r/${post.subreddit}` : "Reddit discussion",
        score: post?.score || 0,
        comments: post?.num_comments || 0,
        blob: `${post?.title || ""} ${post?.selftext || ""} ${post?.subreddit || ""}`,
      };
    })
    .filter((post) => post.url.includes("reddit.com"));
}

/** Always-useful related search links when thread matching is thin. */
function relatedDestinationChats(input: {
  fromCountry: string;
  toCountry: string;
  fromCity?: string;
  toCity?: string;
}): CommunityLink[] {
  const destPlace = (input.toCity || input.toCountry).trim();
  const to = input.toCountry.trim();
  const from = input.fromCountry.trim();
  if (!destPlace || !to) return [];

  const links: CommunityLink[] = [
    {
      title: `Healthcare chats about moving to ${destPlace}`,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(
        `"${destPlace}" (healthcare OR hospital OR clinic OR doctor OR insurance) (expat OR foreigner OR moving OR relocating)`
      )}&sort=relevance&t=all`,
      source: "reddit",
      why: `Related discussions for newcomers in ${destPlace}`,
    },
    {
      title: `${to} healthcare system — expat & newcomer threads`,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(
        `${to} (healthcare OR "health system" OR hospital OR clinic OR OMS OR insurance) (expat OR immigrant OR foreigner)`
      )}&sort=relevance&t=all`,
      source: "reddit",
      why: `Broader ${to} care conversations`,
    },
  ];

  // Destination-city extras (e.g. Moscow)
  if (
    input.toCity &&
    input.toCity.trim().toLowerCase() !== to.toLowerCase()
  ) {
    links.unshift({
      title: `Living in ${input.toCity}: hospitals, clinics, insurance`,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(
        `${input.toCity} (hospital OR clinic OR healthcare OR doctor OR insurance)`
      )}&sort=relevance&t=all`,
      source: "reddit",
      why: `City-level chats for ${input.toCity}`,
    });
  }

  if (from) {
    links.push({
      title: `Moving from ${from} abroad — healthcare continuity`,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(
        `(from ${from} OR "${from}") (moving OR relocating) (healthcare OR hospital OR doctor OR medication)`
      )}&sort=relevance&t=all`,
      source: "reddit",
      why: `People leaving ${from} with care needs`,
    });
  }

  const seen = new Set<string>();
  return links
    .filter((l) => {
      if (seen.has(l.url)) return false;
      seen.add(l.url);
      return true;
    })
    .slice(0, 2);
}

/**
 * Research community discussions for a corridor + condition.
 * Returns specific threads when possible; otherwise 1–2 related destination chats.
 */
export async function researchCommunityDiscussions(input: {
  fromCountry: string;
  toCountry: string;
  fromCity?: string;
  toCity?: string;
  condition?: string;
}): Promise<CommunityLink[]> {
  const from = input.fromCountry.trim();
  const to = input.toCountry.trim();
  const toCity = input.toCity?.trim() || "";
  const condition = input.condition?.trim() || "";
  if (!from || !to) return [];

  const conditionTokens = tokenize(condition).slice(0, 4);
  const diabetes = /diabetes|t1d|type\s*1|insulin|cgm|pump/.test(
    condition.toLowerCase()
  );
  const cancer = /cancer|oncolog|chemotherapy|tumou?r|melanoma|carcinoma/.test(
    condition.toLowerCase()
  );
  const toUk = /united kingdom|uk|britain|england|london/i.test(
    `${to} ${toCity}`
  );
  const toRussia = /russia|moscow|saint petersburg|st petersburg/i.test(
    `${to} ${toCity}`
  );
  const fromGeorgia = /georgia|tbilisi|batumi/i.test(
    `${from} ${input.fromCity || ""}`
  );

  const queries = uniqueQueries([
    toRussia
      ? `(Moscow OR Russia) (healthcare OR hospital OR clinic OR OMS OR insurance) (expat OR foreigner OR moving)`
      : "",
    toRussia
      ? `Moscow (hospital OR clinic OR doctor) (expat OR English OR international)`
      : "",
    toUk
      ? `(NHS OR "GP registration" OR "find a GP") (expat OR immigrant OR moving OR relocating)`
      : "",
    fromGeorgia && toUk
      ? `(Georgia OR Tbilisi) (UK OR Britain OR NHS) (healthcare OR doctor OR GP)`
      : "",
    cancer
      ? `(oncology OR cancer OR chemotherapy) (${to} OR ${toCity || to}) (hospital OR clinic OR treatment)`
      : "",
    diabetes
      ? `("type 1 diabetes" OR T1D OR insulin) (${to} OR "${toCity}") (expat OR moving OR hospital OR prescription)`
      : "",
    condition
      ? `"${condition}" (${to} OR "${toCity}") (doctor OR hospital OR clinic OR medication)`
      : "",
    `(moving OR relocating OR expat) healthcare (${to} OR ${toCity || to}) (doctor OR hospital OR clinic)`,
    `${toCity || to} healthcare (expat OR foreigner OR hospital OR clinic)`,
  ]);

  const needles = uniqueQueries([
    from,
    to,
    input.fromCity || "",
    toCity,
    condition,
    ...conditionTokens,
    "healthcare",
    "doctor",
    "hospital",
    "clinic",
    "insurance",
    "expat",
    "moscow",
    "nhs",
  ]);

  const collected: RedditHit[] = [];
  for (const query of queries.slice(0, 4)) {
    try {
      collected.push(...(await searchReddit(query, 8)));
    } catch {
      // continue
    }
  }

  const ranked = collected
    .map((post) => {
      const { score: rel, hits } = relevanceScore(post.blob, needles);
      const blob = post.blob.toLowerCase();
      const destHit =
        blob.includes(to.toLowerCase()) ||
        Boolean(toCity && blob.includes(toCity.toLowerCase())) ||
        (toRussia &&
          (blob.includes("moscow") || blob.includes("russia"))) ||
        (toUk && (blob.includes("nhs") || blob.includes("uk")));
      const originHit = blob.includes(from.toLowerCase());
      const conditionHit =
        !condition ||
        conditionTokens.some((t) => blob.includes(t)) ||
        blob.includes(condition.toLowerCase()) ||
        (cancer &&
          (blob.includes("cancer") ||
            blob.includes("oncolog") ||
            blob.includes("chemo")));

      // Accept destination-related healthcare threads even without exact origin match
      if (!destHit && rel < 4) return null;
      if (condition && !conditionHit && !destHit) return null;

      const finalScore =
        rel * 3 +
        Math.min(post.comments, 40) / 10 +
        Math.min(post.score, 200) / 50 +
        (destHit ? 6 : 0) +
        (originHit ? 3 : 0) +
        (conditionHit && condition ? 5 : 0);

      if (finalScore < 5) return null;

      const whyBits = [
        destHit ? toCity || to : "",
        condition && conditionHit ? condition.split(/[,.]/)[0].slice(0, 40) : "",
        post.why.startsWith("r/") ? post.why : "",
      ].filter(Boolean);

      return {
        title: post.title,
        url: post.url,
        source: "reddit" as const,
        why:
          whyBits.length > 0
            ? `Related to ${whyBits.join(" · ")}`
            : "Related healthcare move discussion",
        finalScore,
      };
    })
    .filter(Boolean) as Array<CommunityLink & { finalScore: number }>;

  const seen = new Set<string>();
  const threads = ranked
    .sort((a, b) => b.finalScore - a.finalScore)
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, 2)
    .map(({ title, url, source, why }) => ({ title, url, source, why }));

  if (threads.length >= 1) return threads;

  // Fallback: curated related chat searches for the destination
  return relatedDestinationChats(input);
}
