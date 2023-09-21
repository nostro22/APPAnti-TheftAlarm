import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private platform: Platform) { }

  ionViewDidEnter() {
    // Wait for the platform to be ready before hiding the splash screen
    this.platform.ready().then(() => {
      
      SplashScreen.hide().then(() => {
        setTimeout(() => {
         // window.screen.orientation.unlock();
          this.router.navigateByUrl('log',{replaceUrl:true});
        }, 6000);

      });
    });
  }

  ngOnInit() {



  }

}
