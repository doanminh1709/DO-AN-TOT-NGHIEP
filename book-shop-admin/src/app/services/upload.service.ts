import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }
  uploadProduct(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'product_image');
    data.append('cloud_name', 'book-shop-server');
    return this.http.post('https://api.cloudinary.com/v1_1/book-shop-server/image/upload', data);
  }

  uploadCustomer(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'user_image');
    data.append('cloud_name', 'book-shop-server');
    return this.http.post('https://api.cloudinary.com/v1_1/book-shop-server/image/upload', data);
  }
}