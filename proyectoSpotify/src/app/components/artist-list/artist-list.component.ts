import { ArtistService } from './../../services/artist.service';
import { Artist } from './../../models/artist';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css']
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public next_page;
  public prev_page;
  public confirmado;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
  ) {
    this.titulo = 'Artistas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.next_page = 1;
    this.prev_page = 1;
  }

  ngOnInit() {
    this.getArtists();
  }

  getArtists() {
    this._route.params.forEach((params: Params) => {
      let page = +params['page'];
      if (!page) {
        page = 1;

      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        if (this.prev_page == 0) {
          this.prev_page = 1;
        }
      }

      this._artistService.getArtists(this.token, page).subscribe(
        result => {
          if (!result['artists']) {
            this._router.navigate(['/']);
          } else {
            this.artists = result['artists'];
          }
        },
        error => {
          var errMenssage = <any>error;
          if (errMenssage != null) {
            //this.alertRegister = error.error.message; d
            console.log(error);
          }
        }
      );
    });
  }



  onDeleteConfirm(id) {
    this.confirmado = id;
  }
  onCancelArtist() {
    this.confirmado = null;
  }
  onDeleteArtist(id) {
    this._artistService.deleteArtist(this.token, id).subscribe(
      result => {
        if (!result['artist']) {
          alert("error en el servidor")
        } else {
          this.getArtists();
        }
      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          //this.alertRegister = error.error.message; d
          console.log(error);
        }
      }
    );
  }

}
