import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { tap, take, switchMap } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return this.authService.autoLogin();
                } else {
                    return of(user);
                }
            }),
            switchMap(user => {
                const authorization = 'Bearer ' + (user ? user.token : '');
                const modifiedReq = req.clone({
                    headers: req.headers.append('ChannelCode', 'WXH5').append('Authorization', authorization)
                });
                return next.handle(modifiedReq).pipe(tap(() => { },
                    error => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 401) {
                                this.modalCtrl.getTop().then(modal => {
                                    return modal.dismiss();
                                }).then(result => {
                                    console.log('modal dismissed: ' + result);
                                }).finally(() => {
                                    this.navCtrl.navigateForward(['/auth/login']);
                                });
                            }
                        }
                    }));
            })
        );

    }
}
