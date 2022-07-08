import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserStore } from '../../stores/user.store';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../dialogs/register-dialog/register-dialog.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly userStore: UserStore
  ) {}

  public user$ = this.userStore.currentUser$;
  public isLoggedIn$ = this.userStore.isLoggedIn$;

  public openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent);
  }

  public openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent);
  }

  public logout(): void {
    this.userStore.logout('trigger');
  }
}
