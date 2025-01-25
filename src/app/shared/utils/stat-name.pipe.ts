import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statName'
})
export class StatNamePipe implements PipeTransform {

  transform(statName: String): String {
    switch(statName) {
      case 'hp': return 'HP';
      case 'attack': return 'Angriff';
      case 'defense': return 'Verteidigung';
      case 'special-attack': return 'Spezial-Angriff';
      case 'special-defense': return 'Spezial-Verteidigung';
      case 'speed': return 'Geschwindigkeit';
    }
    return statName;
  }
}

