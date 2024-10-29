import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
