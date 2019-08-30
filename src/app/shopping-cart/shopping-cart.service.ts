import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ShoppingCart {
    userId: string;
    items: ShoppingCartItem[];
    goodsNumber: number;
    goodsPrice: number;
    freight: number;
    totalPrice: number;
    realGoodsPrice: number;
    favourablePrice: number;
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
    realGoodsPrice: number;
    favourablePrice: number;
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

export interface ShoppingCartFeeInfoReqItem {
    goodsId: string;
    number: number;
    realGoodsPrice: number;
    warehouseId: number;
}

export interface ShoppingCartFeeInfo {
    actuallyGoodsPrice: number;
    actuallyPaid: number;
    totalFreight: number;
    totalTax: number;
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

    addToShoppingCart(item: ShoppingCartItemRef, silent?: boolean) {
        return this.http.post<ShoppingCart>(`${environment.apiServer}/buyer-cart`, item).pipe(
            tap(resp => {
                const oldCart = this.shoppingCart.value;
                if (oldCart && oldCart.items.length > 0) {
                    oldCart.items.forEach(oldItem => {
                        if (oldItem.checked) {
                            const foundItem = resp.items.find(newItem => newItem.id === oldItem.id);
                            if (foundItem) {
                                foundItem.checked = true;
                            }
                        }
                    });
                }
                if (!silent) {
                    this.shoppingCart.next(resp);
                }
            })
        );
    }

    removeFromShoppingCart(items: ShoppingCartItemRef[], silent?: boolean) {
        return this.http.request<ShoppingCart>('delete', `${environment.apiServer}/buyer-cart`, {
            body: items
        }).pipe(
            tap(resp => {
                const oldCart = this.shoppingCart.value;
                if (oldCart && oldCart.items.length > 0) {
                    oldCart.items.forEach(oldItem => {
                        if (oldItem.checked) {
                            const foundItem = resp.items.find(newItem => newItem.id === oldItem.id);
                            if (foundItem) {
                                foundItem.checked = true;
                            }
                        }
                    });
                }
                if (!silent) {
                    this.shoppingCart.next(resp);
                }
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

    getShoppingCartFeeInfo(items: ShoppingCartFeeInfoReqItem[]) {
        return this.http.post<ShoppingCartFeeInfo>(`${environment.apiServer}/buyer-cart/data`, items);
    }
}
