import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon/';
  private data:any;

  constructor(private http: HttpClient) {
  }

  getData(): Observable<any> {
    return this.http.get(this.API_URL + '?limit=151');
  }

  getSinglePokemon(index: number): Observable<any> {
    return this.http.get(this.API_URL +index);
  }
}
