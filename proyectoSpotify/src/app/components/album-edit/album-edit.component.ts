import { UploadService } from './../../services/upload.service';
import { AlbumService } from './../../services/album.service';
import { Album } from './../../models/album';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-album-edit',
  templateUrl: './../album-add/album-add.component.html',//use template in album-add
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public album1: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_Edit;
  public filesToUpload: Array<File>;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _uploadService: UploadService,
  ) {
    this.titulo = 'Editar Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album1 = new Album('', '', '2017', '', '');
    this.is_Edit = true;
  }

  ngOnInit() {
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        result => {
          if (!result['album']) {
            //this.alertMessage = "Error en el servidor";
            this._router.navigate(['/']);
          } else {
            // this.alertMessage = "El album se ha creado correctamente"
            this.album1 = result['album'];

          }
        },
        error => {
          var errMenssage = <any>error;
          if (errMenssage != null) {
            this.alertMessage = error.error.message;
            console.log(error);
          }
        }
      );
    });

  }


  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.editdAlbum(this.token, id, this.album1).subscribe(
        result => {
          if (!result['album']) {
            this.alertMessage = "Error en el servidor";
          } else {

            if (!this.filesToUpload) {
              this._router.navigate(['/artista', this.album1.artist['_id']])
            } else {
              this.alertMessage = "El album se ha actualizado correctamente"

              //**service: Subir Imagen**//
              let url = this.url + 'upload-image-album/' + id;
              let params = [];
              let name = 'image';
              this._uploadService.makeFileRequest(url, params, this.filesToUpload, this.token, name)
                .then(
                  result => {
                    console.log(this.album1);

                    this._router.navigate(['/artista', this.album1.artist['_id']])
                  },
                  error => {
                    console.log(error);
                  }
                );//Fin Service 
            }

          }
        },
        error => {
          var errMenssage = <any>error;
          if (errMenssage != null) {
            this.alertMessage = error.error.message;
            console.log(error);
          }
        }
      );//fin service      
    });//Fin params

  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
