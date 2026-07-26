import { NextResponse } from "next/server";
import { z } from "zod";
import { synthesizeSpeech } from "@/lib/elevenlabs/client";

const bodySchema = z.object({
  text: z.string().min(1).max(5000),
  language: z.enum(["en", "es", "ca"]).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const result = await synthesizeSpeech(body.text);

    if (!result.audioBase64) {
      return NextResponse.json({
        audioUrl: null,
        simulated: true,
        message: result.message,
      });
    }

    return NextResponse.json({
      audioUrl: `data:audio/mpeg;base64,${result.audioBase64}`,
      simulated: false,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      {
        audioUrl: null,
        simulated: true,
        message:
          error instanceof Error
            ? error.message
            : "Voice service unavailable",
      },
      { status: 200 }
    );
  }
}
