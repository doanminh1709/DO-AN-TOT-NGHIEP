import {Category} from "./Category";
import {Product} from "./Product";

export class Voucher{
  'voucherId':number;
  'name':string;
  'discountPercent':number;
  'status': boolean;
  'description': string;
  'startDate': string;
  'endDate': string;
  'category': Category | any;
  'product':Product | any;
}
