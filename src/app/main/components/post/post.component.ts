import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MainStore } from '../../stores/main.store';
import { UserStore } from '../../stores/user.store';
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly mainStore: MainStore,
    private readonly userStore: UserStore
  ) {}
  @Input() public post!: Post;

  public isLoggedIn$ = this.userStore.isLoggedIn$;

  public navigateToPost(): void {
    this.router.navigateByUrl(`/posts/${this.post.id}`);
  }

  public ratePost(): void {
    console.log(this.post)
    this.mainStore.ratePost(this.post.id);
  }
}
