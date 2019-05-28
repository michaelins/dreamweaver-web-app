import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicProperty } from '../model/ionic-property.model';

@Directive({
  selector: '[appIonicProperty]'
})
export class IonicPropertyDirective implements OnChanges {

  @Input() appIonicProperty: IonicProperty[];

  constructor(
    private elRef: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    for (const property of this.appIonicProperty) {
      console.log(property.name + ',' + property.value);
      if (this.elRef.nativeElement) {
        this.elRef.nativeElement.style.setProperty(property.name, property.value);
      }
    }
  }
}
