import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokeWeight'
})
export class PokeWeightPipe implements PipeTransform {

  transform(value: number): string {
    return value / 10 + ' kg';
  }

}
