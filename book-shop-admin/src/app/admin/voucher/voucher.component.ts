import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/common/Product';
import { PageService } from 'src/app/services/page.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import {Voucher} from "../../common/Voucher";
import {CategoryService} from "../../services/category.service";
import {VoucherService} from "../../services/voucher.service";

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  listData!: MatTableDataSource<Voucher>;
  vouchers!: Voucher[];
  voucherLength!: number;
  columns: string[] = ['voucherId', 'name', 'discountPercent', 'description', 'category', 'product', 'startDate', 'endDate', 'view', 'delete'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService,
              private voucherService:VoucherService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('voucher');
    this.getAll();
  }

  getAll() {
    this.voucherService.getAll().subscribe(data => {
      this.vouchers = data as Voucher[];
      console.log("Voucher : ", this.vouchers);
      this.listData = new MatTableDataSource(this.vouchers);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Bạn muốn xoá ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Xoá thành công!', 'Hệ thống');
        },error=>{
          this.toastr.error('Xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  finish() {
    this.pageService.setPageActive('voucher');
    this.getAll();
  }
}
