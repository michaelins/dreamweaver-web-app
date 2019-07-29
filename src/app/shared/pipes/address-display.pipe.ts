import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressDisplay'
})
export class AddressDisplayPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (!value) {
      return null;
    }
    const items = value.split('||');
    if (items && items.length > 3) {
      return items[1] + items[2] + items[3];
    } else {
      return null;
    }
  }

}
