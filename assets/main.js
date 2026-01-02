/* Gen Z Streetwear Theme - Main JavaScript */

(function() {
  'use strict';

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });
  }

  // Cart Drawer
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartDrawerOpen = document.querySelectorAll('[data-cart-drawer-open]');
  const cartDrawerClose = document.querySelector('[data-cart-drawer-close]');
  const cartDrawerOverlay = document.querySelector('[data-cart-drawer-overlay]');

  function openCartDrawer() {
    if (cartDrawer) {
      cartDrawer.classList.add('is-open');
      document.body.classList.add('cart-open');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer) {
      cartDrawer.classList.remove('is-open');
      document.body.classList.remove('cart-open');
    }
  }

  cartDrawerOpen.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }

  // Auth Drawer (Login/Signup)
  const authDrawer = document.querySelector('[data-auth-drawer]');
  const authDrawerOpen = document.querySelectorAll('[data-login-drawer-open]');
  const authDrawerClose = document.querySelector('[data-auth-drawer-close]');
  const authDrawerOverlay = document.querySelector('[data-auth-drawer-overlay]');

  function openAuthDrawer() {
    if (authDrawer) {
      authDrawer.classList.add('is-open');
      document.body.classList.add('auth-open');
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
      // Reset to login view when opening
      const views = authDrawer.querySelectorAll('[data-auth-view]');
      const titleEl = authDrawer.querySelector('[data-auth-title]');
      views.forEach(view => {
        view.classList.remove('auth-drawer__view--active');
        if (view.dataset.authView === 'login') {
          view.classList.add('auth-drawer__view--active');
        }
      });
      if (titleEl) titleEl.textContent = 'Login';
    }
  }

  function closeAuthDrawer() {
    if (authDrawer) {
      authDrawer.classList.remove('is-open');
      document.body.classList.remove('auth-open');
    }
  }

  authDrawerOpen.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthDrawer();
    });
  });

  if (authDrawerClose) {
    authDrawerClose.addEventListener('click', closeAuthDrawer);
  }

  if (authDrawerOverlay) {
    authDrawerOverlay.addEventListener('click', closeAuthDrawer);
  }

  // Escape key closes drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeAuthDrawer();
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    }
  });

  // Add to Cart
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const form = this.closest('form');
      const formData = new FormData(form);
      
      this.classList.add('loading');
      this.disabled = true;
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          await refreshCartDrawer();
          await updateCartCount();
          openCartDrawer();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        this.classList.remove('loading');
        this.disabled = false;
      }
    });
  });

  // Update Cart Count
  async function updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  // Cart Quantity Controls
  document.querySelectorAll('[data-quantity-wrapper]').forEach(wrapper => {
    const minusBtn = wrapper.querySelector('[data-quantity-minus]');
    const plusBtn = wrapper.querySelector('[data-quantity-plus]');
    const input = wrapper.querySelector('[data-quantity-input]');
    
    if (minusBtn && plusBtn && input) {
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
          input.dispatchEvent(new Event('change'));
        }
      });
      
      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        const max = parseInt(input.max) || Infinity;
        if (currentValue < max) {
          input.value = currentValue + 1;
          input.dispatchEvent(new Event('change'));
        }
      });
      
      // Update cart when quantity changes
      input.addEventListener('change', async function() {
        const line = this.dataset.line;
        const quantity = parseInt(this.value) || 1;
        
        if (line) {
          await updateCartItem(parseInt(line), quantity);
        }
      });
    }
  });

  // Remove Item from Cart
  document.querySelectorAll('[data-remove-item]').forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      const line = parseInt(this.dataset.removeItem);
      
      if (line) {
        this.disabled = true;
        await updateCartItem(line, 0);
      }
    });
  });

  // Update Cart Item (quantity or remove)
  async function updateCartItem(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: line,
          quantity: quantity
        })
      });
      
      if (response.ok) {
        // Refresh cart drawer content
        await refreshCartDrawer();
        await updateCartCount();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  // Refresh Cart Drawer Content
  async function refreshCartDrawer() {
    try {
      // Fetch cart data via API
      const cartResponse = await fetch('/cart.js');
      const cart = await cartResponse.json();
      
      const currentContent = document.querySelector('[data-cart-drawer-content]');
      let currentFooter = document.querySelector('.cart-drawer__footer');
      const cartDrawer = document.querySelector('[data-cart-drawer]');
      
      if (cart.item_count === 0) {
        // Cart is empty
        if (currentContent) {
          currentContent.innerHTML = `
            <div class="cart-drawer__empty">
              <p class="cart-drawer__empty-text">Your bag is empty</p>
              <a href="/collections/all" class="btn btn-gradient">Start Shopping</a>
            </div>
          `;
        }
        if (currentFooter) {
          currentFooter.remove();
        }
      } else {
        // Build cart items HTML
        let itemsHtml = '<ul class="cart-drawer__items">';
        cart.items.forEach((item, index) => {
          const lineIndex = index + 1;
          itemsHtml += `
            <li class="cart-drawer__item">
              <a href="${item.url}" class="cart-drawer__item-image">
                ${item.image ? `<img src="${item.image.replace(/(\.[^.]+)$/, '_120x120$1')}" alt="${item.title}" width="80" height="80" loading="lazy">` : ''}
              </a>
              <div class="cart-drawer__item-details">
                <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
                ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : ''}
                <div class="cart-drawer__item-price">${formatMoney(item.final_line_price)}</div>
                <div class="cart-drawer__item-quantity" data-quantity-wrapper>
                  <button type="button" class="cart-drawer__quantity-btn" data-quantity-minus aria-label="Decrease quantity">-</button>
                  <input 
                    type="number" 
                    value="${item.quantity}" 
                    min="1" 
                    class="cart-drawer__quantity-input"
                    data-quantity-input
                    data-line="${lineIndex}"
                    aria-label="Quantity"
                  >
                  <button type="button" class="cart-drawer__quantity-btn" data-quantity-plus aria-label="Increase quantity">+</button>
                </div>
              </div>
              <button 
                type="button" 
                class="cart-drawer__item-remove"
                data-remove-item="${lineIndex}"
                aria-label="Remove ${item.title}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </li>
          `;
        });
        itemsHtml += '</ul>';
        
        if (currentContent) {
          currentContent.innerHTML = itemsHtml;
          initCartQuantityControls();
          initRemoveButtons();
        }
        
        // Build footer HTML
        const footerHtml = `
          <div class="cart-drawer__subtotal">
            <span>Subtotal</span>
            <span class="cart-drawer__subtotal-price">${formatMoney(cart.total_price)}</span>
          </div>
          <p class="cart-drawer__note">Shipping & taxes calculated at checkout</p>
          <a href="/checkout" class="btn btn-gradient cart-drawer__checkout">Checkout →</a>
          <a href="/cart" class="cart-drawer__view-cart">View Full Cart</a>
        `;
        
        // Update existing footer or create new one
        if (currentFooter) {
          currentFooter.innerHTML = footerHtml;
        } else if (cartDrawer) {
          const newFooter = document.createElement('footer');
          newFooter.className = 'cart-drawer__footer';
          newFooter.innerHTML = footerHtml;
          cartDrawer.appendChild(newFooter);
        }
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  }
  
  // Format money helper (Shopify currency format)
  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    // Adjust format based on store currency - default to $
    return '$' + amount;
  }

  // Initialize cart quantity controls (for dynamic content)
  function initCartQuantityControls() {
    document.querySelectorAll('[data-quantity-wrapper]').forEach(wrapper => {
      const minusBtn = wrapper.querySelector('[data-quantity-minus]');
      const plusBtn = wrapper.querySelector('[data-quantity-plus]');
      const input = wrapper.querySelector('[data-quantity-input]');
      
      if (minusBtn && plusBtn && input) {
        // Remove existing listeners by cloning
        const newMinus = minusBtn.cloneNode(true);
        const newPlus = plusBtn.cloneNode(true);
        const newInput = input.cloneNode(true);
        
        minusBtn.replaceWith(newMinus);
        plusBtn.replaceWith(newPlus);
        input.replaceWith(newInput);
        
        newMinus.addEventListener('click', () => {
          const currentValue = parseInt(newInput.value) || 1;
          if (currentValue > 1) {
            newInput.value = currentValue - 1;
            newInput.dispatchEvent(new Event('change'));
          }
        });
        
        newPlus.addEventListener('click', () => {
          const currentValue = parseInt(newInput.value) || 1;
          const max = parseInt(newInput.max) || Infinity;
          if (currentValue < max) {
            newInput.value = currentValue + 1;
            newInput.dispatchEvent(new Event('change'));
          }
        });
        
        newInput.addEventListener('change', async function() {
          const line = this.dataset.line;
          const quantity = parseInt(this.value) || 1;
          if (line) {
            await updateCartItem(parseInt(line), quantity);
          }
        });
      }
    });
  }

  // Initialize remove buttons (for dynamic content)
  function initRemoveButtons() {
    document.querySelectorAll('[data-remove-item]').forEach(button => {
      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);
      
      newButton.addEventListener('click', async function(e) {
        e.preventDefault();
        const line = parseInt(this.dataset.removeItem);
        if (line) {
          this.disabled = true;
          await updateCartItem(line, 0);
        }
      });
    });
  }

  // Sticky Header
  const header = document.querySelector('.site-header');
  if (header && header.dataset.sticky === 'true') {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      
      lastScroll = currentScroll;
    });
  }

  // Intersection Observer for Animations
  const animateOnScroll = document.querySelectorAll('[data-animate]');
  
  if (animateOnScroll.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animateOnScroll.forEach(el => observer.observe(el));
  }

  // Product Image Hover
  document.querySelectorAll('.product-card').forEach(card => {
    const images = card.querySelectorAll('.product-card__image img');
    if (images.length > 1) {
      card.addEventListener('mouseenter', () => {
        images[0].style.opacity = '0';
        images[1].style.opacity = '1';
      });
      
      card.addEventListener('mouseleave', () => {
        images[0].style.opacity = '1';
        images[1].style.opacity = '0';
      });
    }
  });

  // Newsletter Form
  const newsletterForm = document.querySelector('[data-newsletter-form]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const button = this.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      
      button.textContent = 'Subscribing...';
      button.disabled = true;
      
      // Simulate API call - replace with actual implementation
      setTimeout(() => {
        button.textContent = 'Subscribed! 🎉';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          this.reset();
        }, 2000);
      }, 1000);
    });
  }

  // Initialize
  updateCartCount();
})();
