import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface SmsSendAuthCodeRsp {
    authKey: string; // 发送验证码短信成功后返回，验证时需要传递到通知服务系统 ,
    effTime: number; // 有效时间：毫秒
}

export interface RegisterReq {
    authKey: string; // 短信唯一key
    code: string; // 验证码
    loginDeviceNum: string; // 登录设备号
    loginDeviceType: string; // 登录设备类型 = ['WXH5', 'APP', 'WEB']stringEnum:"WXH5", "APP", "WEB"
    nickName: string; // 昵称，昵称格式支持中文/英文/数字2-15长度
    password: string; // 密码，密码长度最短为6位，最长为20位
    phoneNo: string; // 手机号码
    referralCode?: string; // optional: 推荐码
}

export interface LoginReq {
    accountNo: string; // 手机号码
    loginDeviceNum: string; // 登录设备号
    loginDeviceType: string; // 登录设备类型 = ['WXH5', 'APP', 'WEB']stringEnum:"WXH5", "APP", "WEB"
    password: string; // 密码，密码长度最短为6位，最长为20位
}

export interface LoginRsp {
    accountNo?: string;
    accountStatus?: string;
    headPortrait?: string;
    nickName?: string;
    token?: string;
    userId?: string;
}

export interface UserInfo {
    userId?: string;
    accountNo?: string;
    name: string;
    nickName: string;
    birthDay: string;
    headPortrait: string;
    personalizedSignature: string;
    accountStatus: string;
    userPoint: number;
    referralCode: string;
    levelId: number;
    userLevel: number;
    id: number;
    createTime: string;
    updateTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // tslint:disable-next-line: variable-name
    private userSubject = new BehaviorSubject<User>(null);

    get user() {
        return this.userSubject.asObservable().pipe(
            switchMap(user => {
                if (!user) {
                    return this.autoLogin();
                } else {
                    return of(user);
                }
            }),
        );
    }

    public registerReq: RegisterReq = {
        authKey: null,
        code: null,
        loginDeviceType: 'WXH5',
        loginDeviceNum: '1234567890',
        nickName: null,
        phoneNo: null,
        password: null
    };

    public referralInfo: { userAccount: string, userName: string };

    get userIsAuthenticated() {
        return this.userSubject.asObservable().pipe(
            map(user => {
                if (user) {
                    return !!user.token;
                } else {
                    return false;
                }
            })
        );
    }

    constructor(private http: HttpClient) { }

    getUserInfo() {
        return this.http.get<UserInfo>(`${environment.apiServer}/user/userinfo`);
    }

    getReferralInfo(referralCode: string) {
        return this.http.get<{ userAccount: string, userName: string }>(`${environment.apiServer}/user/referraluser/${referralCode}`);
    }

    bindReferralCode(referralCode: string) {
        return this.http.put(`${environment.apiServer}/user/bindinguser/${referralCode}`, {});
    }

    getAuthCode(phoneNo: string, templateCode: string) {
        return this.http.post<SmsSendAuthCodeRsp>(`${environment.apiServer}/sms/sendauthcode`, {
            phoneNo,
            templateCode
        });
    }

    changeUserInfo(userInfo: { headPortrait?: string, nickName?: string }) {
        return this.http.post<UserInfo>(`${environment.apiServer}/user/updateuserinfo`, userInfo).pipe(
            tap(resp => {
                const user = this.userSubject.value;
                user.nickName = resp.nickName;
                user.headPortrait = resp.headPortrait;
                this.userSubject.next(user);
                this.storeAuthData(
                    user.accountNo,
                    user.accountStatus,
                    user.headPortrait,
                    user.nickName,
                    user.token,
                    user.userId,
                    null);
            })
        );
    }

    findPassword(accountNo: string, authKey: string, code: string, password: string) {
        return this.http.post(`${environment.apiServer}/user/password/retrieve`, {
            accountNo,
            authKey,
            code,
            password
        });
    }

    changePassword(
        accountNo: string,
        authKey: string,
        code: string,
        newPassword: string,
        loginDeviceNum?: string,
        loginDeviceType?: string) {
        return this.http.post<LoginRsp>(`${environment.apiServer}/user/password/update`, {
            accountNo,
            authKey,
            code,
            loginDeviceNum: loginDeviceNum ? loginDeviceNum : '1234567890',
            loginDeviceType: loginDeviceType ? loginDeviceType : 'WXH5',
            newPassword
        }).pipe(
            tap(this.setUserData.bind(this))
        );
    }

    register() {
        return this.http.post<LoginRsp>(`${environment.apiServer}/user/register`, this.registerReq).pipe(tap(this.setUserData.bind(this)));
    }

    loginBySms(
        accountNo: string,
        authKey: string,
        code: string,
        loginDeviceNum?: string,
        loginDeviceType?: string) {
        return this.http.post<LoginRsp>(`${environment.apiServer}/user/login/sms`, {
            accountNo,
            authKey,
            code,
            loginDeviceNum: loginDeviceNum ? loginDeviceNum : '1234567890',
            loginDeviceType: loginDeviceType ? loginDeviceType : 'WXH5'
        }).pipe(
            tap(this.setUserData.bind(this))
        );
    }

    login(loginReq: LoginReq) {
        return this.http.post<LoginRsp>(`${environment.apiServer}/user/login`, loginReq).pipe(tap(this.setUserData.bind(this)));
    }

    logout() {
        return from(Plugins.Storage.remove({ key: 'authData' })).pipe(
            tap(() => {
                this.userSubject.next(null);
            })
        );
    }

    autoLogin() {
        return from(Plugins.Storage.get({ key: 'authData' })).pipe(
            map(storedData => {
                if (!storedData || !storedData.value) {
                    return null;
                }
                const parsedData = JSON.parse(storedData.value) as {
                    accountNo: string,
                    accountStatus: string,
                    headPortrait: string,
                    nickName: string,
                    token: string,
                    userId: string,
                    tokenExpirationDate: string
                };
                const user = new User(
                    parsedData.accountNo,
                    parsedData.accountStatus,
                    parsedData.headPortrait,
                    parsedData.nickName,
                    parsedData.token,
                    parsedData.userId
                );
                return user;
            }), tap(user => {
                if (user !== null) {
                    this.userSubject.next(user);
                }
            })
        );
    }

    private setUserData(userData: LoginRsp) {
        const user = new User(
            userData.accountNo,
            userData.accountStatus,
            userData.headPortrait,
            userData.nickName,
            userData.token,
            userData.userId
        );
        this.userSubject.next(user);
        this.storeAuthData(
            userData.accountNo,
            userData.accountStatus,
            userData.headPortrait,
            userData.nickName,
            userData.token,
            userData.userId,
            null);
    }

    private storeAuthData(
        accountNo: string,
        accountStatus: string,
        headPortrait: string,
        nickName: string,
        token: string,
        userId: string,
        tokenExpirationDate: string) {
        const data = JSON.stringify({ accountNo, accountStatus, headPortrait, nickName, userId, token, tokenExpirationDate });
        Plugins.Storage.set({ key: 'authData', value: data });
    }
}
