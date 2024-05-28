import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { District } from 'src/app/common/District';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { Province } from 'src/app/common/Province';
import { ResultProvince } from 'src/app/common/ResultProvince';
import { ResultDistrict } from 'src/app/common/ResultDistrict';
import { Ward } from 'src/app/common/Ward';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';
import { ResultWard } from 'src/app/common/ResultWard';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  discount!: number;
  amount!: number;
  amountReal!: number;

  postForm: FormGroup;

  province!: Province;
  district!: District;
  ward!: Ward;

  resultProvinces!: ResultProvince;
  provinces!: Province[];
  resultDistricts!: ResultDistrict;
  districts!: District[];
  resultWards!: ResultWard;
  wards!: Ward[];

  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;

  amountPaypal !: number;
  public payPalConfig?: IPayPalConfig;

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private sessionService: SessionService,
    private orderService: OrderService, private location: ProvinceService, private webSocketService: WebSocketService, private notificationService: NotificationService) {
    this.postForm = new FormGroup({
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'province': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'number': new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.discount = 0;
    this.amount = 0;
    this.amountReal = 0;
    // this.amountPaypal = 0;
    this.getAllItem();
    this.getProvinces();
    this.checkOutPaypal();
  }

  getAllItem() {
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.postForm = new FormGroup({
        'phone': new FormControl(this.cart.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
        'province': new FormControl(0, [Validators.required, Validators.min(1)]),
        'district': new FormControl(0, [Validators.required, Validators.min(1)]),
        'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
        'number': new FormControl('', Validators.required),
      })
      this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
        this.cartDetails = data as CartDetail[];
        this.cartService.setLength(this.cartDetails.length);
        if (this.cartDetails.length == 0) {
          this.router.navigate(['/']);
          this.toastr.info('Hãy chọn một vài sản phẩm rồi tiến hành thanh toán', 'Hệ thống');
        }
        this.cartDetails.forEach(item => {
          this.amountReal += item.product.price * item.quantity;
          this.amount += item.price;
        })
        this.discount = this.amount - this.amountReal;

        this.amountPaypal = (this.amount / 22727.5);
      })
    })
  }

  checkOut() {
    if (this.postForm.valid) {
      Swal.fire({
        title: 'Bạn có muốn đặt đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đặt'
      }).then((result) => {
        if (result.isConfirmed) {
          let email = this.sessionService.getUser();
          this.cartService.getCart(email).subscribe(data => {
            this.cart = data as Cart;
            // this.cart.address = this.postForm.value.number + ', ' + this.ward.name + ', ' + this.district.name + ', ' + this.province.name;
            this.cart.phone = this.postForm.value.phone;
            this.cartService.updateCart(email, this.cart).subscribe(data => {
              this.cart = data as Cart;
              this.orderService.post(email, this.cart).subscribe(data => {
                let order: Order = data as Order;
                this.sendMessage(order.ordersId);
                Swal.fire(
                  'Thành công!',
                  'Chúc mừng bạn đã đặt hàng thành công.',
                  'success'
                )
                this.router.navigate(['/cart']);
              }, error => {
                this.toastr.error('Lỗi server', 'Hệ thống');
              })
            }, error => {
              this.toastr.error('Lỗi server', 'Hệ thống');
            })
          }, error => {
            this.toastr.error('Lỗi server', 'Hệ thống');
          })
        }
      })
    } else {
      Swal.fire(
        'Thông báo',
        'Hãy nhập đầy đủ thông tin',
        'error'
      )
      // this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
    }
  }

  payment() {
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      // this.cart.address = this.postForm.value.number + ', ' + this.ward.name + ', ' + this.district.name + ', ' + this.province.name;

      this.cart.phone = this.postForm.value.phone;
      this.cartService.updateCart(email, this.cart).subscribe(data => {
        this.cart = data as Cart;
        this.orderService.payment(email, this.cart).subscribe(data => {
          let order: Order = data as Order;
          this.sendMessagePayment(order.ordersId);
          Swal.fire(
            'Thành công!',
            'Chúc mừng bạn đã thanh toán thành công.',
            'success'
          )
          this.router.navigate(['/cart']);
        }, error => {
          this.toastr.error('Lỗi server', 'Hệ thống');
        })
      }, error => {
        this.toastr.error('Lỗi server', 'Hệ thống');
      })
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  sendMessage(id: number) {
    let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
    this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng (' + id + ')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
  }

  sendMessagePayment(id: number) {
    let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt và thanh toán một đơn hàng');
    this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt và thanh toán một đơn hàng (' + id + ')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
  }

  getProvinces() {
    this.location.getAllProvinces().subscribe(data => {
      this.resultProvinces = data as ResultProvince;
      this.provinces = this.resultProvinces.results;
    })
  }

  getDistricts() {
    this.location.getDistricts(this.provinceCode).subscribe(data => {
      this.resultDistricts = data as ResultDistrict;
      this.districts = this.resultDistricts.results;
    })
  }

  getWards() {
    this.location.getWards(this.districtCode).subscribe(data => {
      this.resultWards = data as ResultWard;
      this.wards = this.resultWards.results;
    })
  }

  setProvinceCode(code: any) {
    this.provinceCode = code.value;
    this.getDistricts();
    this.getProvinceName(code)
  }

  setDistrictCode(code: any) {
    this.districtCode = code.value;
    this.getWards();
    this.getDistrictName(code);
  }

  setWardCode(code: any) {
    this.wardCode = code.value;
    this.getWardName(code);
  }

  getProvinceName(provinceId: any) {
    this.province = this.resultProvinces.results.find((p: any) => p.province_id === provinceId) as Province;
  }

  getDistrictName(distrctCodeId: any) {
    this.district = this.resultDistricts.results.find((p: any) => p.district_id === distrctCodeId) as District;
  }

  getWardName(wardId: any) {
    this.ward = this.resultWards.results.find((p: any) => p.ward_id === wardId) as Ward;
  }

  private checkOutPaypal(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AZKviBwzeeRaffQBHarsuvM1W6_1tSAiVnAlh1jjAcGSajqnGAASA5QuoE5GAglNxt3DvzC5ANYDbBS_',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: String(this.amountPaypal.toFixed(2)),
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'blue',
        size: 'small',
        shape: 'rect',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.payment();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
        Swal.fire(
          'Thông báo!',
          'Tài khoản của bạn bị lỗi hoặc hết tiền.',
          'error'
        )
      },
      onClick: (data, actions) => {
        // if (!this.postForm.valid) {
        //   this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
        //   return;
        // }
        console.log('onClick', data, actions);
      },
    };
  }

}