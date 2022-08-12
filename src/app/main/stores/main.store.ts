import { Injectable } from '@angular/core';
import { Post } from '../types/post.interface';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../types/category.interface';
import { environment } from 'src/environments/environment';
import { Comment } from '../types/comment.interface';

export interface MainState {
  postsList: Post[];
  post: Post | null;
  results: number;
  categories: Category[];
}

@Injectable({ providedIn: 'root' })
export class MainStore extends ComponentStore<MainState> {
  constructor(
    private readonly postService: PostService,
    private readonly toastr: ToastrService
  ) {
    super({ postsList: [], post: null, results: 0, categories: [] });
  }

  public readonly postsList$: Observable<Post[]> = this.select(
    (state) => state.postsList
  );

  public readonly post$: Observable<Post | null> = this.select(
    (state) => state.post
  );

  public readonly results$: Observable<number> = this.select(
    (state) => state.results
  );

  public readonly categories$: Observable<Category[]> = this.select(
    (state) => state.categories
  );

  private readonly setPost = this.updater((state, post: Post) => ({
    ...state,
    post: {...post, imagePath: `${environment.apiUrl}/${post.imagePath}`},
  }));

  private readonly setPostsList = this.updater((state, postsList: Post[]) => ({
    ...state,
    postsList: postsList.map(post => ({...post, imagePath: `${environment.apiUrl}/${post.imagePath}`})),
  }));

  private readonly setResults = this.updater((state, results: number) => ({
    ...state,
    results: results,
  }));

  private readonly setCategories = this.updater(
    (state, categories: Category[]) => ({
      ...state,
      categories,
    })
  );

  private refreshPostRating = this.updater((state, newPost: Post) =>
    state.post
      ? { ...state, post: {...newPost, imagePath: `${environment.apiUrl}/${newPost.imagePath}`} }
      : {
          ...state,
          postsList: [...state.postsList].map((post) =>
            post.id === newPost.id ? newPost : post
          ),
        }
  );

  private refreshCommentRating = this.updater((state, newComment: Comment) => 
  ({...state, 
    post: 
      {...state.post!, 
        comments: state.post?.comments?.map(prev => prev.id ===newComment.id ? newComment : prev)}}));

  public readonly getPost = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      switchMap((id) =>
        this.postService.fetchPost(id).pipe(
          tap({
            next: (post) => {
              this.setPost(post);
              console.log(post);
            },
            error: () => this.toastr.error('Error'),
          }),
          catchError(() => {
            this.toastr.error('Error');
            return of();
          })
        )
      )
    );
  });

  public readonly getPostsList = this.effect(
    (
      queryParams$: Observable<{
        page: number;
        pageSize: number;
        categoryId?: number;
      }>
    ) => {
      return queryParams$.pipe(
        switchMap(({ page, pageSize, categoryId }) =>
          this.postService.fetchPostsList(page, pageSize, categoryId).pipe(
            tap({
              next: ({ posts, results }) => {
                this.setPostsList(posts), this.setResults(results);
              },
              error: () => this.toastr.error('Error'),
            }),
            catchError(() => {
              this.toastr.error('Error');
              return of();
            })
          )
        )
      );
    }
  );

  public readonly createComment = this.effect(
    (payload$: Observable<{ postId: number; body: string }>) => {
      return payload$.pipe(
        switchMap(({ postId, body }) =>
          this.postService.createComment(postId, body).pipe(
            tap({
              next: (post) => {
                console.log(post);
                this.getPost(postId);
              },
              error: () => this.toastr.error('Error'),
            }),
            catchError(() => {
              this.toastr.error('Error');
              return of();
            })
          )
        )
      );
    }
  );

  public readonly createPost = this.effect(
    (payload$: Observable<{ data: FormData, onSuccess?: () => void }>) => {
      return payload$.pipe(
        switchMap(({ data, onSuccess }) =>
          this.postService.createPost(data).pipe(
            tap({
              next: (post) => {
                if (onSuccess) {
                  onSuccess()
                }
              },
              error: () => this.toastr.error('Error'),
            }),
            catchError(() => {
              this.toastr.error('Error');
              return of();
            })
          )
        )
      );
    }
  );

  public readonly ratePost = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      switchMap((id) =>
        this.postService.ratePost(id).pipe(
          tap({
            next: (post) => {
              console.log(post);
              this.refreshPostRating(post);
            },
            error: () => this.toastr.error('Errpr'),
          }),
          catchError(() => {
            this.toastr.error('Error');
            return of();
          })
        )
      )
    );
  });

  public readonly rateComment = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      switchMap((id) =>
        this.postService.rateComment(id).pipe(
          tap({
            next: (comment) => {
              console.log(comment);
              this.refreshCommentRating(comment);
            },
            error: () => this.toastr.error('Errpr'),
          }),
          catchError(() => {
            this.toastr.error('Error');
            return of();
          })
        )
      )
    );
  });

  public readonly getCategories = this.effect((trigger$: Observable<any>) => {
    return trigger$.pipe(
      switchMap((i) =>
        this.postService.getCategories().pipe(
          tap({
            next: (categories) => {
              this.setCategories(categories);
            },
            error: () => this.toastr.error('Errpr'),
          }),
          catchError(() => {
            this.toastr.error('Error');
            return of();
          })
        )
      )
    );
  });
}
