import { GLOBAL } from './../../services/global';
import { User } from './../../models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public alertMessage;
  public fileToUpload;
  public url: string;

  constructor(private userService: UserService) {
    this.user = new User("", "", "", "", "", "", "");
    this.identity = userService.getIdentity();
    this.token = userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.user);
    this.userService.udpateUser(this.user).subscribe(
      result => {
        if (!result['user']) {
          this.alertMessage = 'El usuario no se ha actualizado';
        } else {
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById("identity_name").innerHTML = this.user.name;
          if (!this.fileToUpload) {
          } else {
            this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.fileToUpload)
              .then(
                (result: any) => {
                  this.user.image = result.image;
                  localStorage.setItem('identity', JSON.stringify(this.user));

                  let image_path = this.url + 'get-image-user/' + this.user.image;
                  document.getElementById("image-logged").setAttribute('src', image_path);
                  console.log(this.user);
                }
              );
          }
          this.alertMessage = 'Datos actualizados correctamente';
        }

      },
      err => {
        var errMenssage = <any>err;
        if (errMenssage != null) {
          this.alertMessage = err.error.message;

        }
      }
    );

  }

  fileChangeEvent(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files; //recoge el fichero que se selecciona en el input
    console.log(this.fileToUpload)
  }

  //realizar la petición ajax y subida al servidor
  makeFileRequest(url: string, parmas: Array<string>, files: Array<File>) {
    var token = this.token;
    //Promise lanza el codigo de la subida
    return new Promise(function (resolve, reject) {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }

}
