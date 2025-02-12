import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Contact} from "../common/Contact";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  url = "http://localhost:8989/api/contacts";
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  post(contact: Contact) {
    return this.httpClient.post(this.url, contact);
  }

  put(id: number, contact: Contact) {
    return this.httpClient.put(this.url + '/' + id, contact);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}
