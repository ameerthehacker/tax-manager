import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { tokenNotExpired } from "angular2-jwt";

import { Router } from "@angular/router";

import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/Rx";

@Injectable()
export class AuthService {
  constructor(private http: Http, private router: Router) {}

  getURL(url: string): string {
    return `${environment.baseUrl}/${url}`;
  }

  login(username: string, password: string): Promise<Object> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return new Promise<Object>((resolve, reject) => {
      this.http
        .post(
          this.getURL("auth/login"),
          {
            username: username,
            password: password
          },
          { headers: headers }
        )
        .map((result: Response) => result.json())
        .catch((err: any) => {
          reject(err);
          return Observable.throw(err);
        })
        .subscribe(result => {
          if (!result.error) {
            localStorage.username = result.username;
            localStorage.token = result.token;
          }
          resolve(result);
        });
    });
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return tokenNotExpired();
  }

  interceptRequest(observable: Observable<Response>): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      observable
        .map((result: Response) => result.json())
        .catch((err: any) => {
          if (err.status == 403) {
            this.router.navigate(["/auth/login"]);
          }
          reject(err);
          return Observable.throw(err);
        })
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  getHeaders() {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + token);
    headers.append("Content-Type", "application/json");

    return headers;
  }

  get(url: string): Promise<any> {
    const observable: Observable<Response> = this.http.get(this.getURL(url), {
      headers: this.getHeaders()
    });

    return this.interceptRequest(observable);
  }

  post(url: string, body: Object): Promise<any> {
    const observable: Observable<Response> = this.http.post(
      this.getURL(url),
      JSON.stringify(body),
      {
        headers: this.getHeaders()
      }
    );

    return this.interceptRequest(observable);
  }
}
