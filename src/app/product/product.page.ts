import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent, IonGrid } from '@ionic/angular';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  @ViewChild('scrollable') scrollable: IonContent;
  @ViewChild('detail') detail: ElementRef<HTMLElement>;

  sectionId = 1;
  scrollEvents = true;
  slideOpts = {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    lazy: true
  };

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.scrollEvents = true;
  }

  ionViewWillLeave() {
    this.scrollEvents = false;
  }

  onNav(id: number) {
    this.sectionId = id;
    if (this.sectionId === 1) {
      this.scrollable.scrollToTop(100);
    } else if (this.sectionId === 2) {
      this.scrollable.scrollToPoint(0, this.detail.nativeElement.offsetTop, 100);
    }
  }

  onScroll(event: CustomEvent) {
    this.scrollable.getScrollElement().then(el => {
      const bottomVal = el.scrollHeight - el.offsetHeight;
      if (el.scrollTop === bottomVal) {
        this.sectionId = 2;
      } else if (el.scrollTop < bottomVal) {
        if (event.detail.scrollTop < this.detail.nativeElement.offsetTop) {
          this.sectionId = 1;
        } else {
          this.sectionId = 2;
        }
      }
    });
  }
}
