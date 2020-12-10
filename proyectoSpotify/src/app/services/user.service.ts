import { GLOBAL } from './global';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; //npm install --save rxjs-compat

/*sustituye
import { Http, Response, Headers } from '@angular/http';//npm install @angular/http@latest
import { observable } from 'rxjs'; npm install --save rxjs-compat
*/
const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public identity;
  public token;
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  signUp(user, gethash = null): Observable<any> {
    if (gethash != null) {
      user.gethash = gethash;
    }
    let json = JSON.stringify(user);
    let params = json;

    return this._http.post(this.url + 'login', params, httpOptions);
  }



  register(user): Observable<any> {
    let params = JSON.stringify(user);
    return this._http.post(this.url + 'register', params, httpOptions);


  }

  udpateUser(user): Observable<any> {
    let params = JSON.stringify(user);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': this.getToken()
      })
    };

    return this._http.put(this.url + 'update-user/' + user._id, params, httpOptions);
  }

}
