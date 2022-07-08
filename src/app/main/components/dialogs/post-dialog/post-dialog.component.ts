import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
