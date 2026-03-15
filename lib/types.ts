export interface BookFormData {
  childName: string;
  age: number;
  pronouns: 'he/him' | 'she/her' | 'they/them';
  trait: 'brave' | 'curious' | 'kind' | 'funny' | 'creative';
  theme: 'space' | 'ocean' | 'forest' | 'magic' | 'dinosaurs';
  friendName: string;
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
}
