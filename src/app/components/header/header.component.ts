import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit {
qty: number =0;
constructor(private auth: AuthService , private router: Router) {


}
ngOnInit() {
  this.auth.qty.next(this.qty);
  this.auth.getQty().subscribe(res => {
      this.qty = res;
  });
}

isCollapsed: any;
logout() {
  this.auth.logout().subscribe(() => {
    this.router.navigate(['/login']);
  })
}





}




