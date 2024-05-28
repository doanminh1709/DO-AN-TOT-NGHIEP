import { Category } from "./Category";

export class Product {
    'productId':number;
    'name':string;
    'quantity': number;
    'price': number;
    'discount':number;
    'image': string;
    'description': string;
    'enteredDate': Date;
    'category': Category;
    'status': boolean;
    'sold': number;
    'author':string;
    'pageSize':number;
    'suitableReadingAge':number;
    'language':string;
    'size':string;
    'publisher':string;

  constructor(id:number, name:string) {
    this.productId = id;
    this.name = name;
  }
}
