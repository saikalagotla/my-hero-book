import { BookFormData } from './types';

export const STORY_SYSTEM_PROMPT = `You are a children's book author. Write warm, imaginative, age-appropriate stories.
Always respond with valid JSON only — no markdown, no explanation, no backticks.`;

export function buildStoryUserPrompt(formData: BookFormData): string {
  const { childName, age, pronouns, traits, themes, friendName, childPhoto } = formData;
  const friendLine = friendName
    ? `Their best friend is named ${friendName} and appears in the story.`
    : '';
  const characterDescriptionInstruction = childPhoto
    ? `- A photo of the child is attached. Look at it carefully and write the characterDescription to match their actual appearance: hair color and style, skin tone, facial features, and any notable clothing or style details. Be specific enough that an illustrator could recreate this child consistently across all pages.`
    : `- Also write a characterDescription: a brief, specific physical description of the child as they appear throughout the book (e.g. hair color/style, skin tone, clothing). This will be prepended to every image prompt to ensure visual consistency. Do not mention the child's name in this description.`;

  return `Write a 12-page personalized children's book for a ${age}-year-old named ${childName}.
Pronouns: ${pronouns.join(' / ')}. Personality traits: ${traits.join(' and ')}. Story themes: ${themes.join(' and ')}.
${friendLine}

Rules:
- Each page has exactly 2–3 short sentences. Simple words. Joyful tone.
- The child is the hero and solves the main challenge using their ${traits.join(' and ')} nature.
- Include a clear beginning (pages 1–3), middle challenge (pages 4–9), and happy resolution (pages 10–12).
- For each page, also write an imagePrompt: a single sentence describing the illustration for that page.
  IMPORTANT: In every imagePrompt, refer to the child only as "the child" — never use their name. Describe the scene and action clearly.
  The imagePrompt must place the child clearly in a ${themes.join(' and ')} setting.
  Style instruction to always include: "children's book watercolor illustration, soft pastel colors, friendly, no text in image"
${characterDescriptionInstruction}

Respond with this exact JSON structure:
{
  "title": "string (creative book title including the child's name)",
  "dedication": "string (a sweet 1-sentence dedication to ${childName})",
  "characterDescription": "string (e.g. 'a ${age}-year-old child with short black hair and warm brown skin, wearing a bright blue t-shirt and red sneakers')",
  "pages": [
    { "pageNumber": 1, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 2, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 3, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 4, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 5, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 6, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 7, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 8, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 9, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 10, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 11, "text": "string", "imagePrompt": "string" },
    { "pageNumber": 12, "text": "string", "imagePrompt": "string" }
  ]
}`;
}

export function buildImagePrompt(imagePrompt: string, characterDescription: string): string {
  return `${characterDescription}. ${imagePrompt}. Children's book watercolor illustration, soft pastel colors, warm and friendly, whimsical, no text or words anywhere in the image, suitable for ages 3-8, square format.`;
}
