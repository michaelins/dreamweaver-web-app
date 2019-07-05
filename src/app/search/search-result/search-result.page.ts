import { Component, OnInit } from '@angular/core';
import { ProductService, CollectionOfProduct, Product } from 'src/app/product/product.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  products: Product[];
  collectionOfProduct: CollectionOfProduct = {};
  productsPageSize = 10;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts(1, this.productsPageSize).subscribe(resp => {
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
      this.productService.getProducts(this.collectionOfProduct.number + 2, this.productsPageSize).subscribe(resp => {
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
