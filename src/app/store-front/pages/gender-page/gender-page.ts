import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {


  route = inject(ActivatedRoute);

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => {
        return gender
      })
    )
  )

  productService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({
      query: {gender: this.gender(), offset: (this.paginationService.currentPage() - 1) * 9}
    }),
    stream: ({params}) => this.productService.getProducts(params.query),
  });


}
