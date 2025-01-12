import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokeHeight'
})
export class PokeHeightPipe implements PipeTransform {

  transform(value: number): string {
    return value / 10 + ' m';
  }

}
