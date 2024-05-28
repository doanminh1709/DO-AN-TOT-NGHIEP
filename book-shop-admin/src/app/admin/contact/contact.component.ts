import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {PageService} from "../../services/page.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Contact} from "../../common/Contact";
import {ContactService} from "../../services/contact.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {


  contacts!: Contact[];
  listData!: MatTableDataSource<Contact>;
  ratesLength!: number;
  columns: string[] = ['index', 'name', 'email','phone', 'title', 'content', 'delete'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private contactService: ContactService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('contact');
    this.getAll();
  }

  getAll() {
    this.contactService.getAll().subscribe(data => {
      this.contacts = data as Contact[];
      this.listData = new MatTableDataSource(this.contacts);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.ratesLength = this.contacts.length;
      console.log("Content : " , this.contacts);
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá liên hệ này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Xoá thành công!', 'Hệ thống');
        }, error => {
          this.toastr.error('Xoá thất bại, đã xảy ra lỗi!' + error.status, 'Hệ thống');
        })
      }
    })
  }


  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.contactService.getAll().subscribe(data => {
      this.contacts = data as Contact[];
      // this.contacts = this.contacts.filter(r => r.user.name.toLowerCase().includes(fValue.toLowerCase()) || r.product.name.toLowerCase().includes(fValue.toLowerCase()) || r.comment.toLowerCase().includes(fValue.toLowerCase()));
      this.listData = new MatTableDataSource(this.contacts);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.ratesLength = this.contacts.length;
    })
  }
}
