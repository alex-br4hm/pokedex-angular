import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokeNumberPipe'
})
export class PokeNumberPipe implements PipeTransform {

  transform(value: number) {
    if (!value) {
      return '#';
    }

    if (value < 10) {
      return '#00' + value;
    }

    if (value < 100) {
      return '#0' + value;
    }

    else {
      return '#' + value;
    }
  }
}
