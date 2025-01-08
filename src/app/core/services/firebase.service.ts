import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}


  getPokemon(): Observable<any[]> {
    return this.firestore.collection('pokemon').valueChanges(); // Ruft die gesamte Sammlung ab
  }

  addDataToCollection(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }

  // Methode, um mehrere Daten gleichzeitig hochzuladen
  addBulkDataToCollection(collectionName: string, dataArray: any[]) {
    const batch = this.firestore.firestore.batch();
    const collectionRef = this.firestore.collection(collectionName).ref;

    dataArray.forEach(data => {
      const docRef = collectionRef.doc(); // Erzeugt eine neue Dokument-Referenz
      batch.set(docRef, data);
    });

    return batch.commit();
  }
}
