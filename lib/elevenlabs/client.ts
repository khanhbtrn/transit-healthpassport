export function isElevenLabsConfigured() {
  return Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
}

export async function synthesizeSpeech(text: string): Promise<{
  audioBase64: string | null;
  simulated: boolean;
  message: string;
}> {
  if (!isElevenLabsConfigured()) {
    return {
      audioBase64: null,
      simulated: true,
      message:
        "ElevenLabs credentials unavailable. Using simulated audio playback.",
    };
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        // Latest ElevenLabs speech model (most expressive; multilingual)
        model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_v3",
      }),
    }
  );

  if (!response.ok) {
    return {
      audioBase64: null,
      simulated: true,
      message: "ElevenLabs request failed. Falling back to simulated playback.",
    };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    audioBase64: buffer.toString("base64"),
    simulated: false,
    message: "Generated with ElevenLabs",
  };
}
