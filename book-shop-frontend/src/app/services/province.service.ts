import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  provinces = 'https://vapi.vnappmob.com/api/province/';
  districts = 'https://vapi.vnappmob.com/api/province/district/';
  wards = 'https://vapi.vnappmob.com/api/province/ward/';

  province = 'https://vapi.vnappmob.com/api/province/'
  district = 'https://vapi.vnappmob.com/api/province/district/';  
  ward = 'https://vapi.vnappmob.com/api/province/ward/';

  constructor(private http: HttpClient) { }

  getAllProvinces() {
    let result = this.http.get(this.provinces);
    return result;
  }

  getDistricts(code:number) {
    return this.http.get(this.districts+code);
  }

  getWards(code:number) {
    return this.http.get(this.wards+code);
  }

  getProvince(id: number) {
    return this.http.get(this.province+id);
  }

  getDistrict(id: number) {
    return this.http.get(this.district+id);
  }

  getWard(id: number) {
    return this.http.get(this.ward+id);
  }
}
