import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EqualObject, SortObject } from '../../shared/interfaces/common-interfaces';

export interface Record {
  status: string;
  intro: string;
  userId: string;
  accountNo: string;
  day: number;
  imgs: string[];
  id: number;
  createTime: string;
  updateTime: string;
}

export interface CollectionOfRecord {
  content?: Record[];
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
export class ClockinRecordService {

  constructor(
    private http: HttpClient
  ) { }

  createRecord(imgs: string[], intro: string) {
    return this.http.post<void>(`${environment.apiServer}/recordForClockin`, {
      imgs,
      intro
    });
  }

  getRecords(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[]) {
    return this.http.post<CollectionOfRecord>(`${environment.apiServer}/recordForClockin/detailedForUser/${pageNum}/${pageSize}`,
      { equal, sort });
  }
}
