import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import {Voucher} from "../../common/Voucher";
import {VoucherService} from "../../services/voucher.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.css']
})
export class AddVoucherComponent implements OnInit {

  voucher!: Voucher;
  url: string = 'https://res.cloudinary.com/veggiee-shop/image/upload/v1633434089/products/jq4drid7ttqsxwd15xn9.jpg';
  image: string = this.url;

  postForm: FormGroup;
  categories!: Category[];
  products!: Product[];

  selectedOption: string = 'category';


  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

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
      'startDate': new FormControl(),
      'endDate': new FormControl(),
      'categoryId': new FormControl(null),
      'productId': new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  save() {
    if (this.postForm.valid) {
      this.voucher = this.postForm.value;
      if (this.selectedOption === 'category') {
        this.voucher.category = new Category(this.postForm.value.categoryId, '');
      } else {
        this.voucher.product = new Product(this.postForm.value.productId, '');
      }

      this.voucherService.save(this.voucher).pipe(
        catchError(error => {
          if (error.status === 400) {
            this.toastr.error(error.error || 'Thêm thất bại!', 'Hệ thống');
          } else {
            this.toastr.error('Thêm thất bại!', 'Hệ thống');
          }
          return throwError(error);
        })
      ).subscribe(
        data => {
          this.toastr.success('Thêm thành công!', 'Hệ thống');
          this.saveFinish.emit('done');
        },
        error => {
          // Optional: Additional handling if needed
        });
      this.postForm = new FormGroup({
        'voucherId': new FormControl(0),
        'status': new FormControl(1),
        'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
        'discountPercent': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        'description': new FormControl(null, Validators.required),
        'startDate': new FormControl(new Date()),
        'endDate': new FormControl(new Date()),
        'categoryId': new FormControl(null),
        'productId': new FormControl(null)
      });
      this.modalService.dismissAll();
    }else{
      this.toastr.warning('Vui lòng nhập dữ liệu hợp lệ!', 'Hệ thống');
    }
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
    // Đánh dấu các control là touched để kích hoạt validate
    this.postForm.get('categoryId')?.markAsTouched();
    this.postForm.get('productId')?.markAsTouched();
  }
  selectOption(option: string) {
    this.selectedOption = option;
  }
}
