import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, skip, Subscription, take, tap } from 'rxjs';
import { MainStore } from '../../stores/main.store';
import { Category } from '../../types/category.interface';
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsListComponent implements OnInit, OnDestroy {
  public constructor(
    private readonly mainStore: MainStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  private subscription = new Subscription();

  public filters: {page: number; pageSize: number; categoryId?: number, sorting: string} = { page: 1, pageSize: 10, sorting: 'newest' };

  public filtersChanged(event: PageEvent): void {
    this.filters = { ...this.filters, page: event.pageIndex + 1, pageSize: event.pageSize };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.setQueryParams()
    this.getPostsList();
  }

  public onCategoryChange(id: number) {
    this.filters = {...this.filters, sorting: 'newest', page: 1, categoryId: id}
    this.setQueryParams()
    this.getPostsList()
  }

  public setQueryParams(): void {
    const queryParams: Params = {
      page: this.filters.page,
      pageSize: this.filters.pageSize,
      categoryId: this.filters.categoryId,
      sorting: this.filters.sorting
    }

    this.router.navigate([], {
      replaceUrl: true,
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
  }

  public categories$ = this.mainStore.categories$;

  public posts$ = this.mainStore.postsList$;
  public results$ = this.mainStore.results$;

  public isFetching$ = this.mainStore.isFetchingPostList$

  public ngOnInit(): void {
    this.setInitialStateFromQuery()
    this.getPostsList();
    this.getCategoryList()
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  private getPostsList(): void {
    this.mainStore.getPostsList(this.filters);
  }

  private getCategoryList(): void {
    this.mainStore.getCategories('trigger')
  }

  private setInitialStateFromQuery(): void {
    this.route.queryParams
      .pipe(
        take(1),
        tap((params) => {
          const pageSize = parseInt(params['pageSize'])
          const page = parseInt(params['page'])
          const sorting = params['sorting']

          this.filters = {
            ...this.filters,
            page: isNaN(page) ? 1 : page,
            pageSize: isNaN(pageSize) ? 10 : pageSize,
            sorting
          }
        })
      ).subscribe()

    this.subscription.add(this.route.queryParams
    .pipe(
      skip(1),
      tap((params) => {
        const sorting = params['sorting']

        if (sorting !== this.filters.sorting) {
          this.filters = {
            page: 1,
            pageSize: 10,
            sorting
          }
          this.getPostsList()
          return
        }
        this.filters = {...this.filters, sorting}
        this.getPostsList()
      })
    ).subscribe())
  }
}
