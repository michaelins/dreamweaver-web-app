import { Injectable } from '@angular/core';
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

export interface Product {
  status: string;
  currency: string;
  name: string;
  h1text: string;
  h3text: string;
  discountSeq: string;
  weight: number;
  price: number;
  unit: string;
  amount: number;
  headImg: string;
  warehousesId: string;
  categoryId: number;
  specificationsId: string;
  albumsId: string;
  goodsId: string;
  updaterId: string;
  tagsView: string[];
  id: number;
  createTime: string;
  updateTime: string;
}

export interface CollectionOfProduct {
  content?: Product[];
  last?: boolean;
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient) { }

  getWrongInfo() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }

  getProducts(pageNum: number, pageSize: number) {
    return this.http.post<CollectionOfProduct>('http://39.98.57.32:21314/goods/' + pageNum + '/' + pageSize, {
      equal: [{
        eqObj: 0,
        field: 'status'
      }],
      sort: [{
        direction: 0,
        field: 'weight'
      }]
    }, {
        headers: new HttpHeaders({
          ChannelCode: 'WXH5'
        }),
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
