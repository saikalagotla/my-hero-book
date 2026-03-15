import { NextRequest, NextResponse } from 'next/server';
import { buildImagePrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imagePrompt, characterDescription } = body as {
      imagePrompt: string;
      characterDescription: string;
    };

    const fullPrompt = buildImagePrompt(imagePrompt, characterDescription);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DALL-E API error: ${err}`);
    }

    const data = await response.json();
    const imageUrl = 'data:image/png;base64,' + data.data[0].b64_json;

    return NextResponse.json({ imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error generating image.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
