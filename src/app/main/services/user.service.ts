import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../types/user.interface';

@Injectable()
export class UserService {
  public constructor(private readonly httpClient: HttpClient) {}

  private readonly apiUrl = environment.apiUrl;

  public getUserInfo(): Observable<User> {
    const endpointUrl = `${this.apiUrl}/account/me`;
    const settings = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('accessToken')!}`,
      }),
    };
    return this.httpClient.get<User>(endpointUrl, settings);
  }
}
