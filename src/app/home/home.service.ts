import { Injectable } from '@angular/core';
import { Product } from '../shared/model/product.model';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Banner {
  ossPath: string;
  type: string;
  weight: number;
  status: string;
  id: number;
  createTime: string;
  updateTime: string;
}

export interface CollectionOfBanner {
  content: Banner[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  numberOfElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient) { }

  private _products: Product[] = [
    new Product(
      'p1',
      '',
      'Ani澳洲之花 医美玻尿酸冷敷面膜 全天持续锁水 易上妆 持久水润Q弹（25ml）',
      '/assets/images/product1.jpg',
      138.00,
      ['澳洲进口', '医美面膜']
    ),
    new Product(
      'p2',
      '',
      'EAORON 修复面膜 5片/盒 光速透亮吸黑 净透 补水保湿 提亮肤色面膜女男士护肤',
      '/assets/images/product2.jpg',
      287.00,
      ['深层洁净']
    ),
    new Product(
      'p3',
      '',
      '澳洲进口乐康膏天然有机果蔬膳食纤维 排毒养颜润肠通宿便',
      '/assets/images/product3.jpg',
      69,
      ['正品保证']
    )
  ];

  get products() {
    return [...this._products];
  }

  getProduct(ProductId: string) {
    return { ...this._products.find(p => p.id === ProductId) };
  }

  getWrongInfo() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }

  getBanners() {
    return this.http.post<CollectionOfBanner>('http://39.98.57.32:21314/banner/1/10', {
      equal: [{
        eqObj: 0,
        field: 'status'
      }, {
        eqObj: 4,
        field: 'type'
      }],
      sort: [{
        direction: 0,
        field: 'weight'
      }]
    }, {
        headers: new HttpHeaders({
          ChannelCode: 'WXH5'
        }),
      }).pipe(map(resp => resp.content));
  }
}
