import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  email: string;
  role: 'profesor' | 'estudiante'; 
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async getCurrentUserEmail(): Promise<string | null> {
    const user = await this.afAuth.currentUser; 
    return user ? user.email : null; 
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();

        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as User; 

          if (userData && userData.role) {
            if (userData.role === 'profesor') {
              this.router.navigate(['/profesor']); 
            } else if (userData.role === 'estudiante') {
              this.router.navigate(['/estudiante']); 
            } else {
              throw new Error('Rol de usuario no reconocido'); 
            }
          } else {
            throw new Error('Datos del usuario no encontrados'); 
          }
        } else {
          throw new Error('Usuario no encontrado en Firestore');
        }
      }
    } catch (error) {
      throw error; 
    }
  }

  getUserData(uid: string): Observable<any> {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }
  async register(email: string, password: string, role: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await this.firestore.collection('users').doc(user.uid).set({
          email: email,
          role: role,
        });
      }
    } catch (error) {
      throw error; 
    }
  }

  async resetPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo de recuperación enviado');
    } catch (error) {
      throw error; 
    }
  }
}

