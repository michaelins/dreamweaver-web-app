import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface CreateOrderReqItem {
    amount: number;
    discountSeq?: string;
    goodsId: string;
    specificationId: number;
    warehouseId: number;
}
export interface CreateOrderReq {
    addressId: string;
    items: CreateOrderReqItem[];
    remark?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(
        private http: HttpClient
    ) { }

    public orderReq: CreateOrderReq;

    createOrder(orderReq: CreateOrderReq) {
        return this.http.post<{ id: string }>(`${environment.apiServer}/order`, orderReq);
    }

}
