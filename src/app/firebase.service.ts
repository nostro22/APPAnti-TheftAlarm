import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}


  async login(email: string, password: string) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log("Error signing in:", error );
      throw error;
    }
  }

  async showLoading(mensaje:string) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      translucent:true,
      duration:6000,
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss:false,
      spinner:'lines-sharp'
    });
    loading.present();
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
  }

  async getUser(){
   return firebase.auth().currentUser
  }
}
