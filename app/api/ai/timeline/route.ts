import { NextResponse } from "next/server";
import { z } from "zod";
import { reconstructTimeline } from "@/lib/ai/provider";

const bodySchema = z.object({
  text: z.string().min(1).max(20000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    const result = await reconstructTimeline(body.text);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to reconstruct timeline",
      },
      { status: 400 }
    );
  }
}
