import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  public constructor(private readonly httpClient: HttpClient) {}

  private readonly apiUrl = environment.apiUrl;

  public login(payload: {
    nickname: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    console.log('logn service', payload);
    const endpointUrl = `${this.apiUrl}/account/login`;
    return this.httpClient.post<{ accessToken: string }>(endpointUrl, payload);
  }

  public register(payload: {
    nickname: string;
    password: string;
  }): Observable<any> {
    const endpointUrl = `${this.apiUrl}/account/create`;
    return this.httpClient.post<any>(endpointUrl, payload);
  }
}
