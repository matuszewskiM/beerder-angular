export interface Comment {
  body: string;
  author: { id: number; nickname: string };
  date: Date;
  rating: number;
}
