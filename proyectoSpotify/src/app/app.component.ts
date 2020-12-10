import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { Component, OnInit } from '@angular/core';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Spotify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;




  constructor(
    private userSevice: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.user = new User("", "", "", "", "", "ROLE_USER", "");
    this.user_register = new User("", "", "", "", "", "ROLE_USER", "");
    this.url = GLOBAL.url;
  }

  public onSubmit() {

    //1 pertición para recoger los datos del usuario
    this.userSevice.signUp(this.user).subscribe(
      result => {

        let identity = result['user'];
        this.identity = identity;
        if (!this.identity._id) {
          alert("El usuario no está correctamente identificado");
        } else {

          console.log(result);
          //Guardar los datos de user en el localstore
          localStorage.setItem('identity', JSON.stringify(identity));

          //2 petición para conseguir el token. para enviarselo en cada peticioón
          this.getToken();
        }

      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          this.errorMessage = error.error.message;
          console.log(error);

        }
      }
    );
  }

  ngOnInit() {
    this.identity = this.userSevice.getIdentity();
    this.token = this.userSevice.getToken();

    // console.log(this.identity);
    // console.log(this.token);

  }


  getToken() {
    this.userSevice.signUp(this.user, 'true').subscribe(
      result => {

        let token = result['token'];
        this.token = token;
        if (this.token.length <= 0) {
          alert("El token no se ha generado");
        } else {
          //console.log(result);  
          //Guardar el token en el localstore
          localStorage.setItem('token', token);
          this.user = new User("", "", "", "", "", "ROLE_USER", "");

          //crear elemento en el localstore para tener el token disponible
          //console.log(this.identity);
        }

      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          this.errorMessage = error.error.message;

        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear()
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  onSubmitRegister() {
    console.log(this.user_register)

    this.userSevice.register(this.user_register).subscribe(
      result => {
        let user = result['user'];
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = "Error al registrarse";
        } else {
          this.alertRegister = "El registro se ha realizado correctamente " + this.user_register.email;
          this.user_register = new User("", "", "", "", "", "ROLE_USER", "");
        }



      },
      error => {
        var errMenssage = <any>error;
        if (errMenssage != null) {
          this.alertRegister = error.error.message;
          console.log(error);

        }
      }
    );

  }


}
