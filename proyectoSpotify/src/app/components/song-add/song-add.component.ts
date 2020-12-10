import { SongService } from './../../services/song.service';
import { Song } from './../../models/song';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css']
})
export class SongAddComponent implements OnInit {
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
  ) {
    this.titulo = 'Crear nuevo canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('1', '', '', '', '');
  }

  ngOnInit() {
  }


  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let albumId = params['albumId'];
      this.song.album = albumId;

      //console.log(this.song);
      this._songService.addSong(this.token, this.song).subscribe(
        result => {
          if (!result['song']) {
            this.alertMessage = "Error en el servidor";
          } else {
            this.alertMessage = "La canción se ha creado correctamente"
            this.song = result['song'];
            this._router.navigate(['/editar-cancion', result['song']._id]);
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

}
