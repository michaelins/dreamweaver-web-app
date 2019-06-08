import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface SmsSendAuthCodeRsp {
    authKey: string; // 发送验证码短信成功后返回，验证时需要传递到通知服务系统 ,
    effTime: number; // 有效时间：毫秒
}

export interface RegisterReq {
    authKey: string; // 短信唯一key
    code: string; // 验证码
    loginDeviceNum: string; // 登录设备号
    loginDeviceType: string; // 登录设备类型 = ['WXH5', 'APP', 'WEB']stringEnum:"WXH5", "APP", "WEB"
    nickeName: string; // 昵称，昵称格式支持中文/英文/数字2-15长度
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

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userIsAuthenticated = true;
    public registerReq: RegisterReq = {
        authKey: null,
        code: null,
        loginDeviceType: 'WXH5',
        loginDeviceNum: '1234567890',
        nickeName: null,
        phoneNo: null,
        password: null
    };

    get userIsAuthenticated() {
        return this._userIsAuthenticated;
    }

    constructor(private http: HttpClient) { }

    getAuthCode(phoneNo: string, templateCode: string) {
        return this.http.post<SmsSendAuthCodeRsp>('http://39.98.57.32:21314/sms/sendauthcode', {
            phoneNo,
            templateCode
        }, {
                headers: new HttpHeaders({
                    ChannelCode: 'WXH5'
                }),
            });
    }

    register() {
        return this.http.post<LoginRsp>('http://39.98.57.32:21314/user/register', this.registerReq, {
            headers: new HttpHeaders({
                ChannelCode: 'WXH5'
            }),
        });
    }

    login(loginReq: LoginReq) {
        return this.http.post<LoginRsp>('http://39.98.57.32:21314/user/login', loginReq, {
            headers: new HttpHeaders({
                ChannelCode: 'WXH5'
            }),
        });
    }
}
