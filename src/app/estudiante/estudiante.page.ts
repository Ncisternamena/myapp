import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/auth.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
})
export class EstudiantePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  nombre: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router, 
    private location: Location,
    private authService: AuthService, 
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private firestore : AngularFirestore
  ) {}

  async ngOnInit() {
    // Verificar si la funcionalidad está soportada
    const supportResult = await BarcodeScanner.isSupported();
    this.isSupported = supportResult.supported;

    // Instalar el módulo de Google Barcode Scanner si es necesario
    if (this.isSupported) {
      try {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      } catch (error) {
        console.error('Error al instalar el módulo de escáner:', error);
        this.showToast('No se pudo instalar el escáner. Verifica los errores.');
      }
    }

    // Obtener los datos del usuario autenticado
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe(data => {
          this.nombre = data.nombre; 
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async openQRCodeScanner() {
    const granted = await this.requestPermissions();
    if (!granted) {
        await this.presentAlert('Permiso denegado', 'Conceda permiso de cámara para usar el escáner.');
        return;
    }

    try {
        const { barcodes } = await BarcodeScanner.scan();
        this.handleScannedBarcodes(barcodes);
    } catch (error) {
        console.error('Error al escanear: ', error);
        this.showToast('Error al escanear el código QR.');
    }
}


async handleScannedBarcodes(barcodes: Barcode[]) {
  if (barcodes.length > 0) {
    for (const barcode of barcodes) {
        const scannedData = JSON.parse(barcode.rawValue); // Obtener datos del QR

        // Suponiendo que el alumno está autenticado
        const email = await this.authService.getCurrentUserEmail(); // Obtener el email del alumno

        if (email) {
            // Guardar la asistencia con el correo del alumno
            await this.firestore.collection('asistencias').add({
                eventId: scannedData.id, // ID del evento
                studentEmail: email, // Correo del alumno
                timestamp: new Date().toISOString(), // Fecha y hora del escaneo
            });

            this.showToast(`Código escaneado: ${scannedData.id} - Asistencia registrada para ${email}`);
        } else {
            this.showToast('No se pudo obtener el correo del usuario.');
        }
    }
  } else {
    this.showToast('No se encontró ningún código.');
  }
}
  async saveAttendance(id: string, email: string, timestamp: string) {
    await this.firestore.collection('asistencias').add({
        id,
        email,
        timestamp,
        createdAt: new Date(), // Puedes también añadir un campo creado en Firestore
    });
}

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
