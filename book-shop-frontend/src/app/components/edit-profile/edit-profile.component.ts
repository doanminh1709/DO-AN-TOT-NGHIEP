import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Customer} from 'src/app/common/Customer';
import {CustomerService} from 'src/app/services/customer.service';
import {SessionService} from 'src/app/services/session.service';
import {UploadService} from 'src/app/services/upload.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  customer!: Customer;

  selectFile!: File;
  url: string = 'https://res.cloudinary.com/veggiee-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png';
  image: string = this.url;

  postForm: FormGroup;

  @Input() id!: number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private toastr: ToastrService, private sessionService: SessionService, private customerService: CustomerService, private uploadService: UploadService) {
    this.postForm = new FormGroup({
      'userId': new FormControl(0),
      'email': new FormControl(null, [Validators.minLength(4), Validators.email, Validators.required]),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'address': new FormControl(null, [Validators.minLength(4), Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'phone': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'gender': new FormControl(true),
      'registerDate': new FormControl(new Date()),
      'status': new FormControl(1),
      'token': new FormControl(null),
      'birthday': new FormControl(null)
    })
    console.log("Post form : " , this.postForm.value);
  }

  ngOnInit(): void {
    this.getCustomer();
  }

  update() {
    if(this.postForm.valid) {
      this.customer = this.postForm.value;
      this.customer.image = this.image;

      this.customerService.update(this.id, this.customer).subscribe(data=>{
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.editFinish.emit('done');
      })
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu! ', 'Hệ thống');
    }
    this.modalService.dismissAll();
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  formatDate(dateString: string): string {
    if(dateString){
      const parts = dateString.split('/');
      return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
    return "";
  }
  getCustomer() {
    this.customerService.getOne(this.id).subscribe(data => {
      this.customer = data as Customer;
      console.log('Info customer : ' , this.customer);
      this.postForm = new FormGroup({
        'userId': new FormControl(this.customer.userId),
        'email': new FormControl(this.customer.email, [Validators.minLength(4), Validators.email, Validators.required]),
        'name': new FormControl(this.customer.name, [Validators.minLength(4), Validators.required]),
        'password': new FormControl(this.customer.password, [Validators.minLength(6), Validators.required]),
        'address': new FormControl(this.customer.address, [Validators.minLength(4), Validators.required]),
        'phone': new FormControl(this.customer.phone, [Validators.minLength(4), Validators.required, Validators.pattern('(0)[0-9]{9}')]),
        'gender': new FormControl(this.customer.gender),
        'registerDate': new FormControl(this.customer.registerDate),
        'status': new FormControl(1),
        'token': new FormControl(this.customer.token),
        'birthday': new FormControl(this.formatDate(this.customer.birthday)),
      });
      this.image = this.customer.image;
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu! ', 'Hệ thống');
    })
  }

  onFileSelect(event: any) {
    this.selectFile = event.target.files[0];
    this.uploadService.uploadCustomer(this.selectFile).subscribe(response => {
      if (response) {
        this.image = response.secure_url;
      }
    })
  }

}
