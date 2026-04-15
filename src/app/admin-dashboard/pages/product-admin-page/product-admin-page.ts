import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {

  productoService = inject(ProductService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  productId = toSignal(
    this.activatedRoute.params.pipe(
      map((params) => params['id'])
    )
  );

  productResource = rxResource({
    params: () => ({
      query: { id: this.productId() }
    }),
    stream: (({ params }) => this.productoService.getProductById(params.query.id))
  });

  redirectEffect = effect(() => {
    if( this.productResource.error()){
      this.router.navigate(['/admin/products'])
    }
  })


}
