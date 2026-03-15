import { BookFormData } from './types';

export const STORY_SYSTEM_PROMPT = `You are a children's book author. Write warm, imaginative, age-appropriate stories.
Always respond with valid JSON only — no markdown, no explanation, no backticks.`;

export function buildStoryUserPrompt(formData: BookFormData): string {
  const { childName, age, pronouns, trait, theme, friendName } = formData;
  const friendLine = friendName
    ? `Their best friend is named ${friendName} and appears in the story.`
    : '';

  return `Write a 12-page personalized children's book for a ${age}-year-old named ${childName}.
Pronouns: ${pronouns}. Personality trait: ${trait}. Story theme: ${theme}.
${friendLine}

Rules:
- Each page has exactly 2–3 short sentences. Simple words. Joyful tone.
- The child is the hero and solves the main challenge using their ${trait} trait.
- Include a clear beginning (pages 1–3), middle challenge (pages 4–9), and happy resolution (pages 10–12).
- For each page, also write an imagePrompt: a single sentence describing the illustration for that page.
  The imagePrompt must describe a scene with ${childName} clearly visible, in a ${theme} setting.
  Style instruction to always include: "children's book watercolor illustration, soft pastel colors, friendly, no text in image"

Respond with this exact JSON structure:
{
  "title": "string (creative book title including the child's name)",
  "dedication": "string (a sweet 1-sentence dedication to ${childName})",
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

export function buildImagePrompt(imagePrompt: string): string {
  return `${imagePrompt}. Children's book watercolor illustration, soft pastel colors, warm and friendly, whimsical, no text or words anywhere in the image, suitable for ages 3-8, square format.`;
}
