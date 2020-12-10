import { SongEditComponent } from './components/song-edit/song-edit.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { ArtistDetilComponent } from './components/artist-detil/artist-detil.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'artistas/:page', component: ArtistListComponent },
  { path: 'crear-artista', component: ArtistAddComponent },
  { path: 'editar-artista/:id', component: ArtistEditComponent },
  { path: 'artista/:id', component: ArtistDetilComponent },
  { path: 'crear-album/:artist', component: AlbumAddComponent },
  { path: 'editar-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },  
  { path: 'crear-cancion/:albumId', component: SongAddComponent },
  { path: 'editar-cancion/:id', component: SongEditComponent },



  { path: '**', component: HomeComponent }//cuando hay algun fallo

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
