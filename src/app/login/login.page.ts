import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseError } from '@angular/fire/app';
import { AuthService } from '../auth/auth.service'; // Esto debería funcionar si la estructura es correcta


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';  
  password: string = '';  

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController,
    private authService : AuthService
  ) {}
  async login() {
    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      this.showAlert('Login failed', errorMessage);
    }
  }
  

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

