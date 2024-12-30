import { Injectable } from '@angular/core';
import {Pokemon} from '../models/pokemon';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeDataService {
  $pokemon: any;

  constructor(private apiService: ApiService) {
  }

}
