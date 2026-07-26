import { NextResponse } from "next/server";
import { z } from "zod";
import { researchCommunityDiscussions } from "@/lib/corridor/community";

const bodySchema = z.object({
  fromCountry: z.string().min(1).max(120),
  toCountry: z.string().min(1).max(120),
  fromCity: z.string().max(120).optional(),
  toCity: z.string().max(120).optional(),
  condition: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const links = await researchCommunityDiscussions(body);
    return NextResponse.json({
      links,
      note:
        links.length > 0
          ? "Community experiences — not medical advice. Verify anything before you act."
          : "No clearly relevant public discussions found for this route yet.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        links: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to research community discussions",
      },
      { status: 400 }
    );
  }
}
