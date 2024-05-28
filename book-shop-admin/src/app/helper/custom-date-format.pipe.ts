import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(date: string): string {
    const [month, day, year] = date.split('/');
    return `${day}/${month}/${year}`;
  }
}
