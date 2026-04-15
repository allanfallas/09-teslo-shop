import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { Product, ProductResponse } from '@products/interfaces/product.interface';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable {

  products = input.required<Product[]>();


}
