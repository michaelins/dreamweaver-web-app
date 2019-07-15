import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ShoppingCart {
    userId: string;
    items: ShoppingCartItem[];
    goodsNumber: number;
    goodsPrice: number;
    freight: number;
    totalPrice: number;
}

export interface ShoppingCartItem {
    status: string;
    buyerCart: ShoppingCartRef;
    userId: string;
    goodsId: string;
    specificationId: number;
    goodsImg: string;
    goodsName: string;
    goodsPrice: number;
    number: number;
    warehouseId: number;
    goodsWarehouseDesc: string;
    goodsSpecificationDesc: string;
    id: number;
    createTime: string;
    updateTime: string;
    checked?: boolean;
}

export interface ShoppingCartRef {
    createTime: string;
    id: number;
    items: ShoppingCartItem[];
    updateTime: string;
    userId: string;
}

export interface ShoppingCartItemRef {
    goodsId: string;
    number: number;
    specificationId: number;
    warehouseId: number;
}

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {

    private shoppingCart = new BehaviorSubject<ShoppingCart>(null);

    constructor(
        private http: HttpClient) { }

    get shoppingCartObservable() {
        return this.shoppingCart.asObservable();
    }

    addToShoppingCart(item: ShoppingCartItemRef) {
        return this.http.post<ShoppingCart>(`${environment.apiServer}/buyer-cart`, item).pipe(
            tap(resp => {
                this.shoppingCart.next(resp);
            })
        );
    }

    removeFromShoppingCart(items: ShoppingCartItemRef[]) {
        return this.http.request<ShoppingCart>('delete', `${environment.apiServer}/buyer-cart`, {
            body: items
        }).pipe(
            tap(resp => {
                this.shoppingCart.next(resp);
            })
        );
    }

    getShoppingCart() {
        return this.http.get<ShoppingCart>(`${environment.apiServer}/buyer-cart`).pipe(
            tap(resp => {
                this.shoppingCart.next(resp);
            })
        );
    }
}
