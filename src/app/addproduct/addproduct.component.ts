import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'config';
import Swal from 'sweetalert2';
import ProductValidator from './ProductValidator';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})

export class AddproductComponent implements OnInit {
  constructor(private router : ActivatedRoute){}
  errors : string[] = [];
  product = {
    active: true,
    description: '',
    expiry: '',
    name: '',
    price: 0,
    sku: 0,
    uom: ''
  }
  productId = '';
  ngOnInit(): void {
    this.router.params.subscribe(params => {this.productId = params['productId']});
    if(this.productId){
      fetch(`${API_URL}/Product/getProductById?productId=${this.productId}`)
      .then(resp => resp.json())
      .then(resp => {
        this.product = {...resp, expiry: resp.expiry?.split('T')[0]};
      })

    }
  }
  handleSave(){
    const validator = new ProductValidator();
    const result = validator.validate(this.product);
    this.errors = Object.values(result).map(err => String(err));
    if(this.errors.length > 0) return;
   if(this.productId){
    // update
    fetch(`${API_URL}/Product/updateProduct`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.product)
    }).then(resp => {
      if(resp.status === 403)
        Swal.fire({title: 'Error', text: 'Backend validation failed.', icon: 'error'})
      else if(resp.status === 200)
        Swal.fire({ title: 'Success', text: 'Product has been saved successfully.' }).then(() => window.location.href = '/products')
      else
        Swal.fire({title: 'Error', text: 'Server error occured.', icon: 'error'})
    })
    .catch(err => Swal.fire({ title: 'Error', text: 'An error occured while trying to save the product.', icon: 'error' }))
   }
   else{
    // save product
    fetch(`${API_URL}/Product/addNewProduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.product)
    }).then(resp => {
      if(resp.status === 403 || resp.status === 400)
        Swal.fire({title: 'Error', text: 'Backend validation failed.', icon: 'error'})
      else if(resp.status === 200)
        Swal.fire({ title: 'Success', text: 'Product has been saved successfully.' }).then(() => window.location.href = '/products')
      else
        Swal.fire({title: 'Error', text: 'Server error occured.', icon: 'error'})
    })
    .catch(err => Swal.fire({ title: 'Error', text: 'An error occured while trying to save the product.', icon: 'error' }))
   }
  }
}
