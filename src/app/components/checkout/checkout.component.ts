import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Checkout } from 'src/app/models/checkout';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

   checkout: Checkout = {
    Name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    country: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    totalCartPrice:''
  };


  placeOrder() {
    // Here you can a
   this.auth.get('total').then(res => {
      this.checkout.totalCartPrice = res.toFixed(2);
    });
    this.auth.placeOrder(this.checkout);
    this.auth.clearCart();
    this.router.navigate(['/home']);
  }
}
