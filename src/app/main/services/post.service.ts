import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../types/category.interface';
import { Comment } from '../types/comment.interface';
import { Post } from '../types/post.interface';

@Injectable()
export class PostService {
  public constructor(private readonly httpClient: HttpClient) {}

  private apiUrl = environment.apiUrl;

  private prepareSettings(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('accessToken')!}`,
      }),
    };
  }

  public fetchPostsList(
    page: number,
    pageSize: number,
    sorting: string,
    categoryId?: number,
  ): Observable<{ posts: Post[]; results: number }> {
    const categoryIdParam = categoryId ? `&categoryId=${categoryId}` : '';
    const endpointUrl =
      `${this.apiUrl}/posts?page=${page}&pageSize=${pageSize}&sorting=${sorting}` +
      categoryIdParam;
    return this.httpClient.get<{ posts: Post[]; results: number }>(endpointUrl, this.prepareSettings());
  }

  public fetchPost(id: number): Observable<Post> {
    const endpointUrl = `${this.apiUrl}/posts/${id}`;
    return this.httpClient.get<Post>(endpointUrl, this.prepareSettings());
  }

  public ratePost(id: number): Observable<Post> {
    const endpointUrl = `${this.apiUrl}/posts/rate/${id}`;
    return this.httpClient.post<Post>(endpointUrl, {}, this.prepareSettings());
  }

  public downratePost(id: number): Observable<Post> {
    const endpointUrl = `${this.apiUrl}/posts/rate/${id}`;
    return this.httpClient.post<Post>(endpointUrl, {}, this.prepareSettings());
  }

  public rateComment(id: number): Observable<Comment> {
    const endpointUrl = `${this.apiUrl}/comments/rate/${id}`;
    return this.httpClient.post<Comment>(
      endpointUrl,
      {},
      this.prepareSettings()
    );
  }

  public createComment(postId: number, body: string): Observable<Post> {
    const endpointUrl = `${this.apiUrl}/comments/${postId}`;
    return this.httpClient.post<Post>(
      endpointUrl,
      { body },
      this.prepareSettings()
    );
  }

  public createPost(data: FormData): Observable<Post> {
    const endpointUrl = `${this.apiUrl}/posts/create`;
    return this.httpClient.post<Post>(
      endpointUrl,
      data,
      this.prepareSettings()
    );
  }

  public getCategories(): Observable<Category[]> {
    const endpointUrl = `${this.apiUrl}/posts/categories`;
    return this.httpClient.get<Category[]>(endpointUrl, {});
  }
}
