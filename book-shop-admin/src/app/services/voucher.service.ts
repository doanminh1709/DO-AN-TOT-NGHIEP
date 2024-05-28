import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Voucher} from "../common/Voucher";

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  url = "http://localhost:8989/api/vouchers";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  save(voucher: Voucher) {
    return this.httpClient.post(this.url, voucher);
  }

  update(voucher: Voucher, id: number) {
    return this.httpClient.put(this.url + '/' + id, voucher);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}
