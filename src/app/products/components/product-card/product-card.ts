import { SlicePipe } from '@angular/common';
import { Component, input, computed } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '@products/interfaces/product.interface';
import { environment } from 'src/environments/environment.development';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard { 

  product = input.required<Product>();

  imageUrl = computed(() => `${environment.baseUrl}/api/files/product/${this.product().images[0]}`);

}
