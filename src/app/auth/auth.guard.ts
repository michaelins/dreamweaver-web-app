import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment, Route } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    constructor(
        private authService: AuthService,
        private router: Router,
        private navCtrl: NavController) { }

    canLoad(
        route: Route,
        segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return this.authService.autoLogin();
                } else {
                    return of(user);
                }
            }),
            map(user => {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            }),
            tap(isAuthenticated => {
                console.log('AuthGuard isAuthenticated:' + isAuthenticated);
                if (!isAuthenticated) {
                    // this.router.navigateByUrl('/auth/login');
                    this.navCtrl.navigateForward(['/auth/login']);
                }
            })
        );
    }
}
