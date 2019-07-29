import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hidePhoneNumber'
})
export class HidePhoneNumberPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value && value.length === 11) {
      return value.substring(0, 3) + '****' + value.substring(7);
    } else {
      return null;
    }
  }
}
