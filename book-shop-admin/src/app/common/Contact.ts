export class Contact {
  'id': number;
  'name': string;
  'phone': string;
  'email': string;
  'title': string;
  'content': string;

  constructor(id:number, name:string , email:string ,phone:string, title: string, content:string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.title = title;
    this.content = content;
  }
}
