export interface Comment {
  id: number;
  body: string;
  author: { id: number; nickname: string };
  date: Date;
  rating: number;
  isLiked: any
}
