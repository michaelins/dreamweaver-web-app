import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, CameraSource } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ModalController } from '@ionic/angular';
import { ClockinRecordNewComponent } from './clockin-record-new/clockin-record-new.component';

@Component({
  selector: 'app-clockin-record',
  templateUrl: './clockin-record.page.html',
  styleUrls: ['./clockin-record.page.scss'],
})
export class ClockinRecordPage implements OnInit {

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  onAdd() {
  }

  preview(event) {
    const files = event.target.files as FileList;
    const base64Files: (string | ArrayBuffer)[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files.item(i));
      reader.onload = () => {
        // this.imgURL = reader.result;
        base64Files.push(reader.result);
      };
    }

    // const reader = new FileReader();
    // event.target.files.forEach(file => {
    //   reader.readAsDataURL(event.target.files[0]);
    //   reader.onload = () => {
    //     // this.imgURL = reader.result;
    //     console.log(reader.result);
    //   };
    // });
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = () => {
    //   this.imgURL = reader.result;
    // };

    this.modalCtrl.create({
      component: ClockinRecordNewComponent,
      componentProps: {
        base64Files,
        files
      }
    }).then(modal => {
      modal.present();
    });



    // const formData = new FormData();
    // formData.append('file', file, file.name);
    // console.log(formData);
    // this.http.post(`${environment.apiServer}/oss/upload`, formData).subscribe(resp => {
    //   console.log(resp);
    // });
  }
}
