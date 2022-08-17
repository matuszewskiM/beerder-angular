import { ChangeDetectionStrategy, Component, OnInit, SecurityContext } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserStore } from '../../stores/user.store';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { MainStore } from '../../stores/main.store';
import { Category } from '../../types/category.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent implements OnInit {
  public postForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(32),
    ]),
    categories: new FormControl<Category[]>([], [Validators.required]),
  });

  public categories$ = this.mainStore.categories$;

  public isFetching$ = this.mainStore.isFetchingPostCreate$

  public file: File | null = null;

  public constructor(
    private readonly toastr: ToastrService,
    private readonly matDialog: MatDialog,
    private readonly userStore: UserStore,
    private readonly mainStore: MainStore, 
    private readonly domSanitizer: DomSanitizer,
  ) {}

  public onSubmit(): void {
    this.mainStore.createPost({data: this.preparePayload(), onSuccess: () => this.matDialog.closeAll()})
  }

  public get isFormValid(): boolean {
    return (
      this.isTitleValid &&
      this.selectedCategories?.length! >= 2 &&
      this.file !== null
    );
  }

  public get imageSrc() {
    if (this.file) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file))
    }

    return null
  }

  public get isTitleValid(): boolean {
    return this.postForm.get('title')!.valid;
  }

  public get selectedCategories(): Category[] | null {
    return this.postForm.get('categories')!.value;
  }

  public setSelectedCategories(categories: Category[] | null): void {
    this.postForm.get('categories')!.setValue(categories);
  }

  ngOnInit(): void {
    this.mainStore.getCategories('trigger');
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

  public onFileRemove(): void {
    this.file = null
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

  public preparePayload(): FormData {
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value!);
    formData.append('image', this.file!)
    const categories = this.postForm
      .get('categories')!
      .value!
      categories.forEach(category => formData.append('categoryIds', `${category}`))
      console.log(this.file)
    return formData;
  }
}
