import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit{
  nombre: string = '';
  constructor(private router: Router, private location: Location,private authService: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe(data => {
          this.nombre = data.nombre; 
        });
      }
    });
  }

  navigateToQR() {
    this.router.navigate(['/generar-qr']);
  }

  goBack() {
    this.location.back();
  }
}
