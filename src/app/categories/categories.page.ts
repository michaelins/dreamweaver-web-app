import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { IonContent } from '@ionic/angular';
import { CategoriesService, Category, CollectionOfCategories } from './categories.service';
import { switchMap, map, mergeMap, tap, concatMap, toArray } from 'rxjs/operators';
import { forkJoin, of, from, merge } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  selectedRootCategoryId = -1;
  rootCategoriesPageSize = 10;
  rootCategories: Category[];
  detailCategories: Category[] = [];
  collectionOfRootCategories: CollectionOfCategories = {};

  constructor(
    private uiStateService: UiStateService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.categoriesService.getRootCategories(1, this.rootCategoriesPageSize).pipe(
      switchMap((resp, index) => {
        this.rootCategories = resp.content;
        this.collectionOfRootCategories = resp;
        if (this.rootCategories && this.rootCategories.length > 0) {
          this.selectedRootCategoryId = this.rootCategories[0].id;
          return this.categoriesService.getCategory(this.selectedRootCategoryId, 1, 999);
        }
      })
      , mergeMap(category => {
        if (category && category.subCategories && category.subCategories.content && category.subCategories.content.length > 0) {
          return from(category.subCategories.content).pipe();
        } else {
          throw new Error('No subCategories found!');
        }
      })
      , mergeMap(category => {
        return this.categoriesService.getCategory(category.id, 1, 999);
      })
      , toArray()
    ).subscribe(resp => {
      this.detailCategories = resp;
      console.log(resp);
    }, error => {
      console.log(error);
    });
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
    console.log('ionViewWillLeave');
  }

  onNav(id: number) {
    if (id === this.selectedRootCategoryId) {
      return;
    } else {
      this.selectedRootCategoryId = id;
    }
    this.categoriesService.getCategory(id, 1, 999).pipe(
      mergeMap(category => {
        if (category && category.subCategories && category.subCategories.content && category.subCategories.content.length > 0) {
          return from(category.subCategories.content).pipe();
        } else {
          throw new Error('No subCategories found!');
        }
      })
      , mergeMap(category => {
        return this.categoriesService.getCategory(category.id, 1, 999);
      })
      , toArray()
    ).subscribe(resp => {
      this.detailCategories = resp;
      console.log(resp);
    }, error => {
      this.detailCategories = [];
      console.log(error);
    });
  }

}
