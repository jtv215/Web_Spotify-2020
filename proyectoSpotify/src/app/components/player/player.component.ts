import { Song } from './../../models/song';
import { Component, OnInit } from '@angular/core';
import { GLOBAL } from './../../services/global';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  //styleUrls: ['./player.component.css']
  template:
    `
  <!--- Imagen izquierda --->
  <div class="album-image">
    <span *ngIf= "song.album">
      <img id="play-image-album" src="{{url +'get-image-album/'+song.album.image}}"/>  
    </span>
    <span *ngIf= "!song.album">
      <img id="play-image-album" src="assets/images/default.jpg"/>  
    </span>
  </div>
  
  <!--- Contenido a la derecha --->
    <div class="audio-file">
      <p> Reproduciendo</p> 
      <span id="play-song-title"> {{song.name}}</span>
      |
      <span id="play-song-artist"> 
        <span *ngIf="song.album.artist">
          {{song.album.artist.name}}
        </span>
      </span>

      <!--- Contenido reproductor--->
      <audio controls id="player">
       <source id="mp3-source" src="{{url+'get-file-song/'+ song.file}}" type="audio/mpeg" > 
       <!--<source id="mp3-source" src="file:///c:/a.mp3" type="audio/mpeg" >     --> 
        El navegador web no soporta la reproducción de audio
      </audio>

    </div> 
  `
})
export class PlayerComponent implements OnInit {
  public url: string;
  public song: Song;

  constructor() {
    this.url = GLOBAL.url;
    this.song = new Song("1", "", "", "", "");
  }

  ngOnInit() {
    console.log('player cargado');

    var song = JSON.parse(localStorage.getItem('sound_song'));
    if (song) {
      this.song = song;
    } else {
      this.song = new Song("1", "", "", "", "");
    }
  }

}
