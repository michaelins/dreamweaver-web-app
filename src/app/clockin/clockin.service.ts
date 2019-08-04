import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EqualObject, SortObject } from '../shared/interfaces/common-interfaces';

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

    constructor(
        private http: HttpClient
    ) { }

    getClockinPermission() {
        return this.http.get<ClockinPermissionResp>(`${environment.apiServer}/clockin/user`);
    }

    getBodyData() {
        return this.http.get<BodyData>(`${environment.apiServer}/bodyData`);
    }

    saveBodyData(height: number, weight: number, circumference: number, waistline: number, hipline: number) {
        return this.http.post(`${environment.apiServer}/bodyData`, {
            circumference,
            height,
            hipline,
            waistline,
            weight
        });
    }

    getTotalDays() {
        return this.http.get<ClockinDaysResponse>(`${environment.apiServer}/historyForClockin`);
    }

    getContinuousDays() {
        return this.http.get<ClockinDaysResponse>(`${environment.apiServer}/historyForClockin/continuous`);
    }

    getHistory(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[]) {
        return this.http.post<CollectionOfClockinHistoryItem>(
            `${environment.apiServer}/historyForClockin/detailedForUser/${pageNum}/${pageSize}`,
            { equal, sort }
        );
    }
}
