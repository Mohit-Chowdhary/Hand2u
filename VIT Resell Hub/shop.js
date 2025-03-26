document.addEventListener('DOMContentLoaded', function() {
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
                imageHtml = `<img src="path/to/placeholder-image.jpg" alt="${product.name}">`;
            } else {
                imageHtml = `<span class="placeholder-icon">📷</span>`;
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
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formattedPrice}</p>
                    <p class="product-usage">${usageText}</p>
                    <p class="product-seller">Sold by ${product.seller}</p>
                    <button class="add-to-cart-btn" data-id="${product.dateAdded}">Add to Cart</button>
                </div>
            `;

            // Add event listener for the Add to Cart button
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleAddToCart(e, product);
            });

            productCard.addEventListener('click', () => {
                viewProductDetails(product);
            });

            productsContainer.appendChild(productCard);
        });
    }

    // Function to handle adding items to cart
    function handleAddToCart(e, product) {
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Please log in to add items to your cart');
            window.location.href = 'account.html';
            return;
        }

        let cart = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
        
        const existingProduct = cart.find(item => item.dateAdded === product.dateAdded);
        
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cart));
        
        // Visual feedback
        const button = e.target;
        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);

        // Update cart count if it exists
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Function to view product details
    function viewProductDetails(product) {
        // Create product detail container
        const productDetailContainer = document.createElement('div');
        productDetailContainer.className = 'product-detail-container';
        
        // Add back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Shop';
        backButton.className = 'back-btn';
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Clear the product details container
            productsContainer.innerHTML = '';
            
            // Show the search results if there's a query
            const currentQuery = searchInput.value;
            if (currentQuery.trim()) {
                searchProducts(currentQuery);
            } else {
                // Show the initial message
                noProductsMessage.textContent = 'Start typing to search for products...';
                noProductsMessage.style.display = 'block';
            }
        });
        
        // Get seller info
        const seller = users.find(user => user.username === product.seller) || { email: 'Unknown' };
        
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(product.price);
        
        // Create image carousel HTML
        let carouselHtml = `
            <div class="product-image-carousel">
                <div class="carousel-container">`;
        
        // Add images to carousel
        if (product.images && product.images.length > 0) {
            product.images.forEach((image, index) => {
                carouselHtml += `<div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image}" alt="${product.name} image ${index + 1}">
                </div>`;
            });
        } else {
            carouselHtml += `<div class="carousel-slide active">
                <span class="placeholder-icon">📷</span>
            </div>`;
        }
        
        carouselHtml += `</div>
            <button class="carousel-arrow prev-arrow">&#10094;</button>
            <button class="carousel-arrow next-arrow">&#10095;</button>
            <div class="carousel-indicators">`;
        
        // Add indicators
        if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                carouselHtml += `<span class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
            }
        }
        
        carouselHtml += `</div>
        </div>`;
        
        // Create product detail HTML
        productDetailContainer.innerHTML = `
            ${backButton.outerHTML}
            ${carouselHtml}
            <div class="product-detail-info">
                <h2 class="product-detail-name">${product.name}</h2>
                <p class="product-detail-price">${formattedPrice}</p>
                <p class="product-detail-usage">Used for ${product.usageDuration} ${product.usageUnit}</p>
                <p class="product-detail-description">${product.description}</p>
                
                <div class="product-actions">
                    <button class="buy-now-btn">Buy Now</button>
                    <button class="add-to-cart-btn" data-id="${product.dateAdded}">Add to Cart</button>
                </div>
                
                <div class="seller-info">
                    <h3>Seller Information</h3>
                    <p><strong>Username:</strong> ${product.seller}</p>
                    <p><strong>Email:</strong> ${seller.email}</p>
                    <p><strong>Phone:</strong> ${product.phone || 'Not provided'}</p>
                    <p><strong>Listed on:</strong> ${new Date(product.dateAdded).toLocaleDateString()}</p>
                    <button class="contact-btn">Contact Seller</button>
                </div>
            </div>
        `;
        
        // Replace products container with product detail
        productsContainer.innerHTML = '';
        productsContainer.appendChild(productDetailContainer);
        
        // Add carousel functionality
        setupCarousel(productDetailContainer);
        
        // Add event listener to the Add to Cart button
        const addToCartBtn = productDetailContainer.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => handleAddToCart(e, product));
    }

    // Function to setup carousel functionality
    function setupCarousel(container) {
        const slides = container.querySelectorAll('.carousel-slide');
        const prevArrow = container.querySelector('.prev-arrow');
        const nextArrow = container.querySelector('.next-arrow');
        const indicators = container.querySelectorAll('.indicator');
        
        if (slides.length <= 1) {
            // Hide arrows if only one image
            if (prevArrow) prevArrow.style.display = 'none';
            if (nextArrow) nextArrow.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        
        // Function to show slide
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Show selected slide
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentIndex = index;
        }
        
        // Event listeners for arrows
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            showSlide(newIndex);
        });
        
        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIndex = currentIndex + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        });
        
        // Event listeners for indicators
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(indicator.dataset.index);
                showSlide(index);
            });
        });
    }

    // Event listeners
    searchBtn.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        searchProducts(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });

    // Initial display
    if (!productId) {
        displayProducts(items);
    }
});