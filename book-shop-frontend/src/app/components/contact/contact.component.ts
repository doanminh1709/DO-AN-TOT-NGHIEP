import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ContactService} from "../../services/contact.service";
import {Contact} from "../../common/Contact";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  postForm: FormGroup | any;
  contact !: Contact;

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modelService: NgbModal, private contactService: ContactService, private toast: ToastrService) {
    this.postForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phone': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'title': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'content': new FormControl(null, [Validators.required, Validators.minLength(20)]),
    })
  }

  ngOnInit(): void {
  }

  sendContactToSupport() {
    console.log("Data ", this.postForm.value);
    if (this.postForm.valid) {
      this.contact = this.postForm.value;
      this.contactService.post(this.contact).subscribe(data => {

        this.modelService.dismissAll();
        this.toast.success('Gửi thông tin liên hệ tới hệ thống thành công!', 'Hệ thống');
        this.saveFinish.emit('done');
      })
    } else {
      this.toast.error('Gửi thông tin liên hệ tới hệ thống thất bại!!', 'Hệ thống');
    }
    this.postForm = new FormGroup({
      'name': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'phone': new FormControl(null),
      'title': new FormControl(null),
      'content': new FormControl(null),
    })
  }
}
