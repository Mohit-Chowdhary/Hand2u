document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const productsContainer = document.getElementById('products-container');
    const noProductsMessage = document.getElementById('no-products-message');
    
    // Get items from localStorage
    let items = [];
    if (localStorage.getItem('items')) {
        items = JSON.parse(localStorage.getItem('items'));
    }
    
    // Get users from localStorage (for seller info)
    let users = [];
    if (localStorage.getItem('users')) {
        users = JSON.parse(localStorage.getItem('users'));
    }
    
    // Get cart from localStorage or initialize empty array
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Check if a category was selected from the home page
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (selectedCategory) {
        // Clear the selected category from sessionStorage
        sessionStorage.removeItem('selectedCategory');
        
        // Set the search input value to the selected category
        searchInput.value = selectedCategory;
        
        // Filter products based on the selected category
        searchProducts(selectedCategory);
    }
    
    // Check if we're returning to a specific product
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    
    if (productId) {
        const product = items.find(item => item.dateAdded === productId);
        
        if (product) {
            // Show the product details
            viewProductDetails(product);
            return;
        }
    }
    
    // Function to search products
    function searchProducts(query) {
        // If query is empty, show message
        if (!query.trim()) {
            productsContainer.innerHTML = '';
            noProductsMessage.textContent = 'Start typing to search for products...';
            noProductsMessage.style.display = 'block';
            return;
        }
        
        // Filter items based on search query
        const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) || 
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        // Display results
        if (filteredItems.length === 0) {
            productsContainer.innerHTML = '';
            noProductsMessage.textContent = 'No products found matching your search.';
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
            displayProducts(filteredItems);
        }
    }
    
    // Function to display products
    function displayProducts(productsList) {
        productsContainer.innerHTML = '';
        
        productsList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.dateAdded; // Using dateAdded as a unique identifier
            
            // Create image HTML - use actual image if available
            let imageHtml;
            if (product.images && product.images.length > 0) {
                imageHtml = `<img src="${product.images[0]}" alt="${product.name}">`;
            } else if (product.imageCount > 0) {
                imageHtml = `<img src="images/product-placeholder.jpg" alt="${product.name}">`;
            } else {
                imageHtml = `<div class="placeholder-icon"><i class="fa-solid fa-image"></i></div>`;
            }
            
            // Format price
            const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(product.price);
            
            // Create usage text
            const usageText = `Used for ${product.usageDuration} ${product.usageUnit}`;
            
            productCard.innerHTML = `
                <div class="product-image">
                    ${imageHtml}
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-usage">${usageText}</div>
                    <div class="product-seller">Seller: ${product.seller}</div>
                </div>
            `;
            
            // Add click event to view product details
            productCard.addEventListener('click', function() {
                viewProductDetails(product);
            });
            
            productsContainer.appendChild(productCard);
        });
    }
    
    // Function to check if user is logged in and redirect if not
    function checkLoginAndRedirect(product) {
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            // Save the product details and action in sessionStorage
            sessionStorage.setItem('pendingCartProduct', JSON.stringify(product));
            sessionStorage.setItem('pendingAction', 'addToCart');
            
            // Redirect to account page for login
            window.location.href = 'account.html';
            return false;
        }
        return true;
    }
    
    // Function to view product details
    function viewProductDetails(product) {
        // Save product to sessionStorage for detail page
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        
        // Create product detail page dynamically
        document.body.innerHTML = '';
        
        // Find seller info
        const seller = users.find(user => user.username === product.seller) || { email: 'Not available' };
        
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(product.price);
        
        // Create usage text
        const usageText = `Used for ${product.usageDuration} ${product.usageUnit}`;
        
        // Create image HTML - use actual image if available
        let imageHtml;
        if (product.images && product.images.length > 0) {
            imageHtml = `<img src="${product.images[0]}" alt="${product.name}">`;
        } else if (product.imageCount > 0) {
            imageHtml = `<img src="images/product-placeholder.jpg" alt="${product.name}">`;
        } else {
            imageHtml = `<div class="placeholder-icon"><i class="fa-solid fa-image"></i></div>`;
        }
        
        // Create HTML for product detail page
        document.body.innerHTML = `
            <header id="header">
                <img src="images/logo.png" width="250" class="logo" alt="logo">
                <div id="top">
                    <ul id="navbar">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="shop.html" class="active">Shop</a></li>
                        <li><a href="sell.html">Sell</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="cart.html"><i class="fa-solid fa-bag-shopping"></i></a></li>
                        <li><a href="account.html"><i class="fa-solid fa-user"></i></a></li>
                    </ul>
                </div>
            </header>
            
            <section class="product-detail-container">
                <div class="product-detail-image">
                    ${imageHtml}
                </div>
                <div class="product-detail-info">
                    <h1 class="product-detail-name">${product.name}</h1>
                    <div class="product-detail-price">${formattedPrice}</div>
                    <div class="product-detail-usage">${usageText}</div>
                    <div class="product-detail-description">${product.description}</div>
                    
                    <div class="product-actions">
                        <button class="buy-now-btn" id="buy-now-btn">Buy Now</button>
                        <button class="add-to-cart-btn" id="add-to-cart-btn">Add to Cart</button>
                    </div>
                    
                    <div class="seller-info">
                        <h3>Seller Information</h3>
                        <p><strong>Username:</strong> ${product.seller}</p>
                        <p><strong>Email:</strong> ${seller.email}</p>
                        <p><strong>Phone:</strong> ${product.phone || 'Not provided'}</p>
                        <p><strong>Listed on:</strong> ${new Date(product.dateAdded).toLocaleDateString()}</p>
                    </div>
                    
                    <button class="contact-btn" style="background-color: #333;" id="back-to-shop">Back to Shop</button>
                </div>
            </section>
            
            <footer class="foot">
                <div class="col1">
                    <img src="images/logo.png" class="logo" alt="logo" width="250">
                </div>

                <div class="col">
                    <h4>About</h4>
                    <a href="#">About Us</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Contact Us</a>
                </div>

                <div class="col">
                    <h4>My Account</h4>
                    <a href="#">Sign In</a>
                    <a href="#">View Cart</a>
                    <a href="#">Help</a>
                </div>

                <div class="copyright">
                    <p>&copy; 2025 VIT Resell Hub. All rights reserved.</p>
                </div>
            </footer>
        `;
        
        // Add event listener for back to shop button
        document.getElementById('back-to-shop').addEventListener('click', function() {
            window.location.href = 'shop.html';
        });
        
        // Add event listener for Buy Now button
        document.getElementById('buy-now-btn').addEventListener('click', function() {
            if (checkLoginAndRedirect(product)) {
                alert('Proceeding to checkout...');
                // window.location.href = 'checkout.html';
            }
        });
        
        // Add event listener for Add to Cart button
        document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            if (checkLoginAndRedirect(product)) {
                const isAlreadyInCart = cart.some(item => item.id === product.dateAdded);
                
                if (isAlreadyInCart) {
                    alert('This item is already in your cart.');
                } else {
                    cart.push({
                        id: product.dateAdded,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        seller: product.seller
                    });
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    alert('Item added to cart successfully!');
                }
            }
        });
    }
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
    });
    
    searchBtn.addEventListener('click', function() {
        searchProducts(searchInput.value);
    });
    
    // Initial state - show message
    if (items.length === 0) {
        noProductsMessage.textContent = 'No products have been listed yet.';
    } else {
        noProductsMessage.textContent = 'Start typing to search for products...';
    }
});
