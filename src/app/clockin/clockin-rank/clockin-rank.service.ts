import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EqualObject, SortObject } from 'src/app/shared/interfaces/common-interfaces';

export interface Rank {
    status: string;
    headImg: string;
    userId: string;
    nickname: string;
    count: number;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface CollectionOfRank {
    content?: Rank[];
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
export class ClockinRankService {

    constructor(
        private http: HttpClient
    ) { }

    getRanks(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[]) {
        return this.http.post<CollectionOfRank>(`${environment.apiServer}/rankForClockin/${pageNum}/${pageSize}`,
            { equal, sort });
    }
}
