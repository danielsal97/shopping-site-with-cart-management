import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { AuthService } from './services/auth.service';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { BehaviorSubject } from 'rxjs';
const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToProducts = () => redirectLoggedInTo(['products']);


const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, ...canActivate(redirectToLogin) },
  { path: 'cart', component: CartComponent, ...canActivate(redirectToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToProducts) },
  { path: 'signup', component: SignupComponent, ...canActivate(redirectLoggedInToProducts)},
  { path: 'checkout', component: CheckoutComponent, ...canActivate(redirectToLogin) },
  { path: 'home', component: HomeComponent, ...canActivate(redirectToLogin) }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
