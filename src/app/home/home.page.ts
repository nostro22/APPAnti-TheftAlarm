import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';
import { observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { Flashlight } from '@awesome-cordova-plugins/flashlight';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  providers: [DeviceMotion], // add DeviceMotion here
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage {
  user?: any;
  email?: string = "";
  private deviceMotionSubscripcion: any;
  isPortrait?: boolean;
  private sonidoLadoDerecho: any;
  private sonidoLadoIzquierdo: any;
  private sonidoVertical: any;
  private sonidoHorizontal: any;
  isUnlock = true;

  constructor(private aut: FirebaseService, private router: Router, private deviceMotion: DeviceMotion, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.sonidoLadoDerecho = new Audio("../../assets/derecha.ogg");
    this.sonidoLadoIzquierdo = new Audio("../../assets/izquierda.ogg");
    this.sonidoVertical = new Audio("../../assets/vertical.ogg");
    this.sonidoHorizontal = new Audio("../../assets/horizontal.ogg");
    this.isPortrait = this.isInPortrait();
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = firebase.auth().currentUser;
      this.email = this.user.email;
    });
    window.screen.orientation.unlock();
    screen.orientation.onchange = () => {
      console.log(screen.orientation.type);
      this.isPortrait = this.isInPortrait();
      if (this.isPortrait && !this.isUnlock) {

        this.reproducirAudio("horizontal", true, false);
        this.reproducirAudio("vertical", true, true);
        Flashlight.switchOn();

        // Delay 5 seconds and turn off flashlight
        setTimeout(() => {
          Flashlight.switchOff();
        }, 5000);


      } else if (!this.isPortrait && !this.isUnlock) {
        this.reproducirAudio("vertical", true, false);
        this.reproducirAudio("horizontal", true, true);
        navigator.vibrate(5000);
      }
    };
  }


  reproducirAudio(audioNombre: string, isLoop: boolean, isPlay: boolean) {

    let audio: any;
    switch (audioNombre) {
      case "derecho":
        audio = this.sonidoLadoDerecho;
        break;
      case "izquierdo":
        audio = this.sonidoLadoIzquierdo;
        break;
      case "horizontal":
        audio = this.sonidoHorizontal;

        break;
      case "vertical":
        audio = this.sonidoVertical;
        break;
    }
    audio.loop = isLoop;
    if (isPlay) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  isInPortrait() {
    return this.isPortrait = screen.orientation.type.includes("portrait");
  }
  resetButton() {
    const button = document.querySelector('.btn-11');
    if (button) {
      button.classList.remove('active');
      button.classList.remove('disabled');
      // add any other classes or styles to reset the button
    }
  }

  getEmailPrefix(email: string): string {
    const parts = email.split("@");
    return parts[0];
  }

  async logout() {
    await this.aut.showLoading("Cerrando").then(() =>firebase.auth().signOut().then(() => {
      this.router.navigateByUrl('log',{replaceUrl:true});
    }));    
  }
 

  iniciarSensado(): void {
    this.isUnlock = false;
    this.deviceMotionSubscripcion = this.deviceMotion.watchAcceleration({ frequency: 200 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        if (this.ismoveToTheRight(acceleration)) {
          this.reproducirAudio("izquierdo", true, false);
          this.reproducirAudio("derecho", true, true);
          //alert("The phone is moved to the rigth!");
        }
        if (this.ismoveToTheLeft(acceleration)) {
          //alert("The phone is moved to the left!");
          this.reproducirAudio("derecho", true, false);
          this.reproducirAudio("izquierdo", true, true);
        }
      });
  }
  pararTodo(estado: boolean) {
    this.reproducirAudio("izquierdo", true, estado);
    this.reproducirAudio("derecho", true, estado);
    this.reproducirAudio("vertical", true, estado);
    this.reproducirAudio("horizontal", true, estado);
  }
  ismoveToTheRight(acceleration: DeviceMotionAccelerationData): boolean {
    // Check if the acceleration is greater than 10m/s^2 to the left
    return acceleration.x > 5;
  }
  ismoveToTheLeft(acceleration: DeviceMotionAccelerationData): boolean {
    // Check if the acceleration is greater than 10m/s^2 to the left
    return acceleration.x < -5;
  }
  // ismoveToTheUp(acceleration: DeviceMotionAccelerationData): boolean {
  //   // Check if the acceleration is greater than 10m/s^2 to the left
  //   return acceleration.y > 10;
  // }
  // ismoveToTheDown(acceleration: DeviceMotionAccelerationData): boolean {
  //   // Check if the acceleration is greater than 10m/s^2 to the left
  //   return acceleration.y < -5;
  // }

  stopSensado(): void {

    this.isUnlock = true;
    this.pararTodo(false);
    this.deviceMotionSubscripcion.unsubscribe();
  }


  async verificarClave() {
    const confirm = await Swal.fire({
      title: 'Ingrese la Clave de seguridad',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: false,
      confirmButtonText: 'confirmar',
      heightAuto: false,
      background:'#dbaf46',
      color:'white',
      confirmButtonColor:'#43AA8B',
      preConfirm: async (password) => {
        try {
          await this.aut.login(this.email as string, password);
        } catch (error) {
          Swal.showValidationMessage(`Clave incorrecta`);
          this.pararTodo(true);
          Flashlight.switchOn();
          // Delay 5 seconds and turn off flashlight
          setTimeout(() => {
            Flashlight.switchOff();
          }, 5000);
          navigator.vibrate(5000);

        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (confirm.isConfirmed) {
      this.stopSensado();
    }
  }


}


