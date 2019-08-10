import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { of, from } from 'rxjs';
import { switchMap, concatMap, map, toArray, take } from 'rxjs/operators';
import { AuthService, UserInfo } from '../../../auth/auth.service';
import { OssService } from 'src/app/shared/oss.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

  user: UserInfo;

  constructor(
    private authService: AuthService,
    private ossService: OssService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.authService.user.pipe(
      switchMap(user => {
        console.log(user);
        if (user) {
          return this.authService.getUserInfo();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this.user = user;
    }, error => {
      console.log(error);
    });
  }

  preview(event) {
    const files = event.target.files as FileList;
    const base64Files: (string | ArrayBuffer)[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files.item(i));
      reader.onload = () => {
        base64Files.push(reader.result);
      };
    }

    console.log(base64Files);
    console.log(files);

    from(this.loadingCtrl.create({
      message: '正在上传...',
      spinner: 'crescent'
    })).pipe(
      switchMap(loading => {
        return loading.present();
      }),
      switchMap(() => {
        return from(files).pipe(
          take(1)
        );
      }),
      concatMap(file => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.ossService.uploadImage(formData);
      }),
      map(resp => {
        return resp.imgUrl;
      }),
      switchMap(url => {
        const userInfo = { headPortrait: url } as { headPortrait?: string, nickName?: string };
        return this.authService.changeUserInfo(userInfo);
      })
    ).subscribe(resp => {
      console.log(resp);
    }, error => {
      alert(JSON.stringify(error));
      console.log(error);
      this.loadingCtrl.dismiss();
    }, () => {
      this.loadingCtrl.dismiss();
    });

    // from(files).pipe(
    //   take(1),
    //   concatMap(file => {
    //     const formData = new FormData();
    //     formData.append('file', file, file.name);
    //     return this.ossService.uploadImage(formData);
    //   }),
    //   map(resp => {
    //     return resp.imgUrl;
    //   }),
    //   switchMap(url => {
    //     return of(url);
    //     // return this.clockinRecordService.createRecord(urls, this.intro);
    //   })
    // ).subscribe(resp => {
    //   console.log(resp);
    //   this.loadingCtrl.dismiss();
    // }, error => {
    //   alert(JSON.stringify(error));
    //   console.log(error);
    //   this.loadingCtrl.dismiss();
    // }, () => {
    //   this.loadingCtrl.dismiss();
    // });
  }
}
