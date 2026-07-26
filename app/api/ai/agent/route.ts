import { NextResponse } from "next/server";
import { z } from "zod";
import { askTransitAgent } from "@/lib/ai/provider";

const bodySchema = z.object({
  question: z.string().min(1).max(2000),
  context: z.string().max(20000).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const context =
      body.context ||
      "No patient context provided. Ask the user to complete onboarding and upload records.";

    const result = await askTransitAgent(body.question, context);
    return NextResponse.json({
      ...result.data,
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to answer question",
      },
      { status: 400 }
    );
  }
}
