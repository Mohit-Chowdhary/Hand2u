document.addEventListener('DOMContentLoaded', function() {
    const loginMessage = document.getElementById('login-message');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping');

    // Check if user is logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        loginMessage.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        cartContent.style.display = 'none';
        return;
    }

    // Get cart from localStorage or initialize it
    let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];

    // Display appropriate message based on cart contents
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        displayCart();
    }

    function displayCart() {
        cartContent.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">₹${formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals();
        addCartEventListeners();
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(price);
    }

    function updateTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const formattedSubtotal = formatPrice(subtotal);
        
        subtotalElement.textContent = `₹${formattedSubtotal}`;
        totalElement.textContent = `₹${formattedSubtotal}`;
        
        // Save updated cart to localStorage
        localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));

        // Update cart icon if it exists
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    function addCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.dataset.index);
                
                if (this.classList.contains('plus')) {
                    cart[index].quantity++;
                    animateButton(this, '#4CAF50');
                } else if (this.classList.contains('minus') && cart[index].quantity > 1) {
                    cart[index].quantity--;
                    animateButton(this, '#ff4757');
                }
                
                displayCart();
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.dataset.index);
                const item = cart[index];
                
                // Animate removal
                const cartItem = this.closest('.cart-item');
                cartItem.style.transition = 'all 0.3s ease';
                cartItem.style.transform = 'translateX(100%)';
                cartItem.style.opacity = '0';
                
                setTimeout(() => {
                    cart.splice(index, 1);
                    if (cart.length === 0) {
                        emptyCartMessage.style.display = 'block';
                        cartContent.style.display = 'none';
                    } else {
                        displayCart();
                    }
                    updateTotals();
                }, 300);
            });
        });
    }

    function animateButton(button, color) {
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = color;
        button.style.color = 'white';
        
        setTimeout(() => {
            button.style.backgroundColor = originalColor;
            button.style.color = '#2c3e50';
        }, 200);
    }

    // Checkout button
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add loading state
        this.innerHTML = '<span class="loading"></span> Processing...';
        this.disabled = true;
        
        setTimeout(() => {
            alert('Proceeding to checkout...');
            this.innerHTML = 'Proceed to Checkout';
            this.disabled = false;
        }, 1000);
    });

    // Continue shopping button
    continueShoppingBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'shop.html';
    });

    // Add smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});