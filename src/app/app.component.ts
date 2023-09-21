import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule]
  
})


export class AppComponent {
  

  ngOnInit() {
    window.screen.orientation.lock('portrait');
    firebase.initializeApp
      ({
        apiKey: "AIzaSyAaHVf_-B4yA7hkd0cAPm6YKK--OAdSOO0",
        authDomain: "pps1-70ad5.firebaseapp.com"
      })


      
  }
}
