import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Category {
    status: string;
    name: string;
    locale: string;
    headImg: string;
    parentId: number;
    discountSeq: string;
    weight: number;
    subCategories: CollectionOfCategories;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface CollectionOfCategories {
    content?: Category[];
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
export class CategoriesService {

    constructor(
        private http: HttpClient) { }

    getRootCategories(pageNum: number, pageSize: number) {
        return this.http.post<CollectionOfCategories>(`${environment.apiServer}/category/${pageNum}/${pageSize}`, {
            equal: [{
                eqObj: 0,
                field: 'status'
            }],
            sort: [{
                direction: 0,
                field: 'weight'
            }]
        });
    }

    getCategory(id: number, pageNum: number, pageSize: number) {
        return this.http.post<Category>(`${environment.apiServer}/category/${id}/${pageNum}/${pageSize}`, {
            equal: [{
                eqObj: 0,
                field: 'status'
            }],
            sort: [{
                direction: 0,
                field: 'weight'
            }]
        });
    }
}
