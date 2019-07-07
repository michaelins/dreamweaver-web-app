import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../categories/categories.service';

export interface Product {
    status: string;
    currency: string;
    name: string;
    h1text: string;
    h2text?: string;
    h3text: string;
    h4text?: string;
    discountSeq: string;
    weight: number;
    price: number;
    unit: string;
    amount: number;
    headImg: string;
    content?: string;
    warehousesId: string;
    categoryId: number;
    specificationsId: string;
    albumsId: string;
    goodsId: string;
    updaterId: string;
    categoryName?: string;
    albumsName?: string;
    warehousesName?: string;
    specificationsName?: string;
    warehouses?: Warehouse[];
    category?: Category;
    specifications?: Specification[];
    albumsForBanner?: Album[];
    albumsForContent?: Album[];
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

export interface Warehouse {
    status: string;
    warehousesId: string;
    name: string;
    headImg: string;
    intro: string;
    weight: number;
    warehousesName: string;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface Specification {
    status: string;
    specificationsId: string;
    name: string;
    headImg: string;
    weight: number;
    specificationsName: string;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface Album {
    status: string;
    type: string;
    albumsName: string;
    albumsId: string;
    ossPath: string;
    redirectPath: string;
    redirectType: string;
    weight: number;
    id: number;
    createTime: string;
    updateTime: string;
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

    getProduct(productId: string) {
        return this.http.get<Product>(`${environment.apiServer}/goods/${productId}/users`, {
            headers: new HttpHeaders({
                ChannelCode: 'WXH5'
            }),
        });
    }
}
