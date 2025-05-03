import { Component, Pipe, PipeTransform } from '@angular/core';
import { ShopifyBuyButtonComponent } from '../../../composant/shopify-buy-button/shopify-buy-button.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListOption } from '@angular/material/list';



@Component({
  selector: 'app-shop',
  imports: [ShopifyBuyButtonComponent, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatListOption, MatSelectModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  constructor() { }
  
products = [
  {component: '1746262304851', id: '9698056798555', category: 'men'},
  {component: '1746258121419', id: '9879512351067', category: 'men'},
]
}
