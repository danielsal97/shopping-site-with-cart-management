import { Component } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { getDocs } from 'firebase/firestore';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  public productList : any ;
  public keyWord : string = '';
  constructor(private api : ApiService, private auth: AuthService, private db : Firestore) { }

  async ngOnInit(): Promise<void> {
    this.productList = await this.api.getProducts().toPromise();
    for (const item of this.productList) {
      item.quantity = await this.update(item);
    }

    this.auth.updateqty();

  }


  addToCart(item : any){
    this.auth.addProduct(item);

  }
  update(item: any): Promise<number> {
    const cartRef = collection(this.db, 'Users', this.auth.userEmail, 'cart');
    return getDocs(cartRef).then((querySnapshot) => {
      let num = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data()['title'] === item.title) {
          num = doc.data()['quantity'];
        }
      });
      return Promise.resolve(num);
    }).catch((error) => {
      console.log(error);
      return Promise.resolve(0);
    });
  }






  }



