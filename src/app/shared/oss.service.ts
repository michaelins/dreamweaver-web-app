import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

export interface UploadImageResponse {
  imgUrl: string;
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
}
