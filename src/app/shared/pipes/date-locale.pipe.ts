import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateLocale',
  standalone: true
})
export class DateLocalePipe implements PipeTransform {

  transform(value: Date, ): string {
    const date = new Date(value)
    const dateFormatted = date.toLocaleDateString()
    return dateFormatted 
  }

}
