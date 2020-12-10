import { GLOBAL } from './global';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  public identity;
  public token;
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getSong(token, id): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };
    return this._http.get(this.url + 'song/' + id, httpOptions);
  }

  getSongs(token, albumId = null): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    if (albumId == null) {
      return this._http.get(this.url + 'songs/', httpOptions);
    } else {
      return this._http.get(this.url + 'songs/' + albumId, httpOptions);
    }

  }

  addSong(token, song): Observable<any> {
    let params = JSON.stringify(song);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.post(this.url + 'song', params, httpOptions);
  }

  editSong(token, id, song): Observable<any> {
    let params = JSON.stringify(song);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.put(this.url + 'song/' + id, params, httpOptions);
  }

  deleteSong(token, id): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };
    return this._http.delete(this.url + 'song/' + id, httpOptions);
  }

}
