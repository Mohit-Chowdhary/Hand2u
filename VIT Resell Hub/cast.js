document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    // Check if user is logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        // Redirect to login page if not logged in
        alert('Please log in to view your cart');
        window.location.href = 'sell.html'; // Assuming sell.html has the login form
        return;
    }
    
    // Get cart from localStorage
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Display cart items or empty cart message
    if (cart.length === 0) {
        showEmptyCart();
    } else {
        displayCartItems();
    }
    
    // Function to show empty cart message
    function showEmptyCart() {
        cartItemsContainer.style.display = 'none';
        document.getElementById('cart-summary').style.display = 'none';
        emptyCartMessage.style.display = 'block';
    }
    
    // Function to display cart items
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        document.getElementById('cart-summary').style.display = 'block';
        
        // Create HTML for each cart item
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.id = item.id;
            
            // Format price
            const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(item.price);
            
            // Create HTML structure
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <div class="placeholder-icon"><i class="fa-solid fa-image"></i></div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-top">
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-seller">Seller: ${item.seller}</div>
                        </div>
                        <div class="cart-item-price">${formattedPrice}</div>
                    </div>
                    <div class="cart-item-bottom">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to buttons
        addEventListeners();
        
        // Update totals
        updateTotals();
    }
    
    // Function to add event listeners to cart item buttons
    function addEventListeners() {
        // Increase quantity buttons
        const increaseButtons = document.querySelectorAll('.increase-btn');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateItemQuantity(itemId, 1);
            });
        });
        
        // Decrease quantity buttons
        const decreaseButtons = document.querySelectorAll('.decrease-btn');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateItemQuantity(itemId, -1);
            });
        });
        
        // Remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                removeItem(itemId);
            });
        });
    }
    
    // Function to update item quantity
    function updateItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            // Ensure quantity doesn't go below 1
            if (cart[itemIndex].quantity < 1) {
                cart[itemIndex].quantity = 1;
            }
            
            // Update quantity display
            const quantityInput = document.querySelector(`.cart-item[data-id="${itemId}"] .quantity-input`);
            if (quantityInput) {
                quantityInput.value = cart[itemIndex].quantity;
            }
            
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update totals
            updateTotals();
        }
    }
    
    // Function to remove item from cart
    function removeItem(itemId) {
        // Filter out the item to be removed
        cart = cart.filter(item => item.id !== itemId);
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Remove item element from DOM
        const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
        }
        
        // Show empty cart message if cart is now empty
        if (cart.length === 0) {
            showEmptyCart();
        } else {
            // Update totals
            updateTotals();
        }
    }
    
    // Function to update subtotal and total
    function updateTotals() {
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Format currency
        const formattedSubtotal = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(subtotal);
        
        // Update display
        subtotalElement.textContent = formattedSubtotal;
        totalElement.textContent = formattedSubtotal; // Same as subtotal since shipping is free
    }
    
    // Event listener for checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some items before checking out.');
            return;
        }
        
        // In a real app, this would redirect to a checkout page
        alert('Proceeding to checkout...');
        // Clear cart after successful checkout
        localStorage.removeItem('cart');
        // Redirect to home page
        window.location.href = 'index.html';
    });
    
    // Event listener for continue shopping button
    continueShoppingBtn.addEventListener('click', function() {
        window.location.href = 'shop.html';
    });
});
