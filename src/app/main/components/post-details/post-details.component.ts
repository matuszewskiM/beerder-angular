import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainStore } from '../../stores/main.store';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailsComponent implements OnInit {
  constructor(
    private readonly mainStore: MainStore,
    private readonly route: ActivatedRoute,
    private readonly userStore: UserStore
  ) {
    this.id = parseInt(this.route.snapshot.paramMap.get('id')!);
  }

  public commentBodyControl = new FormControl('', Validators.required);

  public post$ = this.mainStore.post$;
  public isLoggedIn$ = this.userStore.isLoggedIn$;
  private id: number;

  ngOnInit(): void {
    this.getPost();
  }

  public onSubmit(): void {
    const body = this.commentBodyControl.value!;
    this.mainStore.createComment({ postId: this.id, body });
  }

  private getPost(): void {
    this.mainStore.getPost(this.id);
  }
}
