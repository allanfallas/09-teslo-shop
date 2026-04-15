import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductService } from '@products/services/products.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {

  productService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({
      query: { page: this.paginationService.currentPage() - 1 }
    }),
    stream: ({params}) => this.productService.getProducts({ offset: params.query.page * 9 }),
  });

}

