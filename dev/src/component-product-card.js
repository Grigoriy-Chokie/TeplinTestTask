if (!customElements.get('c-product-card')) {
  customElements.define('c-product-card', class ComponentProductCard extends HTMLElement {
    constructor() {
      super();
      this.addToCart = this.addToCart.bind(this); // Bind the method to the current instance
    }

    connectedCallback() {
      // Find the cart component (cart-notification or cart-drawer)
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');

      // Ensure the button exists
      this.addToCartButton = this.querySelector(".js-product-card__button");
      if (this.addToCartButton) {
        this.variantId = this.dataset.variantId;
        this.addToCartButton.addEventListener("click", this.addToCart);
      } else {
        console.warn("Add-to-cart button not found");
      }
    }

    disconnectedCallback() {
      // Remove the event listener for the button when the element is disconnected
      if (this.addToCartButton) {
        this.addToCartButton.removeEventListener("click", this.addToCart);
      }
    }

    addToCart() {
      // Check if the variant ID is present
      if (!this.variantId) {
        console.warn("Variant ID is not specified");
        return;
      }

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData();
      formData.append("id", this.variantId);
      formData.append("quantity", 1);

      // If the cart component exists, add necessary data
      if (this.cart) {
        formData.append(
          'sections',
          this.cart.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      
      config.body = formData;

      // Disable the button to prevent multiple clicks
      this.addToCartButton.setAttribute('disabled', "true");

      fetch(routes.cart_add_url, config)
        .then((response) => response.json())
        .then((response) => {
          // Handle error status
          if (response.status) {
            console.warn("Error adding to cart:", response.message || response.status);
            return;
          }

          // Redirect to the cart if no cart component exists
          if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          // Render the updated cart content
          this.cart.renderContents(response);
        })
        .catch((error) => {
          console.error("Error while adding to cart:", error);
        })
        .finally(() => {
          // Re-enable the button and update the cart state
          this.addToCartButton.removeAttribute('disabled');

          if (this.cart && this.cart.classList.contains('is-empty')) {
            this.cart.classList.remove('is-empty');
          }
        });
    }
  });
}
