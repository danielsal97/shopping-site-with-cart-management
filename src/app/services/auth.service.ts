import { Injectable, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { deleteDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Checkout } from '../models/checkout';
@Injectable({
  providedIn: 'root',
})
export class AuthService{
  update(productList: any) {
    throw new Error('Method not implemented.');
  }
  public qty : BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public userEmail: string = 'null';
  constructor(private auth: Auth, private firestore: Firestore) {
    // Initialize cartQty to 0
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email || 'null';
      }
    });

  }

  getEmail(): string {
    return this.userEmail;
  }

  login(email: string, password: string) {
    this.userEmail = email;
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }
  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(this.auth.signOut());
  }
  addUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', this.userEmail);
    return from(setDoc(ref, user));
  }
  //add products to firestore
  addProduct(product: any) {
    product.quantity = product.quantity || 0;
    this.qty.next(this.qty.value + 1);
    const ref = doc(
      this.firestore,
      'Users',
      this.userEmail,
      'cart',
      product.title.replace(/\//g, '')
    );
        setDoc(ref, {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          quantity: product.quantity += 1,
          total: product.price * product.quantity,

        });
    }


  //check if product already exists
  checkProduct(product: any): Observable<boolean> {
    const ref = doc(
      this.firestore,
      'Users',
      this.userEmail,
      'cart',
      product.title.replace(/\//g, '')
    );
    return from(getDoc(ref)).pipe(
      map((doc: { exists: () => any; }) => {
        if (doc.exists()) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  //get products from firestore as a array
  getProducts(): Observable<any[]> {
    this.updateqty();
    const collectionRef = collection(
      this.firestore,
      'Users',
      this.userEmail,
      'cart'
    );
    return collectionData(collectionRef);
  }

  get(sub: string | number): Promise<number> {
    const collectionRef = collection(
      this.firestore,
      'Users',
      this.userEmail,
      'cart'
    );
    return getDocs(collectionRef)
      .then((querySnapshot) => {
        let total: number = 0;

        querySnapshot.forEach((doc) => {
          const item = doc.data();
          if (item[sub] != undefined) {
            total += item[sub];
          }
        });
        return total;
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
        return 0;
      });
  }

  removeProduct(product: any): Observable<void> {

    this.qty.next(this.qty.value - 1);

    const ref = doc(
      this.firestore,
      'Users',
      this.userEmail,
      'cart',
      product.title.replace(/\//g, '')
    );
    return from(
      updateDoc(ref, {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        quantity: (product.quantity -= 1),
        total: product.price * product.quantity,
      })
    );
  }

  deleteProduct(product: any) {
    deleteDoc(
      doc(this.firestore, 'Users', this.userEmail, 'cart', product.title.replace(/\//g, ''))
    );
    this.updateqty();

  }

  clearCart() {
    this.updateqty();
    const collectionRef = collection(
      this.firestore,
      'Users',
      this.userEmail,
      'cart'
    );
    getDocs(collectionRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
      });
  }
  placeOrder(checkout: Checkout) {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const dateTimeString = `${date} ${time}`.replace(/\//g, '-');
    var list: any[] = [];
    const cartRef = collection(this.firestore, 'Users', this.userEmail, 'cart');
    collectionData(cartRef).subscribe((res) => {
      res.forEach((item) => {
        list.push(item);
      });
      setDoc(
        doc(
          this.firestore,
          'Users',
          this.userEmail,
          'orders',
          dateTimeString,
          'checkout',
          'checkoutDetails'
        ),
        {
          Name: checkout.Name,
          email: checkout.email,
          phone: checkout.phone,
          address: checkout.address,
          address2: checkout.address2,
          country: checkout.country,
          state: checkout.state,
          zip: checkout.zip,
          cardName: checkout.cardName,
          cardNumber: checkout.cardNumber,
          expMonth: checkout.expMonth,
          expYear: checkout.expYear,
          cvv: checkout.cvv,
          totalCartPrice: checkout.totalCartPrice,
        }
      );

      for (let i = 0; i < list.length; i++) {
        const docRef = doc(
          this.firestore,
          'Users',
          this.userEmail,
          'orders',
          dateTimeString,
          'cart',
          list[i].title
        );

        setDoc(docRef, {
          title: list[i].title,
          price: list[i].price,
          description: list[i].description,
          category: list[i].category,
          image: list[i].image,
          quantity: list[i].quantity,
          total: list[i].total,
        });
      }
    });
    list = [];
  }
  updateqty() {
    this.get('quantity').then((res) => {
      this.qty.next(res);
    });
  }
  getQty(): Observable<number> {

    return this.qty.asObservable();
  }

  updateQty(): void {
    const collectionRef = collection(
      this.firestore,
      'Users',
      this.userEmail,
      'cart'
    );
    let total: number = 0;

    getDocs(collectionRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        if (item['quantity']) {
          total += item['quantity'];
        }
      });
      this.qty.next(total);
    }).catch((error) => {
      console.error('Error getting documents: ', error);
      this.qty.next(0);
    });
  }

}





