// GenerarQrPage.ts

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { v4 as uuidv4 } from 'uuid';
import { NavController } from '@ionic/angular'; 
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  qrData: string = '';
  asistentes: any[] = [];

  constructor(private firestore: AngularFirestore, private navCtrl: NavController, private authService: AuthService) {}

  ngOnInit() {
    //actualizacion tiempo real de la colecion 
    this.firestore.collection('asistencias').valueChanges().subscribe((data: any[]) => {
      this.asistentes = data;
    });
  }

  generarQr() {
    const id = uuidv4(); //genera un id unico
    const timestamp = new Date().toISOString(); 
  
    
    this.qrData = JSON.stringify({ id, timestamp });
  }

  regresar() {
    this.navCtrl.back();
  }
}
