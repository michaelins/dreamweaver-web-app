import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

export interface EqualObject {
    eqObj: any;
    field: string;
}
export interface SortObject {
    direction: number;
    field: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient) { }

    getProducts(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[]) {
        return this.http.post<CollectionOfProduct>(`${environment.apiServer}/goods/${pageNum}/${pageSize}`, {
            equal,
            sort
        }, {
                headers: new HttpHeaders({
                    ChannelCode: 'WXH5'
                }),
            });
    }
}
