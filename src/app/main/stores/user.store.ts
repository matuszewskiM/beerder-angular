import { Injectable } from '@angular/core';
import { Post } from '../types/post.interface';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../types/user.interface';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserStore extends ComponentStore<UserState> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {
    super({ currentUser: null, isLoggedIn: false });
  }

  public readonly currentUser$: Observable<User | null> = this.select(
    (state) => state.currentUser
  );

  public readonly isLoggedIn$: Observable<boolean> = this.select(
    (state) => state.isLoggedIn
  );

  private readonly setCurrentUser = this.updater(
    (state, currentUser: User | null) => ({ ...state, currentUser })
  );

  private readonly setIsLoggedIn = this.updater(
    (state, isLoggedIn: boolean) => ({ ...state, isLoggedIn })
  );

  public readonly logout = this.effect((trigger$: Observable<any>) => {
    return trigger$.pipe(
      switchMap(() => {
        this.setCurrentUser(null);
        this.setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        return of();
      })
    );
  });

  public readonly login = this.effect(
    (
      loginRequest$: Observable<{
        nickname: string;
        password: string;
        onSuccess: Function;
      }>
    ) => {
      return loginRequest$.pipe(
        switchMap(({ nickname, password, onSuccess }) =>
          this.authService.login({ nickname, password }).pipe(
            tap({
              next: ({ accessToken }) => {
                localStorage.setItem('accessToken', accessToken);
                this.getCurrentUserInfo('trigger');
                onSuccess();
              },
              error: (e) => this.toastr.error(e),
            }),
            catchError((e) => {
              this.toastr.error(e);
              return of();
            })
          )
        )
      );
    }
  );

  public readonly createAccount = this.effect(
    (
      registerRequest$: Observable<{
        nickname: string;
        password: string;
        onSuccess: Function;
      }>
    ) => {
      return registerRequest$.pipe(
        switchMap(({ nickname, password, onSuccess }) =>
          this.authService.register({ nickname, password }).pipe(
            tap({
              next: () => {
                onSuccess();
              },
              error: (e) => this.toastr.error(e),
            }),
            catchError((e) => {
              this.toastr.error(e);
              return of();
            })
          )
        )
      );
    }
  );

  public readonly getCurrentUserInfo = this.effect(
    (trigger$: Observable<any>) => {
      return trigger$.pipe(
        switchMap(() =>
          this.userService.getUserInfo().pipe(
            tap({
              next: (user) => {
                this.setCurrentUser(user);
                this.setIsLoggedIn(true);
                console.log('jest info');
              },
              error: (e) => this.toastr.error(e),
            }),
            catchError(() => {
              this.toastr.error('Error');
              return of();
            })
          )
        )
      );
    }
  );
}
