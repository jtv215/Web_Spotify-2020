import { Artist } from './../models/artist';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  public identity;
  public token;
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }


  getArtist(token, id: string): Observable<any> {
    let httpOptions2 = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.get(this.url + 'artist/' + id, httpOptions2);
  }

  getArtists(token, page): Observable<any> {
    let httpOptions2 = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.get(this.url + 'artists/' + page, httpOptions2);
  }


  addArtist(token, artist: Artist): Observable<any> {
    let params = JSON.stringify(artist);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.post(this.url + 'artist', params, httpOptions);
  }

  editArtist(token, id: string, artist: Artist): Observable<any> {
    let params = JSON.stringify(artist);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.put(this.url + 'artist/' + id, params, httpOptions);
  }

  deleteArtist(token, id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': token
      })
    };

    return this._http.delete(this.url + 'artist/' + id, httpOptions);
  }


}
