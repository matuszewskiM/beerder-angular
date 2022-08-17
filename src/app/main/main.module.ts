import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { MatCardModule } from '@angular/material/card';
import { MainRoutingModule } from './main-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { PostComponent } from './components/post/post.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthModule } from '../auth/auth.module';
import { LoginDialogComponent } from './components/dialogs/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/dialogs/register-dialog/register-dialog.component';
import { PostService } from './services/post.service';
import { HttpClientModule } from '@angular/common/http';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostDialogComponent } from './components/dialogs/post-dialog/post-dialog.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DateLocalePipe } from '../shared/pipes/date-locale.pipe';


@NgModule({
  declarations: [
    MainComponent,
    PostComponent,
    PostsListComponent,
    NavBarComponent,
    CategoriesComponent,
    RegisterDialogComponent,
    LoginDialogComponent,
    PostDetailsComponent,
    PostDialogComponent,
    PostFormComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MainRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    MatPaginatorModule,
    MatMenuModule,
    NgxFileDropModule,
    MatDialogModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgxFileDropModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    DateLocalePipe,
  ],
  providers: [PostService],
})
export class MainModule {}
