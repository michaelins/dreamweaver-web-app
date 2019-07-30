import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CollectionOfProduct, Product, ProductService } from '../../product/product.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  products: Product[];
  collectionOfProduct: CollectionOfProduct = {};
  productsPageSize = 10;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.pipe(switchMap(params => {
      const equalObjs = [{ eqObj: 0, field: 'status' }];
      if (params.categoryId) {
        equalObjs.push({ eqObj: params.categoryId, field: 'categoryId' });
      }
      console.log(equalObjs);
      return this.productService.getProducts(
        1,
        this.productsPageSize,
        equalObjs,
        [{ direction: 0, field: 'weight' }]
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
        if (params.categoryId) {
          equalObjs.push({ eqObj: params.categoryId, field: 'categoryId' });
        }
        console.log(equalObjs);
        return this.productService.getProducts(
          this.collectionOfProduct.number + 2,
          this.productsPageSize,
          equalObjs,
          [{ direction: 0, field: 'weight' }]
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
}
