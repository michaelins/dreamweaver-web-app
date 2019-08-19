import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';

export interface UploadImageResponse {
  imgUrl: string;
}

export interface ImageInfo {
  FileSize: { value: string };
  Format: { value: string };
  ImageHeight: { value: number };
  ImageWidth: { value: number };
  Compression?: { value: string };
  DateTime?: { value: string };
  ExifTag?: { value: string };
  GPSLatitude?: { value: string };
  GPSLatitudeRef?: { value: string };
  GPSLongitude?: { value: string };
  GPSLongitudeRef?: { value: string };
  GPSMapDatum?: { value: string };
  GPSTag?: { value: string };
  GPSVersionID?: { value: string };
  JPEGInterchangeFormat?: { value: string };
  JPEGInterchangeFormatLength?: { value: string };
  Orientation?: { value: string };
  ResolutionUnit?: { value: string };
  Software?: { value: string };
  XResolution?: { value: string };
  YResolution?: { value: string };
}

@Injectable({
  providedIn: 'root'
})
export class OssService {

  constructor(
    private http: HttpClient
  ) { }

  uploadImage(formData: FormData) {
    return this.http.post<UploadImageResponse>(`${environment.apiServer}/oss/upload`, formData);
  }

  getImageInfo(imageUrl: string) {
    return this.http.get<ImageInfo>(`${imageUrl}?x-oss-process=image/info`).pipe(
      map(info => {
        info.ImageWidth.value = +info.ImageWidth.value;
        info.ImageHeight.value = +info.ImageHeight.value;
        return info;
      })
    );
  }
}
