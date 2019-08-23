import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EqualObject, SortObject } from '../../shared/interfaces/common-interfaces';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

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

  private records = new BehaviorSubject<CollectionOfRecord>(null);
  get recordsObs() { return this.records.asObservable(); }

  private equalObjs = [{ eqObj: 0, field: 'status' }];
  private sortObjs = [{ direction: 0, field: 'createTime' }];
  private recordsPageSize = 10;

  constructor(
    private http: HttpClient
  ) { }

  createRecord(imgs: string[], intro: string) {
    return this.http.post<void>(`${environment.apiServer}/recordForClockin`, {
      imgs,
      intro
    }).pipe(
      switchMap(() => {
        return this.getRecords(1, this.recordsPageSize, this.equalObjs, this.sortObjs);
      })
    );
  }

  getRecords(pageNum: number, pageSize: number, equal: EqualObject[], sort: SortObject[], silent?: boolean) {
    return this.http.post<CollectionOfRecord>(`${environment.apiServer}/recordForClockin/detailedForUser/${pageNum}/${pageSize}`,
      { equal, sort }).pipe(
        tap(resp => {
          if (!silent) {
            this.records.next(resp);
          }
        })
      );
  }
}
