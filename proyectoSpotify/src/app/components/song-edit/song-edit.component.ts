import { SongService } from './../../services/song.service';
import { Song } from './../../models/song';
import { UploadService } from './../../services/upload.service';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-song-edit',
  templateUrl: './../song-add/song-add.component.html',//use template album-add
  styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements OnInit {
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public nameFile:string;
  public alertMessage;
  public is_Edit;
  public filesToUpload: Array<File>;
  public loadedAudio = false;
  public urlAudio;
 
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _uploadService: UploadService,
  ) {
    this.titulo = 'Editar Canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('', '', '', '', '');
    this.is_Edit = true;
    this.nameFile= "estavacio";
  }

  ngOnInit() {
    this.getSong();
  }

  getSong() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._songService.getSong(this.token, id).subscribe(
        result => {
          if (!result['song']) {
            this.alertMessage = "Error en el servidor";
          } else {
            this.song = result['song'];
            this.urlAudio= this.url+'get-file-song/'+this.song.file;
            this.loadedAudio = true; //need time for load url
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

      this._songService.editSong(this.token, id, this.song).subscribe(
        result => {
          if (!result['song']) {
            this.alertMessage = "Error en el servidor";
          } else {
            
            if (!this.filesToUpload) {              
              //this._router.navigate(['/artista', this.song.artist['_id']])
            } else {
              this.alertMessage = "¡La canción se ha actualizado correctamente!";            
               this.uploadFile(id);
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
      );      
    }); 

  }



  uploadFile(id){    
    let url = this.url + 'upload-file-song/' + id;
    let params = [];
    let name = 'file';
    this._uploadService.makeFileRequest(url, params, this.filesToUpload, this.token, name)
      .then(
        result => {
          this._router.navigate(['/album', this.song.album['_id']])
        },
        error => {
          console.log(error);
        }
      );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

}
