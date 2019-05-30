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
    for (const property of this.appIonicProperty) {
      if (this.elRef.nativeElement) {
        this.elRef.nativeElement.style.setProperty(property.name, property.value);
      }
    }
  }
}
