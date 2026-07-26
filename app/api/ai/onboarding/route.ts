import { NextResponse } from "next/server";
import { z } from "zod";
import { parseOnboardingMessage } from "@/lib/ai/onboarding-parse";

const bodySchema = z.object({
  text: z.string().min(1).max(5000),
  name: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const result = await parseOnboardingMessage(body.text, body.name || "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to understand that message",
      },
      { status: 400 }
    );
  }
}
