if (!customElements.get('s-products-slider')) {
  customElements.define('s-products-slider', class SectionProductsSlider extends HTMLElement {

    constructor() {
      super()
    }

    connectedCallback() {
      this.swiper = new Swiper('.js-products-slider__list', {
        // Default parameters
        slidesPerView: 1,
        spaceBetween: 25,
        // Responsive breakpoints
        breakpoints: {
          640: {
            slidesPerView: 1.3,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          992: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          }
        }
      })
    }

    disconnectedCallback() {

		}

  })
}
