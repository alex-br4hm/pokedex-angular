import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokeWeight'
})
export class PokeWeightPipe implements PipeTransform {

  transform(value: number | undefined | null): string {
    if (value === undefined || value === null) {
      return '0';
    }

    return value / 10 + ' kg';
  }

}
