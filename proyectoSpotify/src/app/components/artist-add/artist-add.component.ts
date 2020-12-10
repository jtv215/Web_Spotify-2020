import { ArtistService } from './../../services/artist.service';
import { Artist } from './../../models/artist';
import { GLOBAL } from './../../services/global';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css']
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
  ) {
    this.titulo = 'Crear Artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '');
  }

  ngOnInit() { }

  onSubmit() {
    //console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(
      result => {
        if (!result['artist']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "El artista se ha creado correctamente";
          this.artist = result['artist'];
          //console.log(result['artist']._id);
          this._router.navigate(['editar-artista/'+result['artist']._id]);
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
  }

}