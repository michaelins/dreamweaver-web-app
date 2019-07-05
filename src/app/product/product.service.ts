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

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient) { }

    getProducts(pageNum: number, pageSize: number) {
        return this.http.post<CollectionOfProduct>(`${environment.apiServer}/goods/${pageNum}/${pageSize}`, {
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
}
