import { Injectable } from '@angular/core';
import { PickerColumn } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    constructor(
        private http: HttpClient
    ) { }

    getArea() {
        return this.http.get('http://fts.jd.com/area/get', {
            params: {
                fid: '1'
            }
        });
    }

    generateColumns(province: number): Observable<PickerColumn[]> {

        const columns: PickerColumn[] = [];

        columns.push({
            name: 'province',
            selectedIndex: province,
            options: [
                {
                    text: '山西'
                },
                {
                    text: '四川'
                }
            ]
        });
        columns.push({
            name: 'city',
            options: province === 0 ? [
                {
                    text: '太原'
                },
                {
                    text: '临汾'
                }
            ] : [
                    {
                        text: '成都'
                    },
                    {
                        text: '绵阳'
                    }
                ]
        });
        columns.push({
            name: 'district',
            options: [
                {
                    text: '朝阳'
                },
                {
                    text: '高新'
                }
            ]
        });
        return of(columns).pipe(delay(2000));
    }
}
