import { GLOBAL } from './global';
import { Album } from './../models/album';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  public identity;
  public token;
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getAlbum(token, id): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.get(this.url + 'album/' + id, httpOptions);
  }

  getAlbums(token, artistId = null): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    if (artistId == null) {
      return this._http.get(this.url + 'albums/', httpOptions);
    } else {
      return this._http.get(this.url + 'albums/' + artistId, httpOptions);
    }

  }

  addAlbum(token, album: Album): Observable<any> {
    let params = JSON.stringify(album);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.post(this.url + 'album', params, httpOptions);

  }

  editdAlbum(token, id, album): Observable<any> {
    let params = JSON.stringify(album);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.put(this.url + 'album/' + id, params, httpOptions);

  }

  deleteAlbum(token, id): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.delete(this.url + 'album/' + id, httpOptions);
  }

}
