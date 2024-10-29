import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage {
  constructor(private router: Router, private location: Location) {}

  navigateToQR() {
    this.router.navigate(['/generar-qr']);
  }

  goBack() {
    this.location.back();
  }
}
