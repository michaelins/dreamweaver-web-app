import { Injectable } from '@angular/core';
import { PickerColumn, PickerColumnOption } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface AddressDictListItem {
    status: string;
    dictName: string;
    dictContent: string;
    dictCode: string;
    dictTypeCode: string;
    parentDictCode: string;
    iconUrl: string;
    id: number;
    createTime: string;
    updateTime: string;
}

export interface AddressReqItem {
    addressCode: string;
    addressName: string;
    consignee: string;
    detailedAddress: string;
    identificationName?: string;
    identificationNumber?: string;
    isDefault?: string;
    phoneNo: string;
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    constructor(
        private http: HttpClient
    ) { }

    addAddress(address: AddressReqItem) {
        return this.http.post(`${environment.apiServer}/user/address`, address);
    }

    getAddressList(pageNum: number, pageSize: number) {
        return this.http.post(`${environment.apiServer}/user/address/${pageNum}/${pageSize}`, null);
    }

    getAddressDictList(dictTypeCode: string, parentDictCode: string) {
        return this.http.get<AddressDictListItem[]>(`${environment.apiServer}/dictionary/cache/${dictTypeCode}/${parentDictCode}`);
    }

    getAddressCode(addressCode: string): { provinceCode: string, cityCode: string, districtCode: string } {
        if (!addressCode) {
            return { provinceCode: null, cityCode: null, districtCode: null };
        }
        const items = addressCode.split('||');
        if (items && items.length > 3) {
            return {
                provinceCode: (items[1] === 'null' ? null : items[1]),
                cityCode: (items[2] === 'null' ? null : items[2]),
                districtCode: (items[3] === 'null' ? null : items[3])
            };
        } else {
            return { provinceCode: null, cityCode: null, districtCode: null };
        }
    }

    generateColumns(provinceCode: string, cityCode: string, districtCode: string): Observable<PickerColumn[]> {

        const columns: PickerColumn[] = [];

        return this.getAddressDictList('province', '-1').pipe(
            map(provinces => {
                return provinces.map(item => {
                    return {
                        text: item.dictName,
                        value: item.dictCode
                    } as PickerColumnOption;
                });
            }),
            switchMap(provinces => {
                const provinceIndex = provinceCode ? provinces.findIndex(province => {
                    return province.value === provinceCode;
                }) : 0;
                if (!provinceCode) {
                    provinceCode = provinces[provinceIndex].value;
                }
                columns.push({
                    name: 'province',
                    selectedIndex: provinceIndex,
                    options: provinces
                });
                // console.log('province', provinces, provinceIndex, provinceCode);
                return this.getAddressDictList('city', provinceCode);
            }),
            map(cities => {
                if (!cities) {
                    return null;
                }
                return cities.map(item => {
                    return {
                        text: item.dictName,
                        value: item.dictCode
                    } as PickerColumnOption;
                });
            }),
            switchMap(cities => {

                if (!cities) {
                    return of(null);
                }

                let cityIndex = 0;
                if (!cityCode) {
                    cityCode = cities[cityIndex].value;
                } else {
                    cityIndex = cities.findIndex(city => {
                        return city.value === cityCode;
                    });
                    cityIndex = cityIndex === -1 ? 0 : cityIndex;
                }
                columns.push({
                    name: 'city',
                    selectedIndex: cityIndex,
                    options: cities
                });
                // console.log('city', cities, cityIndex, cityCode);
                return this.getAddressDictList('district', cityCode);
            }),
            map(districts => {
                if (!districts) {
                    return null;
                }
                return districts.map(item => {
                    return {
                        text: item.dictName,
                        value: item.dictCode
                    } as PickerColumnOption;
                });
            }),
            switchMap(districts => {

                if (!districts) {
                    return of(columns);
                }

                let districtIndex = 0;
                if (!districtCode) {
                    districtCode = districts[districtIndex].value;
                } else {
                    districtIndex = districts.findIndex(district => {
                        return district.value === districtCode;
                    });
                    districtIndex = districtIndex === -1 ? 0 : districtIndex;
                }
                columns.push({
                    name: 'district',
                    selectedIndex: districtIndex,
                    options: districts
                });
                // console.log('district', districts, districtIndex, districtCode);
                return of(columns);
            })
        );
    }
}
