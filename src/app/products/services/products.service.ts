import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductResponse } from '@products/interfaces/product.interface';
import { EmptyError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number,
    gender?: string,
    offset?: number
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    images: [],
    user: {} as User,
    tags: []
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor() { }
    private http = inject(HttpClient);
    private productsChache = new Map<string, ProductResponse>();
    private productChache = new Map<string, Product>();


    getProducts(options: Options): Observable<ProductResponse> {

        const { limit = 9, offset = 0, gender = '' } = options;
        const key = `${limit} - ${offset} - ${gender}`;
        if (this.productsChache.has(key)) {
            return of(this.productsChache.get(key)!);
        }

        return this.http.get<ProductResponse>(`${baseUrl}/products`,
            {
                params: {
                    limit,
                    offset,
                    gender
                }
            }
        )
            .pipe(
                tap((resp) => console.log(resp)),
                tap((resp) => this.productsChache.set(key, resp))
            )
    }


    getProduct(productSlugOrId: string): Observable<Product> {
        if (this.productChache.has(productSlugOrId)) {
            return of(this.productChache.get(productSlugOrId)!);
        }
        return this.http.get<Product>(`${baseUrl}/products/${productSlugOrId}`,
            {
                params: {}

            }
        )
            .pipe(
                tap((resp) => console.log(resp)),
                tap((resp) => this.productChache.set(productSlugOrId, resp))
            )
    }

    getProductById(productId: string): Observable<Product> {

        if (productId === 'new') {
            return of(emptyProduct);
        }

        if (this.productChache.has(productId)) {
            return of(this.productChache.get(productId)!);
        }
        return this.http.get<Product>(`${baseUrl}/products/${productId}`,
            {
                params: {}

            }
        )
            .pipe(
                tap((resp) => console.log(resp)),
                tap((resp) => this.productChache.set(productId, resp))
            )
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(newImageNames => (
                {
                    ...productLike,
                    images: [...currentImages, ...newImageNames]
                }//este objeto es el 'updatedProduct'
            )),//encadeno con switchMap equivale a await pero con rsjx
            switchMap((updatedProduct) => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct).pipe(
                tap((product) => this.updatePropductCache(product)))
            ))
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(newImageNames => (
                {
                    ...productLike,
                    images: [...currentImages, ...newImageNames]
                }//este objeto es el 'updatedProduct'
            )),//encadeno con switchMap equivale a await pero con rsjx
            switchMap((updatedProduct) => this.http.post<Product>(`${baseUrl}/products/`, updatedProduct)
                .pipe(
                    tap((product) => this.updatePropductCache(product))
                )
            ))
    }

    uploadImages(images?: FileList): Observable<string[]> {
        if (!images) return of([]);

        const uploadObservables = Array.from(images)
            .map(imageFile => this.uploadImage(imageFile));

        return forkJoin(uploadObservables);
    }

    uploadImage(imageFile: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http.post<{ fileName: string }>(`${baseUrl}/files/product/`, formData)
            .pipe(
                map(resp => resp.fileName)
            )
    }

    updatePropductCache(newProduct: Product) {
        const productIdToUpdate = newProduct.id;
        this.productChache.set(productIdToUpdate, newProduct);

        this.productsChache.forEach((productResponse) => {
            productResponse.products = productResponse.products.map(
                (currentProduct) => currentProduct.id === productIdToUpdate ? newProduct : currentProduct
            )
        })
    }

}