import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { ProductCarrousel } from "@products/components/product-card/product-carrousel/product-carrousel";
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  
  productSlugorId = inject(ActivatedRoute).snapshot.params['idSlug'];


  productService = inject(ProductService);

  product = rxResource({
    params: () => ({
      query: this.productSlugorId
    }),
    stream: ( {params} ) => this.productService.getProduct(params.query),
  });

 }
