import { NextRequest, NextResponse } from 'next/server';
import { BookFormData } from '@/lib/types';
import { STORY_SYSTEM_PROMPT, buildStoryUserPrompt } from '@/lib/prompts';

interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
}

interface StoryResponse {
  title: string;
  dedication: string;
  characterDescription: string;
  pages: StoryPage[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formData: BookFormData = body.formData;

    const userPrompt = buildStoryUserPrompt(formData);

    const messageContent = formData.childPhoto
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: formData.childPhoto.mediaType,
              data: formData.childPhoto.data,
            },
          },
          { type: 'text', text: userPrompt },
        ]
      : userPrompt;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: STORY_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: messageContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error: ${err}`);
    }

    const data = await response.json();
    const rawText: string = data.content[0].text;

    let parsed: StoryResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse story JSON from Claude response.');
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (!parsed.title || !parsed.dedication || !parsed.characterDescription || !Array.isArray(parsed.pages)) {
      throw new Error('Invalid story structure returned from Claude.');
    }
    if (parsed.pages.length !== 12) {
      throw new Error(`Expected 12 pages, got ${parsed.pages.length}.`);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error generating story.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
