import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { OrderDetail } from 'src/app/common/OrderDetail';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderDetails!:OrderDetail[];
  order!:Order;

  @Input() id!:number;

  constructor(private modalService: NgbModal, private orderService: OrderService, private toastr: ToastrService, private notificationService: NotificationService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.getOrder();
    this.getItems();
  }

  getOrder() {
    this.orderService.getById(this.id).subscribe(data=>{
      this.order = data as Order;
    },error=>{
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getItems() {
    this.orderService.getByOrder(this.id).subscribe(data=>{
      this.orderDetails = data as OrderDetail[];      
    },error=>{
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {centered: true, size: 'lg'})
  }

  finish() {
    this.ngOnInit();
  }

  confirm() {
    Swal.fire({
      title: 'Bạn muốn xác nhận đơn hàng này đã giô thành công?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.success(this.order.ordersId).subscribe(data => {
          this.toastr.success('Xác nhận thành công!', 'Hệ thống');
          this.sendMessage(this.order.ordersId);
          this.ngOnInit()
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  sendMessage(id: number) {
    let chatMessage = new ChatMessage(this.order.user.name, ' đã đặt xác nhận đơn hàng đã giao thành công!');
    this.notificationService.post(new Notification(0, this.order.user.name + ' đã đặt xác nhận đơn hàng đã giao thành công! (' + id + ')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
  }

}
