import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EqualObject, SortObject } from '../shared/interfaces/common-interfaces';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

export interface ClockinHistoryItem {
    status: string;
    userId: string;
    accountNo: string;
    day: string;
    type: string;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface CollectionOfClockinHistoryItem {
    content?: ClockinHistoryItem[];
    last?: boolean;
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
    first?: boolean;
    numberOfElements?: number;
}

export interface ClockinDaysResponse {
    count: number;
}

export interface BodyData {
    status?: string;
    id?: number;
    userId?: string;
    accountNo?: string;
    circumference: number;
    height: number;
    hipline: number;
    waistline: number;
    weight: number;
    createTime?: string;
    updateTime?: string;
}

export interface ClockinPermissionResp {
    status: string;
    userId: string;
    accountNo: string;
    orderId: string;
    remark: string;
    coachId: string;
    type: string;
    id: number;
    createTime: string;
    updateTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClockinService {

    private bodyData = new BehaviorSubject<BodyData>(null);
    private totalDays = new BehaviorSubject<ClockinDaysResponse>(null);
    private continuousDays = new BehaviorSubject<ClockinDaysResponse>(null);
    private history = new BehaviorSubject<CollectionOfClockinHistoryItem>(null);

    get bodyDataObs() { return this.bodyData.asObservable(); }
    get totalDaysObs() { return this.totalDays.asObservable(); }
    get continuousDaysObs() { return this.continuousDays.asObservable(); }
    get historyObs() { return this.history.asObservable(); }

    constructor(
        private http: HttpClient
    ) { }

    getClockinPermission() {
        return this.http.get<ClockinPermissionResp>(`${environment.apiServer}/clockin/user`);
    }

    getBodyData() {
        return this.http.get<BodyData>(`${environment.apiServer}/bodyData`).pipe(
            tap(resp => {
                this.bodyData.next(resp);
            })
        );
    }

    saveBodyData(height: number, weight: number, circumference: number, waistline: number, hipline: number) {
        return this.http.post(`${environment.apiServer}/bodyData`, {
            circumference,
            height,
            hipline,
            waistline,
            weight
        }).pipe(
            switchMap(() => {
                return this.getBodyData();
            })
        );
    }

    getTotalDays() {
        return this.http.get<ClockinDaysResponse>(`${environment.apiServer}/historyForClockin`).pipe(
            tap(resp => {
                this.totalDays.next(resp);
            })
        );
    }

    getContinuousDays() {
        return this.http.get<ClockinDaysResponse>(`${environment.apiServer}/historyForClockin/continuous`).pipe(
            tap(resp => {
                this.continuousDays.next(resp);
            })
        );
    }

    getHistory(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[]) {
        return this.http.post<CollectionOfClockinHistoryItem>(
            `${environment.apiServer}/historyForClockin/detailedForUser/${pageNum}/${pageSize}`,
            { equal, sort }
        ).pipe(
            tap(resp => {
                this.history.next(resp);
            })
        );
    }
}
