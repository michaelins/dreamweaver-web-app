import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { IonSearchbar, LoadingController, NavController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { UiStateService } from '../shared/ui-state.service';
import { CategoriesService, Category, CollectionOfCategories } from './categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  @ViewChild('searchbar') searchbar: IonSearchbar;
  selectedRootCategoryId = -1;
  rootCategoriesPageSize = 10;
  rootCategories: Category[];
  detailCategories: Category[] = [];
  collectionOfRootCategories: CollectionOfCategories = {};

  constructor(
    private uiStateService: UiStateService,
    private categoriesService: CategoriesService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    // tslint:disable-next-line: deprecation
    private renderer: Renderer
  ) { }

  ngOnInit() {
    from(this.loadingCtrl.create({
      message: '正在加载...',
      spinner: 'crescent'
    })).pipe(
      switchMap(loading => {
        return loading.present();
      }),
      switchMap(() => {
        return this.categoriesService.getRootCategories(1, this.rootCategoriesPageSize);
      }),
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
    });
  }

  ionViewWillEnter() {
    this.uiStateService.setTabBarHidden(false);
  }

  ionViewWillLeave() {
    this.uiStateService.setTabBarHidden(true);
  }

  onSearch(event) {
    this.renderer.invokeElementMethod(event.target, 'blur');
    this.navCtrl.navigateForward(['/search/result'], { queryParams: { keyword: this.searchbar.value } });
  }

  onNav(id: number) {
    if (id === this.selectedRootCategoryId) {
      return;
    } else {
      from(this.loadingCtrl.create({
        message: '正在加载...',
        spinner: 'crescent'
      })).pipe(
        switchMap(loading => {
          return loading.present();
        }),
        switchMap(() => {
          this.selectedRootCategoryId = id;
          return this.categoriesService.getCategory(id, 1, 999);
        }),
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

}
