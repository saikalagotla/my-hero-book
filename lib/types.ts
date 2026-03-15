export interface BookFormData {
  childName: string;
  age: number;
  pronouns: string[];
  traits: string[];
  themes: string[];
  friendName: string;
  childPhoto?: { data: string; mediaType: string };
}

export interface BookPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl: string;
}

export interface GeneratedBook {
  title: string;
  pages: BookPage[];
  dedication: string;
  characterDescription: string;
}
