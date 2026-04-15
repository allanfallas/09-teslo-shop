import { afterNextRender, AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';


@Component({
  selector: 'product-carrousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carrousel.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }

  `
})
export class ProductCarrousel implements AfterViewInit, OnChanges {

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;
    console.log(changes);
    this.swiper?.destroy(true, true);

    const paginationElement: HTMLElement =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    paginationElement.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 300);

  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }



}
