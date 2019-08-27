import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginComponent } from '../shared/login/login.component';

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

  getWrongInfo() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }

  getBanners() {
    return this.http.post<CollectionOfBanner>(`${environment.apiServer}/banner/1/10`, {
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
    }).pipe(map(resp => resp.content));
  }
}
