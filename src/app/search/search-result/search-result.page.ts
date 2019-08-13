import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CollectionOfProduct, Product, ProductService } from '../../product/product.service';
import { SearchObject } from 'src/app/shared/interfaces/common-interfaces';
import { NavController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  @ViewChild('searchbar') searchbar: IonSearchbar;
  products: Product[];
  collectionOfProduct: CollectionOfProduct = {};
  productsPageSize = 10;
  keyword: string;
  categoryId: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(switchMap(params => {
      const equalObjs = [{ eqObj: 0, field: 'status' }];
      const searchObjs = [] as SearchObject[];
      if (params.categoryId) {
        this.categoryId = params.categoryId;
        equalObjs.push({ eqObj: params.categoryId, field: 'categoryId' });
      }
      if (params.keyword) {
        this.keyword = params.keyword;
        const keywords = (params.keyword as string).split(/(\s+)/).filter(e => e.trim().length > 0);
        console.log(keywords);
        keywords.forEach(word => {
          searchObjs.push({ field: 'name', search: word });
        });
      }
      console.log(equalObjs);
      return this.productService.getProducts(
        1,
        this.productsPageSize,
        equalObjs,
        [{ direction: 0, field: 'weight' }],
        searchObjs
      );
    })).subscribe(resp => {
      console.log(resp);
      this.products = resp.content;
      this.collectionOfProduct = resp;
    }, error => {
      console.log(error);
    });
  }

  loadData(event) {
    if (this.collectionOfProduct.last) {
      event.target.complete();
      event.target.disabled = true;
    } else if (this.collectionOfProduct.number + 2 <= this.collectionOfProduct.totalPages) {
      this.route.queryParams.pipe(switchMap(params => {
        const equalObjs = [{ eqObj: 0, field: 'status' }];
        const searchObjs = [] as SearchObject[];
        if (params.categoryId) {
          this.categoryId = params.categoryId;
          equalObjs.push({ eqObj: params.categoryId, field: 'categoryId' });
        }
        if (params.keyword) {
          this.keyword = params.keyword;
          searchObjs.push({ field: 'name', search: params.keyword });
        }
        console.log(equalObjs);
        return this.productService.getProducts(
          this.collectionOfProduct.number + 2,
          this.productsPageSize,
          equalObjs,
          [{ direction: 0, field: 'weight' }],
          searchObjs
        );
      })).subscribe(resp => {
        console.log(resp);
        this.products.push(...resp.content);
        this.collectionOfProduct = resp;
        event.target.complete();
      }, error => {
        console.log(error);
      });
    }
  }

  onSearch() {
    console.log('search', this.categoryId, this.searchbar.value);
    this.navCtrl.navigateForward([], {
      relativeTo: this.route,
      queryParams: {
        categoryId: this.categoryId,
        keyword: this.searchbar.value
      },
      queryParamsHandling: 'merge'
    });
  }
}
