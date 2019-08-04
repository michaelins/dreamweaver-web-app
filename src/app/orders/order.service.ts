import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { EqualObject, SortObject } from '../shared/interfaces/common-interfaces';
import { map, switchMap } from 'rxjs/operators';
import { NavController, AlertController } from '@ionic/angular';

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
export interface OrderLogistics {
    status: string;
    orderId: string;
    companyCode: string;
    shippingCode: string;
    detailed: string;
    userId: string;
    companyName: string;
    id: number;
    createTime: string;
    updateTime: string;
}
export interface OrderShippingAddress {
    status: string;
    orderId: string;
    receiverName: string;
    receiverMobile: string;
    addressName: string;
    addressCode: string;
    detailedAddress: string;
    postcode: string;
    userId: string;
    addressId: string;
    id: number;
    createTime: string;
    updateTime: string;
}
export enum OrderStatus {
    // 待支付
    TO_PAY = '待付款',
    // 已支付
    PAID = '待发货',
    // 取消交易
    CANCELED = '已取消',
    // 申请退货中
    RETURNING = '退货中',
    // 已退货
    RETURNED = '已退货',
    // 未发货
    UNSHIPPED = '发货中',
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
        private http: HttpClient,
        private navCtrl: NavController,
        private alertCtrl: AlertController
    ) { }

    public orderReq: CreateOrderReq;

    createOrder(orderReq: CreateOrderReq) {
        return this.http.post<{ id: string }>(`${environment.apiServer}/order`, orderReq);
    }

    getOrder(orderId: string) {
        return this.http.get<Order>(`${environment.apiServer}/order/${orderId}`);
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

    cancelOrder(orderId: string) {
        return this.http.delete<Order>(`${environment.apiServer}/order/users/${orderId}`);
    }

    getOrderShippingInfo(orderId: string) {
        return this.http.get<OrderShippingAddress>(`${environment.apiServer}/orderShipping/orders/${orderId}`);
    }

    getOrderLogistics(orderId: string) {
        return this.http.get<OrderLogistics>(`${environment.apiServer}/orderLogistics/orders/${orderId}`);
    }

    simulatePayOrder(orderId: string) {
        return this.http.post(`${environment.apiServer}/pay/wx/callback/test/${orderId}`, {});
    }

    receivedOrder(orderId: string) {
        return this.http.post(`${environment.apiServer}/order/users/receiving/${orderId}`, {});
    }

    getOrderSecondaryButtonText(status: OrderStatus) {
        switch (status) {
            case OrderStatus.TO_PAY:
            case OrderStatus.PAID:
            case OrderStatus.UNSHIPPED:
                return '取消订单';
            case OrderStatus.SHIPPED:
                return '查看物流';
            case OrderStatus.CANCELED:
            case OrderStatus.RETURNED:
            case OrderStatus.THXGOD:
            case OrderStatus.CLOSED:
                return '删除订单';
            default:
                break;
        }
    }

    getOrderPrimaryButtonText(status: OrderStatus) {
        switch (status) {
            case OrderStatus.TO_PAY:
                return '立即付款';
            case OrderStatus.SHIPPED:
                return '确认收货';
            default:
                break;
        }
    }

    showOrderPrimaryButton(status: OrderStatus) {
        switch (status) {
            case OrderStatus.TO_PAY:
            case OrderStatus.SHIPPED:
                return true;
            default:
                return false;
        }
    }

    showOrderSecondaryButton(status: OrderStatus) {
        switch (status) {
            case OrderStatus.RETURNING:
                return false;
            default:
                return true;
        }
    }

    onOrderPrimaryButtonClick(status: OrderStatus, orderId: string) {
        switch (status) {
            case OrderStatus.TO_PAY:
                this.payOrder(orderId);
                break;
            case OrderStatus.SHIPPED:
                this.confirmOrderReceived(orderId);
                break;
            default:
                break;
        }
    }

    onOrderSecondaryButtonClick(status: OrderStatus, orderId: string) {
        switch (status) {
            case OrderStatus.TO_PAY:
            case OrderStatus.PAID:
            case OrderStatus.UNSHIPPED:
                this.confirmCancelOrder(orderId);
                break;
            case OrderStatus.SHIPPED:
                this.trackingShipment(orderId);
                break;
            case OrderStatus.CANCELED:
            case OrderStatus.RETURNED:
            case OrderStatus.THXGOD:
            case OrderStatus.CLOSED:
                this.confirmDeleteOrder(orderId);
                break;
            default:
                break;
        }
    }

    confirmCancelOrder(orderId: string) {
        this.confirmOrderAction(orderId, '确认取消订单吗？取消后不可撤销', this.cancelOrder(orderId));
    }

    payOrder(orderId: string) {
        this.navCtrl.navigateForward(['/orders', 'pay', orderId]);
    }

    trackingShipment(orderId) {
        console.log('trackingShipment:', orderId);
    }

    confirmOrderReceived(orderId: string) {
        this.confirmOrderAction(orderId, '确认收货吗？确认后不可撤销', this.receivedOrder(orderId));
    }

    confirmDeleteOrder(orderId: string) {
        this.confirmOrderAction(orderId, '确认删除订单吗？删除后不可撤销', of(orderId));
    }

    confirmOrderAction(orderId: string, message: string, handlerObs: Observable<any>) {
        from(this.alertCtrl.create({
            message,
            buttons: [{
                text: '取消',
                role: 'cancel'
            }, {
                text: '确定',
                role: 'ok'
            }]
        })).pipe(
            switchMap(dialog => {
                dialog.present();
                return dialog.onDidDismiss();
            }),
            switchMap(data => {
                if (data && data.role === 'ok') {
                    console.log('orderId: ', orderId);
                    return handlerObs;
                }
            })
        ).subscribe(console.log, console.log);
    }

}