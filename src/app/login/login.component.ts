import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonAccordionGroup, IonicModule, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})

export class LoginComponent implements OnInit {
  constructor(private auth: FirebaseService, private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private fb: FormBuilder) { }
ngOnInit(): void {
  window.screen.orientation.lock('portrait');
}
  get email() {
    return this.formUser.get('email') as FormControl;
  }
  get password() {
    return this.formUser.get('password') as FormControl;
  }

  formUser = this.fb.group({
    'email':
      ["",
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
        ]
      ],
    'password':
      ["",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ]
  })


  accounts = [{ id: '1', label: 'Cuenta 1' }, { id: '2', label: 'Cuenta 2' }, { id: '3', label: 'Cuenta 3' }];
  emailValue: string = "";
  passwordValue: string = "";
  Swal = require('sweetalert2');

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;


  async login() {

    try {
      await this.auth.showLoading('Verificando base de datos espere').then(() => this.auth.login(this.email.value, this.password.value));
      this.router.navigateByUrl('home',{replaceUrl:true});
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.toastNotification('El usuario no se encuentra registrado.');
          break;
        case 'auth/wrong-password':
          this.toastNotification('Combinacion de Clave y correo electronico erronea.');
          break;
        default:
          this.toastNotification('Llene ambos campos correo electronico y clave');
          break;
      }
    }
  }
  
  async signup() {
    this.toastNotification("Llene ambos campos correo electronico y clave");
  }
  async toastNotification(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'middle',
      icon: 'alert-outline',
      color: 'danger'
    });
    (await toast).present();
  }
  clear()
  {
    this.formUser.reset();
  }
  async llenarUsuario(usuario: any) {
    switch (usuario) {
      case '1':
        this.email.setValue("eduardo@gmail.com");
        this.password.setValue("123456");
        break;
      case '2':
        this.email.setValue("admin@gmail.com");
        this.password.setValue("123456");
        break;
      case '3':
        this.email.setValue("cliente@gmail.com");
        this.password.setValue("123456");
        break;
    }
    const nativeEl = this.accordionGroup;
    nativeEl.value = undefined;
  }



}
