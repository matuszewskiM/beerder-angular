import { Category } from './category.interface';
import { Comment } from './comment.interface';

export interface Post {
  id: number;
  title: string;
  author: {
    id: number;
    nickname: string;
  };
  date: Date;
  imgPath: string;
  commentsCount: number;
  rating: number;
  categories: Category[];
  comments?: Comment[];
}
