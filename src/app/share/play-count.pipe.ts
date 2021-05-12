import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playCountPipe'
})
export class PlayCountPipe implements PipeTransform {

  transform(value: number): string| number {
    if (value > 10000) {
      let valueW = (value/10000).toFixed(1);
      return valueW + '万';
    }
    return value.toString();
  }

}
