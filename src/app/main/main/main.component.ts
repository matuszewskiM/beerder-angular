import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../components/dialogs/post-dialog/post-dialog.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  constructor(
    private readonly userStore: UserStore,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userStore.getCurrentUserInfo('trigger');
  }

  public openPostFormDialog(): void {
    this.matDialog.open(PostDialogComponent);
  }
}
