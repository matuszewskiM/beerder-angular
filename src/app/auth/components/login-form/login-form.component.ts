import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserStore } from 'src/app/main/stores/user.store';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  @Input() public onSuccess!: Function;

  public constructor(
    private readonly userStore: UserStore,
    private readonly matDialog: MatDialog
  ) {}
  public loginForm = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
  });

  public get isNicknameValid(): boolean {
    return this.loginForm.get('nickname')!.valid;
  }

  public get isPasswordValid(): boolean {
    return this.loginForm.get('password')!.valid;
  }

  public onSubmit(): void {
    this.userStore.login(this.preparePayload());
  }

  private preparePayload(): {
    nickname: string;
    password: string;
    onSuccess: Function;
  } {
    return {
      nickname: this.loginForm.get('nickname')!.value!,
      password: this.loginForm.get('password')!.value!,
      onSuccess: () => this.closeDialog(),
    };
  }

  public closeDialog(): void {
    console.log(this.matDialog);
    this.matDialog.closeAll();
  }
}
