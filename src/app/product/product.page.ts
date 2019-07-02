import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  categorId = 1;

  constructor() { }

  ngOnInit() {
  }

  onNav(id: number) {
    this.categorId = id;
  }
}
