import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ArtistService } from './../../services/artist.service';
import { Artist } from './../../models/artist';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Component({

  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.css']
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_Edit;
  public filesToUpload;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _uploadService: UploadService,
  ) {
    this.titulo = 'Editar Artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
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


  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._artistService.editArtist(this.token, id, this.artist).subscribe(
        result => {
          if (!result['artist']) {
            this.alertMessage = "Error en el servidor";
          } else {
            this.alertMessage = "El artista se ha actualizado correctamente";
            if (!this.filesToUpload) {
              this._router.navigate(['/artista',result['artist']._id]);
            } else {
              this.subirImagen(id);
            }
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


  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  subirImagen(id) {
    let url = this.url + 'upload-image-artist/' + id;
    let name = 'image';
    this._uploadService.makeFileRequest(url, [], this.filesToUpload, this.token, name)
      .then(
        result => {
        },
        error => {
          console.log(error);
        }
      );
  }

}
