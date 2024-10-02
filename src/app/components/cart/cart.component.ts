
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  public products : any = [];
  public totalPrice :any= 0;
  qty: number = 0;

  constructor(private auth: AuthService) {
  }
  cartItems: any = [];


  ngOnInit() {
    this.auth.getProducts().subscribe(res => {
      this.cartItems = res;

      this.auth.get('total').then(res => {
        this.totalPrice =  res.toFixed(2);
      });

      }


      );

      this.auth.updateqty();


  }
  increaseQty(item:any){
    this.auth.addProduct(item);



  }
  decreaseQty(item:any){
    if (item.quantity == 1){

      this.auth.deleteProduct(item);

    }
    else
    this.auth.removeProduct(item);
  }
  deleteItem(item:any){
    this.auth.deleteProduct(item);
    this.auth.updateqty();
  }

}


