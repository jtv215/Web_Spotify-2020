import { Album } from './../../models/album';
import { AlbumService } from './../../services/album.service';
import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ArtistService } from './../../services/artist.service';
import { Artist } from './../../models/artist';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-artist-detil',
  templateUrl: './artist-detil.component.html',
  styleUrls: ['./artist-detil.component.css']
})
export class ArtistDetilComponent implements OnInit {
  public artist: Artist;
  public albums: Album[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_Edit;
  public fileToUpload;
  public confirmado;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _uploadService: UploadService,
    private _albumService: AlbumService,

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.is_Edit = true;
  }


  ngOnInit() {
    this.getArtists();
  }

  getArtists() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe(
        result => {
          if (!result['artist']) {
            this.alertMessage = "Error en el servidor";
            this._router.navigate(['/']);
          } else {
            this.artist = result['artist'];

             this.getAlbums(this.artist['_id']);

          }
        },
        error => {
          var errMenssage = <any>error;
          if (errMenssage != null) {
            //this.alertRegister = error.error.message;
            console.log(error);
          }
        }
      );
    });
  }

  getAlbums(artistId) {
    this._albumService.getAlbums(this.token, artistId).subscribe(
      result => {
        if (!result['albums']) {
          this.alertMessage = "Error en el servidor";
          this._router.navigate(['/']);
        } else {
          this.albums = result['albums'];
          //console.log(this.albums);
        }
      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          console.log(error);
        }
      }
    );
  }

  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelAlbum() {
    this.confirmado = null;
  }

  onDeleteAlbum(id) {
    this._albumService.deleteAlbum(this.token, id).subscribe(
      result => {
        if (!result['album']) {
          alert('Error en el servidor')
          this._router.navigate(['/']);
        } else {
          this.getArtists();
        }
      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          console.log(error);
        }
      }
    );
  }

}
