import type { ReactNode } from "react";

/** Phrases that are safety-critical for someone relocating with ongoing care. */
const CRITICAL_PATTERNS: RegExp[] = [
  /must not be interrupted[^.!?]*/gi,
  /do not arrive without a transfer pack/gi,
  /arrive with a transfer pack/gi,
  /without a transfer pack/gi,
  /Carry enough supply for travel plus your first destination appointment/gi,
  /do not assume automatic cover/gi,
  /Confirm NHS entitlement[^.!?]*/gi,
  /a UK clinician must re-prescribe locally/gi,
  /will usually need to review and re-prescribe/gi,
  /do not rely on memory of the findings/gi,
  /treatment timing is critical/gi,
  /Keep [^—.\n]+ continuous[^.!?]*/gi,
  /ask your current clinician what must not be interrupted[^.!?]*/gi,
];

function collectRanges(text: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  for (const pattern of CRITICAL_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

export function isCriticalBullet(text: string) {
  return (
    collectRanges(text).length > 0 ||
    /must not be interrupted|transfer pack|bridge supply|entitlement|re-prescribe|timing is critical/i.test(
      text
    )
  );
}

/** Renders text with critical / dangerous guidance in red. */
export function CriticalText({ text }: { text: string }): ReactNode {
  const ranges = collectRanges(text);
  if (!ranges.length) return text;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (cursor < range.start) {
      nodes.push(text.slice(cursor, range.start));
    }
    nodes.push(
      <mark
        key={`c-${index}-${range.start}`}
        className="rounded-sm bg-danger-soft px-0.5 font-medium text-danger"
      >
        {text.slice(range.start, range.end)}
      </mark>
    );
    cursor = range.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
