import { SongService } from './../../services/song.service';
import { Song } from './../../models/song';
import { Album } from './../../models/album';
import { AlbumService } from './../../services/album.service';
import { UploadService } from './../../services/upload.service';
import { Component, OnInit } from '@angular/core';
import { ArtistService } from './../../services/artist.service';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  public album: Album;
  public songs: Song[];
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
    private _albumService: AlbumService,
    private _songService: SongService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
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
            this.alertMessage = "Error en el servidor";
            this._router.navigate(['/']);
          } else {
            this.album = result['album'];
            //console.log(this.album);
            this.getSongs(id);
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
    });//Fin route

  }

  getSongs(albumId) {
    this._songService.getSongs(this.token, albumId).subscribe(
      result => {
        if (!result['song']) {
          this.alertMessage = "Este album no tiene caciones";
        } else {
          this.songs = result['song'];
          //console.log(this.songs);

        }
      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          //this.alertRegister = error.error.message;
          console.log(error);
        }
      }
    );//Fin service
  }

  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelAlbum() {
    this.confirmado = null;
  }

  onDeleteAlbum(id) {
    this._songService.deleteSong(this.token, id).subscribe(
      result => {
        if (!result['song']) {
          alert('Error en el servidor')
        } else {
          this.getAlbum();
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

  startPlayer(song) {
    let song_player = JSON.stringify(song);//el objeto cancion lo paso a json
    localStorage.setItem('sound_song', song_player)

    let file_path = this.url + 'get-file-song/' + song.file;
    let image_path = this.url + 'get-image-album/' + song.album.image;

    //cambiar la musica que esta otro componente:
    document.getElementById("mp3-source").setAttribute("src", file_path);
    document.getElementById("play-image-album").setAttribute("src", image_path);
    document.getElementById("play-song-title").innerHTML = song.name;
    document.getElementById("play-song-artist").innerHTML = song.album.artist.name;

    //son metodos del reproductor para cargar la cancion
    (document.getElementById("player") as any).load();
    (document.getElementById("player") as any).play();

  }

}
