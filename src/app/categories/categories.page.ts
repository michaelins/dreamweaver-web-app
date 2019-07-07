import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { UiStateService } from '../shared/ui-state.service';
import { IonContent, LoadingController, ToastController } from '@ionic/angular';
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
    private categoriesService: CategoriesService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadingCtrl.create({
      message: '正在加载...',
      spinner: 'crescent'
    }).then(loading => {
      loading.present();
    });
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
          this.detailCategories = category.subCategories.content;
          return from(category.subCategories.content).pipe();
        } else {
          throw new Error('No subCategories found!');
        }
      })
      , mergeMap(category => {
        return this.categoriesService.getCategory(category.id, 1, 999);
      })
    ).subscribe(resp => {
      const updatedCategory = this.detailCategories.find(item => {
        return item.id === resp.id;
      });
      const index = this.detailCategories.indexOf(updatedCategory);
      this.detailCategories[index] = resp;
    }, error => {
      this.detailCategories = [];
      this.loadingCtrl.dismiss();
      console.log(error);
    }, () => {
      this.loadingCtrl.dismiss();
      console.log('init complete');
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
      this.loadingCtrl.create({
        message: '正在加载...',
        spinner: 'crescent'
      }).then(loading => {
        loading.present();
      });
      this.selectedRootCategoryId = id;
    }
    this.categoriesService.getCategory(id, 1, 999).pipe(
      mergeMap(category => {
        if (category && category.subCategories && category.subCategories.content && category.subCategories.content.length > 0) {
          this.detailCategories = category.subCategories.content;
          return from(category.subCategories.content).pipe();
        } else {
          throw new Error('No subCategories found!');
        }
      })
      , mergeMap(category => {
        return this.categoriesService.getCategory(category.id, 1, 999);
      })
    ).subscribe(resp => {
      const updatedCategory = this.detailCategories.find(item => {
        return item.id === resp.id;
      });
      const index = this.detailCategories.indexOf(updatedCategory);
      this.detailCategories[index] = resp;
    }, error => {
      this.detailCategories = [];
      this.loadingCtrl.dismiss();
      this.toastCtrl.create({
        message: '服务器开小差了，请稍后再试...',
        duration: 2000
      }).then(toast => {
        toast.present();
      });
      console.log(error);
    }, () => {
      this.loadingCtrl.dismiss();
      console.log('nav complete');
    });
  }

}
