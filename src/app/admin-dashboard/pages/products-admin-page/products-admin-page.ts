import { ProductService } from '@products/services/products.service';
import { Component, inject, signal } from '@angular/core';
import { ProductTable } from "@products/components/product-table/product-table";
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage { 

  
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  productPerPage = signal(10);
  productsResource = rxResource({
    params: () => ({
      query: { 
        offset: (this.paginationService.currentPage() - 1) * this.productPerPage(), 
        limit: this.productPerPage() }
    }),
    stream: ({ params }) => this.productService.getProducts(params.query),
  });

}
