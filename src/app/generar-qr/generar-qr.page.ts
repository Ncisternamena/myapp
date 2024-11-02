import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { v4 as uuidv4 } from 'uuid';
import { NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  qrData: string = '';
  asistentes: any[] = [];

  constructor(private firestore: AngularFirestore, private navCtrl: NavController) {}

  ngOnInit() {
   //actualzia en tiempo real quienes escanean
    this.firestore.collection('asistencias').valueChanges().subscribe((data: any[]) => {
      this.asistentes = data;
    });
  }

  generarQr() {
    this.qrData = uuidv4(); //los genera unicos
  }

  regresar() {
    this.navCtrl.back();
  }
}
