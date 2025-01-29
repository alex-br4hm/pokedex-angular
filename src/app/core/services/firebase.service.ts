import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {catchError, map, Observable, of, retry} from 'rxjs';
import {Pokemon} from '../models/pokemon';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  /**
   * Retrieves the list of Pokémon from the Firestore collection.
   *
   * - Uses `valueChanges()` to listen for real-time updates from the 'pokemon' collection.
   * - Casts the retrieved data to `Pokemon[]`.
   * - Retries the request up to 3 times in case of errors.
   * - Catches any errors, logs them, and returns an empty array to prevent the observable from breaking.
   *
   * @returns An `Observable<Pokemon[]>` containing the list of Pokémon.
   */
  getPokemon(): Observable<Pokemon[]> {
    return this.firestore.collection('pokemon').valueChanges().pipe(
      map((data) => data as Pokemon[]),
      retry(3),
      catchError((error) => {
        console.error('Fehler beim Abrufen der Pokémon-Daten:', error);
        return of([] as Pokemon[]);
      })
    );
  }
}
