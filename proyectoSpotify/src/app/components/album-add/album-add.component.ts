import { AlbumService } from './../../services/album.service';
import { Album } from './../../models/album';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css']
})
export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public album1: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
  ) {
    this.titulo = 'Crear nuevo album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album1 = new Album('', '', '2017', '', '');
  }

  ngOnInit() {

  }

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let artistId = params['artist'];
      this.album1.artist = artistId;
    });

    this._albumService.addAlbum(this.token, this.album1).subscribe(
      result => {
        if (!result['album']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "El album se ha creado correctamente"
          this.album1 = result['album'];
          //console.log(result['album']._id)
          this._router.navigate(['/editar-album', result['album']._id]);

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

  }




}
