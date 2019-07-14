import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    constructor(
        private http: HttpClient) { }

    addToShoppingCart(
        productId: string,
        goodsSkuDesc: string,
        goodsWarehouseDesc: string,
        quantity: number,
        specificationId: number,
        warehouseId: number) {
        return this.http.post(`${environment.apiServer}/buyer-cart`, {
            goodsId: productId,
            goodsSkuDesc,
            goodsWarehouseDesc,
            number: quantity,
            specificationId,
            warehouseId
        });
    }

    getShoppingCart() {
        return this.http.get(`${environment.apiServer}/buyer-cart`);
    }
}
