import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrousel } from '@products/components/product-card/product-carrousel/product-carrousel';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarrousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {

  productService = inject(ProductService);
  router = inject(Router);

  ngOnInit(): void {
    this.setFormValue(this.product());
  }
  setFormValue(formLike: Partial<Product>) {
    //this.productForm.patchValue(formLike as any);
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  product = input.required<Product>();

  productImages = computed(() => {
    return [...this.product().images, ...this.tempImages()];
  })

  wasSaved = signal(false);

  tempImages = signal<string[]>([]);

  imageFileList: FileList | undefined;

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],

  });

  onFilesChanged(event: Event) {
    const filesList = (event.target as HTMLInputElement).files;
    this.imageFileList = filesList ?? undefined;
    const imageUrls = Array.from(filesList ?? []).map((file) => URL.createObjectURL(file));
    this.tempImages.set(imageUrls); 
  }

  onSizeChange(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched;
    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...structuredClone(formValue as any),
      tags:
        formValue.tags?.toLocaleLowerCase().split(',').map((tag) => tag.trim()) ?? []
    };


    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );
      console.log('product created');
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
      console.log('updated Product');
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];


}
