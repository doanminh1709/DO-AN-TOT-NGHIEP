import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import {VoucherService} from "../../services/voucher.service";
import {Voucher} from "../../common/Voucher";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
// import * as moment from 'moment';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditVoucherComponent implements OnInit {

  selectedOption: string = 'category';
  voucher!: Voucher;
  url: string = 'https://res.cloudinary.com/veggiee-shop/image/upload/v1633434089/products/jq4drid7ttqsxwd15xn9.jpg';
  postForm: FormGroup;
  categories!: Category[];
  products!: Product[];
  @Input() id!: number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal,
              private categoryService: CategoryService,
              private productService: ProductService,
              private voucherService: VoucherService,
              private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'voucherId': new FormControl(0),
      'status': new FormControl(1),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'discountPercent': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'startDate': new FormControl(new Date()),
      'endDate': new FormControl(new Date()),
      'categoryId': new FormControl(null, Validators.required),
      'productId': new FormControl(null , Validators.required)
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.getVoucher();
  }

  update() {
    if(this.postForm.valid) {
      this.voucher = this.postForm.value;
      if (this.selectedOption === 'category') {
        this.voucher.category = new Category(this.postForm.value.categoryId, '');
        this.voucher.product = null;
      } else {
        this.voucher.product = new Product(this.postForm.value.productId, '');
        this.voucher.category = null;
      }
      this.voucherService.update(this.voucher, this.id).pipe(
        catchError(error => {
          if (error.status === 400) {
            this.toastr.error(error.error || 'Cập nhật thất bại!', 'Hệ thống');
          } else {
            this.toastr.error('Cập nhật thất bại!', 'Hệ thống');
          }
          this.getVoucher();
          return throwError(error);
        })
      ).subscribe(data=>{
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.editFinish.emit('done');
      })
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
    this.modalService.dismissAll();
  }
  formatDate(dateString: string): string {
    if(dateString){
      const parts = dateString.split('/');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return "";
  }
  getVoucher() {
    this.voucherService.getOne(this.id).subscribe(data => {
      this.voucher = data as Voucher;
      console.log("Voucher : ", data);
      this.selectedOption = this.voucher.product ? 'product': 'category';
      this.postForm = new FormGroup({
        'voucherId': new FormControl(this.voucher.voucherId),
        'status': new FormControl(this.voucher.status),
        'name': new FormControl(this.voucher.name, [Validators.minLength(4), Validators.required]),
        'discountPercent': new FormControl(this.voucher.discountPercent, [Validators.required, Validators.min(0), Validators.max(100)]),
        'description': new FormControl(this.voucher.description, Validators.required),
        'startDate': new FormControl(this.formatDate(this.voucher.startDate)),
        'endDate': new FormControl(this.formatDate(this.voucher.endDate)),
        'categoryId': new FormControl(this.voucher.category ? this.voucher.category.categoryId : null),
        'productId': new FormControl(this.voucher.product ? this.voucher.product.productId : null)
      })
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu! ', 'Hệ thống');
    })
  }
  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }
  getProducts() {
    this.productService.getAll().subscribe(data => {
      this.products = data as Product[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
}
