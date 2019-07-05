import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  @ViewChildren('category') categoryRefs: QueryList<ElementRef>;
  @ViewChild('scrollable') scrollable: IonContent;

  title = 'fuck';
  categorId = -1;

  constructor(
    private uiStateService: UiStateService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
    console.log(this.categoryRefs.find((item, index) => index === 0));
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onNav(id: number) {
    this.categorId = id;
    if (this.categorId === -1) {
      this.scrollable.scrollToTop(100);
    } else {
      const element = this.categoryRefs.find((item, index) => index === id);
      this.scrollable.scrollToPoint(0, element.nativeElement.offsetTop, 100);
    }
  }

  // onScroll(event: CustomEvent) {
  //   this.scrollable.getScrollElement().then(el => {
  //     const bottomVal = el.scrollHeight - el.offsetHeight;
  //     if (el.scrollTop === bottomVal) {
  //       this.sectionId = 2;
  //     } else if (el.scrollTop < bottomVal) {
  //       if (event.detail.scrollTop < this.detail.nativeElement.offsetTop) {
  //         this.sectionId = 1;
  //       } else {
  //         this.sectionId = 2;
  //       }
  //     }
  //   });
  // }
}
