import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PickerColumn, PickerColumnOption } from '@ionic/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
    addressId?: string;
    addressCode: string;
    addressName: string;
    consignee: string;
    detailedAddress: string;
    identificationName?: string;
    identificationNumber?: string;
    isDefault?: string;
    phoneNo: string;
}

export interface Address {
    addressId: string;
    addressName: string;
    addressCode?: string;
    addressStatus: string;
    consignee: string;
    detailedAddress: string;
    phoneNo: string;
    identificationName?: string;
    identificationNumber: string;
    id: number;
    isDefault: boolean;
    label: any;
    userId: string;
    zipCode: string;
    certificationId?: any;
    createTime: string;
    updateTime: string;
}

export interface CollectionsOfAddress {
    content?: Address[];
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
export class AddressService {

    private latestAddressesSubject = new BehaviorSubject<Address[]>(null);

    get latestAddresses() {
        return this.latestAddressesSubject.asObservable();
    }

    constructor(
        private http: HttpClient
    ) { }

    addAddress(address: AddressReqItem) {
        return this.http.post<Address>(`${environment.apiServer}/user/address`, address);
    }

    modifyAddress(address: AddressReqItem) {
        return this.http.put(`${environment.apiServer}/user/address`, address);
    }

    deleteAddress(addressId: string) {
        return this.http.delete(`${environment.apiServer}/user/address/${addressId}`).pipe(
            switchMap(resp => {
                return this.fetchLatestAddresses();
            })
        );
    }

    getAddress(addressId: string) {
        return this.http.get<Address>(`${environment.apiServer}/user/address/model/${addressId}`);
    }
    getDefaultAddress() {
        return this.http.get<Address>(`${environment.apiServer}/user/address/default`);
    }

    fetchLatestAddresses() {
        return this.http.get<Address[]>(`${environment.apiServer}/user/address/all`).pipe(
            tap(resp => {
                this.latestAddressesSubject.next(resp);
            })
        );
    }

    getAddresses(pageNum: number, pageSize: number) {
        return this.http.post<CollectionsOfAddress>(`${environment.apiServer}/user/address/${pageNum}/${pageSize}`, null);
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

    generateColumns(
        provinceCode: string,
        cityCode: string,
        districtCode: string): Observable<PickerColumn[]> {

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
                // console.log('city', cities);
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
                while (columns[1].options.length < 30) {
                    columns[1].options.push({ value: -1, text: '', disabled: true });
                }
                while (columns[2].options.length < 30) {
                    columns[2].options.push({ value: -1, text: '', disabled: true });
                }
                return of(columns);
            })
        );
    }
}
