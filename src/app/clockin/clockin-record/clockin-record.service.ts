import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClockinRecordService {

  constructor(
    private http: HttpClient
  ) { }

  createRecord(imgs: string[], intro: string) {
    return this.http.post(`${environment.apiServer}/recordForClockin`, {
      imgs,
      intro
    });
  }
}
