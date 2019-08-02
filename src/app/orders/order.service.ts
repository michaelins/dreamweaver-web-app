import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { EqualObject, SortObject } from '../shared/interfaces/common-interfaces';
import { map } from 'rxjs/operators';

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
export interface OrderItem {
    buyerCommentId: string;
    commentFlag: boolean;
    status: string;
    orderId: string;
    goodsId: string;
    userId: string;
    specificationId: number;
    warehouseId: number;
    goodsSnapshoot: string;
    specificationSnapshoot: string;
    warehouseSnapshoot: string;
    num: number;
    title: string;
    price: number;
    totalFee: number;
    amountPayable: number;
    favourablePrice: number;
    tax: number;
    freight: number;
    points: number;
    discountSeq: string;
    headImg: string;
    id: number;
    createTime: string;
    updateTime: string;
}
export interface Order {
    orderId: string;
    items: OrderItem[];
    actuallyPaid: number;
    amountPayable: number;
    totalTax: number;
    totalFreight: number;
    totalPoints: number;
    goodsTypeNum: number;
    goodsNum: number;
    paymentSeq: string;
    billStatus: string;
    discountSeq: string;
    favourablePrice: number;
    orderStatus: OrderStatus;
    userId: string;
    remark: string;
    paymentTime: string;
    consignTime: string;
    endTime: string;
    closeTime: string;
    id: number;
    createTime: string;
    updateTime: string;
}
export interface CollectionOfOrders {
    content?: Order[];
    last?: boolean;
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
    first?: boolean;
    numberOfElements?: number;
}
export enum OrderStatus {
    // 待支付
    TO_PAY = '待付款',
    // 已支付
    PAID = '已支付',
    // 取消交易
    CANCELED = '已取消',
    // 申请退货中
    RETURNING = '退货中',
    // 已退货
    RETURNED = '已退货',
    // 未发货
    UNSHIPPED = '待发货',
    // 已发货
    SHIPPED = '待收货',
    // 交易成功
    THXGOD = '已完成',
    // 关闭交易
    CLOSED = '已关闭'
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    // private orders : BehaviorSubject<O

    constructor(
        private http: HttpClient
    ) { }

    public orderReq: CreateOrderReq;

    createOrder(orderReq: CreateOrderReq) {
        return this.http.post<{ id: string }>(`${environment.apiServer}/order`, orderReq);
    }

    getOrders(pageNum: number, pageSize: number, equalObjs?: EqualObject[], sortObjs?: SortObject[]) {
        console.log(OrderStatus.TO_PAY);
        console.log(OrderStatus[OrderStatus.TO_PAY]);
        return this.http.post<CollectionOfOrders>(`${environment.apiServer}/order/users/${pageNum}/${pageSize}`, {
            equal: equalObjs ? equalObjs : [],
            sort: sortObjs ? sortObjs : []
        }).pipe(
            map(collectionOfOrders => {
                if (collectionOfOrders.content && collectionOfOrders.content.length > 0) {
                    collectionOfOrders.content.forEach(order => {
                        order.goodsNum = 0;
                        order.items.forEach(item => {
                            order.goodsNum += item.num;
                        });
                    });
                }
                return collectionOfOrders;
            })
        );
    }

}
