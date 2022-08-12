import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, of } from 'rxjs';
import { MainStore } from '../../stores/main.store';
import { Category } from '../../types/category.interface';
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsListComponent implements OnInit {
  public constructor(private readonly mainStore: MainStore) {}

  public filters: {page: number; pageSize: number; categoryId?: number} = { page: 1, pageSize: 10 };

  public filtersChanged(event: PageEvent): void {
    this.filters = { page: event.pageIndex + 1, pageSize: event.pageSize };
    console.log(this.filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.getPostsList();
  }

  public onCategoryChange(id: number) {
    this.filters = {...this.filters, categoryId: id}
    this.getPostsList()
  }

  public categories$ = this.mainStore.categories$;

  public posts$ = this.mainStore.postsList$;
  public results$ = this.mainStore.results$;

  public ngOnInit(): void {
    this.getPostsList();
    this.getCategoryList()
  }

  private getPostsList(): void {
    this.mainStore.getPostsList(this.filters);
  }

  private getCategoryList(): void {
    this.mainStore.getCategories('trigger')
  }
}
