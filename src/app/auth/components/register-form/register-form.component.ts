import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { MainStore } from 'src/app/main/stores/main.store';
import { UserStore } from 'src/app/main/stores/user.store';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
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

  public file: File | null = null;

  public constructor(
    private readonly toastr: ToastrService,
    private readonly matDialog: MatDialog,
    private readonly userStore: UserStore
  ) {}

  public get isNicknameValid(): boolean {
    return this.loginForm.get('nickname')!.valid;
  }

  public get isPasswordValid(): boolean {
    return this.loginForm.get('password')!.valid;
  }

  public dropped(file: NgxFileDropEntry[]) {
    if (file.length > 1) return;
    const droppedFile = file[0];
    if (
      droppedFile.fileEntry.isFile &&
      this.isFileAllowed(droppedFile.fileEntry.name)
    ) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if (this.isFileSizeAllowed(file.size)) {
          this.file = file;
        } else {
          this.toastr.error(
            'Max size of a file allowed is 1mb, files with size more than 1mb are discarded.'
          );
        }
      });
    } else {
      // It was a directory (empty directories are added, otherwise only files)
      this.toastr.error(
        "Only files in '.jpg', '.jpeg', '.png' format are accepted and directories are not allowed."
      );
      // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      // console.log(droppedFile.relativePath, fileEntry);
    }
  }

  private isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.jpg', '.jpeg', '.png'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }

  private isFileSizeAllowed(size: number) {
    let isFileSizeAllowed = false;
    if (size < 1000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log('leave');
  }

  public submit(): void {
    this.userStore.createAccount(this.preparePayload());
  }

  private preparePayload(): {
    nickname: string;
    password: string;
    onSuccess: Function;
  } {
    return {
      nickname: this.loginForm.get('nickname')!.value!,
      password: this.loginForm.get('password')!.value!,
      onSuccess: () => {
        this.closeDialog(), this.openSuccessToastr();
      },
    };
  }

  public closeDialog(): void {
    console.log(this.matDialog);
    this.matDialog.closeAll();
  }

  public openSuccessToastr(): void {
    this.toastr.success('Udało się załozyć konto');
  }

  public prepaparePayload(): any {
    return this.loginForm.value
  }

  // private preparePayload(): FormData {
  //   const payload =
  //   const payload = new FormData();
  //   payload.append('nickname', this.loginForm.get('nickname')!.value!);
  //   payload.append('password', this.loginForm.get('password')!.value!);
  //   this.file ? payload.append('image', this.file) : null;
  //   return payload;
  // }
}
