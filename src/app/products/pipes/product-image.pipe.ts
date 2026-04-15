import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[] | null): string {

        if (value === null) {
            return 'assets/images/no-image.jpg';
        }

        if(typeof value === 'string' && value.startsWith('blob:')){
            return value;
        }

        if (Array.isArray(value) && value.length > 0) {
            return `${environment.baseUrl}/files/product/${value[0]}`;
        } else if (typeof value === 'string' && value.length > 0) {
            return `${environment.baseUrl}/files/product/${value}`;
        }

        return 'assets/images/no-image.jpg';
    }
}