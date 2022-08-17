import { Injectable } from '@angular/core';
import { Post } from '../types/post.interface';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { PostService } from '../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../types/category.interface';
import { environment } from 'src/environments/environment';
import { Comment } from '../types/comment.interface';
import { Router } from '@angular/router';

export interface MainState {
  postsList: Post[];
  post: Post | null;
  results: number;
  categories: Category[];
  isFetching: FetchingKey[]
}

export enum FetchingKey {
  'postList',
  'post',
  'auth',
  'comments',
  'postCreate'
}

@Injectable({ providedIn: 'root' })
export class MainStore extends ComponentStore<MainState> {
  constructor(
    private readonly postService: PostService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    super({ postsList: [], post: null, results: 0, categories: [], isFetching: []});
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

  public readonly isFetchingPostList$: Observable<boolean> = this.select(
    (state) => state.isFetching.includes(FetchingKey.postList)
  );

  public readonly isFetchingPost$: Observable<boolean> = this.select(
    (state) => state.isFetching.includes(FetchingKey.post)
  );
  
  public readonly isFetchingPostCreate$: Observable<boolean> = this.select(
    (state) => state.isFetching.includes(FetchingKey.postCreate)
  );
  
  public readonly isFetchingComments$: Observable<boolean> = this.select(
    (state) => state.isFetching.includes(FetchingKey.comments)
  );

  private readonly setPost = this.updater((state, post: Post) => ({
    ...state,
    isFetching: state.isFetching.filter(key => key !== FetchingKey.post),
    post: {...post, imagePath: `${environment.apiUrl}/${post.imagePath}`},
  }));

  private readonly setPostsList = this.updater((state, postsList: Post[]) => ({
    ...state,
    isFetching: state.isFetching.filter(key => key !== FetchingKey.postList),
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
      ? { 
          ...state, 
          isFetching: state.isFetching.filter(key => key !== FetchingKey.post),
          post: {...newPost, imagePath: `${environment.apiUrl}/${newPost.imagePath}`}
          
        }
      : {
          ...state,
          isFetching: state.isFetching.filter(key => key !== FetchingKey.postList),
          postsList: [...state.postsList].map((post) =>
            post.id === newPost.id ? {...newPost, imagePath: `${environment.apiUrl}/${newPost.imagePath}`} : post
          ),
        }
  );

  private refreshCommentRating = this.updater((state, newComment: Comment) => 
  ({...state, 
    post: 
      {...state.post!, 
        comments: state.post?.comments?.map(prev => prev.id ===newComment.id ? newComment : prev)}}));

  private setFetchingKey = this.updater((state, key: FetchingKey) => ({...state, isFetching: [...state.isFetching, key]}))

  private removeFetchingKey = this.updater((state, key: FetchingKey) => ({...state,  isFetching: state.isFetching.filter(value => value !== key)}))

  public readonly getPost = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      switchMap((id) => {
        this.setFetchingKey(FetchingKey.post)
        return this.postService.fetchPost(id).pipe(
          tap(
            (post) => {
              this.setPost(post);
              console.log(post);
            },
          ),
          catchError(() => {
            this.removeFetchingKey(FetchingKey.post)
            this.toastr.error('Error');
            return of();
          })
        )
      }
        
      )
    );
  });

  public readonly getPostsList = this.effect(
    (
      queryParams$: Observable<{
        page: number;
        pageSize: number;
        categoryId?: number;
        sorting: string;
      }>
    ) => {
      return queryParams$.pipe(
        switchMap(({ page, pageSize, categoryId, sorting }) =>
        {
          this.setFetchingKey(FetchingKey.postList)
          return this.postService.fetchPostsList(page, pageSize,sorting, categoryId).pipe(
            tap(({ posts, results }) => {
                this.setPostsList(posts), this.setResults(results);
              }),
            catchError(() => {
              this.removeFetchingKey(FetchingKey.postList)
              this.toastr.error('Error');
              return of();
            })
          )
        }
        )
      );
    }
  );

  public readonly createComment = this.effect(
    (payload$: Observable<{ postId: number; body: string }>) => {
      return payload$.pipe(
        switchMap(({ postId, body }) =>
        {
          this.setFetchingKey(FetchingKey.comments)
          return this.postService.createComment(postId, body).pipe(
            tap((post) => {
                this.removeFetchingKey(FetchingKey.comments)
                this.getPost(postId);
            }),
            catchError(() => {
              this.toastr.error('Error');
              this.removeFetchingKey(FetchingKey.comments)
              return of();
            })
          )
        }
          
        )
      );
    }
  );

  public readonly createPost = this.effect(
    (payload$: Observable<{ data: FormData, onSuccess?: () => void }>) => {
      return payload$.pipe(
        switchMap(({ data, onSuccess }) =>
        {
          this.setFetchingKey(FetchingKey.postCreate)
          return this.postService.createPost(data).pipe(
            tap((post) => {
              if (onSuccess) {
                onSuccess()
              }
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                this.router.navigate([`posts/${post.id}`]))
              this.removeFetchingKey(FetchingKey.postCreate)          
            }),
            catchError(() => {
              this.toastr.error('Error');
              this.removeFetchingKey(FetchingKey.postCreate)
              return of();
            })
          )
        })
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
