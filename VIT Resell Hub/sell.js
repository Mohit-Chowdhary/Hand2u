document.addEventListener('DOMContentLoaded', function() {
    // Get form and section elements
    const choiceSection = document.getElementById('choice-section');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const sellFormSection = document.getElementById('sell-form-section');
    
    // Get buttons
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    
    // Check if user is already logged in
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Store user data (in a real app, this would be server-side)
    let users = [];
    
    // Load any existing users from localStorage
    if (localStorage.getItem('users')) {
        users = JSON.parse(localStorage.getItem('users'));
    }
    
    // If user is already logged in, show sell form directly
    if (currentUser) {
        // Hide login/signup sections
        if (choiceSection) choiceSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'none';
        if (signupSection) signupSection.style.display = 'none';
        
        // Show sell form
        showSellForm();
    }
    
    // Show login form
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function() {
            console.log("Login button clicked");
            choiceSection.style.display = 'none';
            showLoginForm();
        });
    }
    
    // Show signup form
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function() {
            console.log("Signup button clicked");
            choiceSection.style.display = 'none';
            signupSection.style.display = 'flex';
        });
    }
    
    // Function to create and show login form
    function showLoginForm() {
        loginSection.innerHTML = `
            <div class="form-section">
                <h2>Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-email">College Email</label>
                        <input type="email" id="login-email" placeholder="yourname@vitstudent.ac.in" required>
                        <div class="error-message" id="login-email-error">Please enter a valid VIT email address.</div>
                    </div>
                    <div class="form-group">
                        <label for="login-username">Username</label>
                        <input type="text" id="login-username" placeholder="Enter your username" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" placeholder="Enter your password" required>
                    </div>
                    <div class="error-message" id="login-error">Invalid credentials. Please try again.</div>
                    <div class="success-message" id="login-success">Login successful!</div>
                    <button type="submit" class="form-btn">Login</button>
                    <div class="form-footer">
                        <p>Don't have an account? <a href="#" id="switch-to-signup">Create one</a></p>
                    </div>
                </form>
            </div>
        `;

        // Show login section
        loginSection.style.display = 'flex';

        // Add event listeners
        document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
        document.getElementById('switch-to-signup').addEventListener('click', function(e) {
            e.preventDefault();
            loginSection.style.display = 'none';
            signupSection.style.display = 'flex';
        });
    }
    
    // Function to validate password
    function validatePassword(password) {
        // Check if password is at least 6 characters
        if (password.length < 6) {
            return {
                valid: false,
                message: "Password must be at least 6 characters long."
            };
        }
        
        // Check if password contains at least one number
        if (!/\d/.test(password)) {
            return {
                valid: false,
                message: "Password must contain at least one number."
            };
        }
        
        // Check if password contains at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return {
                valid: false,
                message: "Password must contain at least one special character."
            };
        }
        
        return {
            valid: true
        };
    }
    
    // Function to create and show sell form
    function showSellForm() {
        // Get user profile data to pre-fill phone number if available
        let phoneNumber = '';
        if (currentUser) {
            const userData = users.find(user => user.username === currentUser);
            if (userData && userData.profile && userData.profile.phone) {
                phoneNumber = userData.profile.phone;
            }
        }
        
        sellFormSection.innerHTML = `
            <div class="form-section">
                <h2>Sell Your Item</h2>
                <form id="sell-item-form">
                    <div class="form-group">
                        <label for="item-name">Item Name</label>
                        <input type="text" id="item-name" placeholder="Enter item name" required>
                    </div>
                    <div class="form-group">
                        <label for="item-usage">Usage Duration</label>
                        <div class="usage-input">
                            <input type="number" id="item-usage-duration" min="0" step="0.1" placeholder="Duration" required>
                            <select id="item-usage-unit">
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="item-description">Description</label>
                        <textarea id="item-description" placeholder="Provide details about your item" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="item-images">Upload Images</label>
                        <input type="file" id="item-images" accept="image/*" multiple>
                        <small>You can select multiple images</small>
                    </div>
                    <div class="form-group">
                        <label for="item-price">Price (₹)</label>
                        <input type="number" id="item-price" min="0" placeholder="Enter your asking price" required>
                    </div>
                    <div class="form-group">
                        <label for="seller-phone">Phone Number</label>
                        <input type="tel" id="seller-phone" value="${phoneNumber}" placeholder="Enter your 10-digit phone number" required>
                        <div class="error-message" id="phone-error">Please enter a valid 10-digit phone number</div>
                    </div>
                    <button type="submit" class="form-btn">Add Item</button>
                </form>
            </div>
        `;
        
        // Hide other sections and show sell form
        if (choiceSection) choiceSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'none';
        if (signupSection) signupSection.style.display = 'none';
        sellFormSection.style.display = 'flex';
        
        // Add event listener to form
        const sellItemForm = document.getElementById('sell-item-form');
        sellItemForm.addEventListener('submit', handleSellItemSubmit);
        
        // Add phone number validation
        const phoneInput = document.getElementById('seller-phone');
        phoneInput.addEventListener('input', function() {
            const phoneError = document.getElementById('phone-error');
            if (!/^\d{10}$/.test(this.value)) {
                phoneError.style.display = 'block';
            } else {
                phoneError.style.display = 'none';
            }
        });
    }

    // Function to handle sell item form submission
    function handleSellItemSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const itemName = document.getElementById('item-name').value;
        const itemUsageDuration = document.getElementById('item-usage-duration').value;
        const itemUsageUnit = document.getElementById('item-usage-unit').value;
        const itemDescription = document.getElementById('item-description').value;
        const itemImages = document.getElementById('item-images').files;
        const itemPrice = document.getElementById('item-price').value;
        const sellerPhone = document.getElementById('seller-phone').value;
        
        // Validate phone number
        if (!/^\d{10}$/.test(sellerPhone)) {
            document.getElementById('phone-error').style.display = 'block';
            return;
        }
        
        // Get current user
        const currentUser = sessionStorage.getItem('currentUser');
        
        // Process images
        const imageFiles = document.getElementById('item-images').files;
        let images = [];
        
        if (imageFiles.length > 0) {
            // Set up a counter to track when all images are processed
            let processedImages = 0;
            
            // Process each image file
            for (let i = 0; i < imageFiles.length; i++) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    images.push(e.target.result);
                    processedImages++;
                    
                    // If all images are processed, create and save the item
                    if (processedImages === imageFiles.length) {
                        saveItem();
                    }
                };
                reader.readAsDataURL(imageFiles[i]);
            }
        } else {
            // No images, create and save item immediately
            saveItem();
        }
        
        function saveItem() {
            // Create item object with images
            const newItem = {
                name: itemName,
                usageDuration: itemUsageDuration,
                usageUnit: itemUsageUnit,
                description: itemDescription,
                price: itemPrice,
                seller: currentUser,
                phone: sellerPhone,
                dateAdded: new Date().toISOString(),
                images: images,
                imageCount: images.length
            };
            
            // Get existing items from localStorage or initialize empty array
            let items = [];
            if (localStorage.getItem('items')) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            
            // Add new item
            items.push(newItem);
            
            // Save to localStorage
            localStorage.setItem('items', JSON.stringify(items));
            
            // Update user profile with phone number if it's not already there
            const userData = users.find(user => user.username === currentUser);
            if (userData) {
                if (!userData.profile) {
                    userData.profile = {};
                }
                userData.profile.phone = sellerPhone;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Clear the form
            e.target.reset();
            
            // Ask if user wants to add another item
            if (confirm('Item added successfully! Do you want to add another item?')) {
                // Stay on the form to add another item
                showSellForm();
            } else {
                // Redirect to homepage
                window.location.href = 'index.html';
            }
        }
    }
    
    // Function to handle login form submission
    function handleLoginSubmit(e) {
        e.preventDefault();
        console.log("Login form submitted");
        
        // Get form values
        const email = document.getElementById('login-email').value;
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Reset error messages
        document.getElementById('login-email-error').style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
        
        // Validate email
        if (!email.endsWith('@vitstudent.ac.in')) {
            document.getElementById('login-email-error').style.display = 'block';
            return;
        }
        
        // Find user
        const user = users.find(u => u.email === email && u.username === username && u.password === password);
        
        if (user) {
            // Login successful
            document.getElementById('login-success').style.display = 'block';
            
            // Store logged in user
            sessionStorage.setItem('currentUser', username);
            
            // Reset form
            e.target.reset();
            
            // Check if there's a pending product action
            const pendingProduct = sessionStorage.getItem('pendingCartProduct');
            const pendingAction = sessionStorage.getItem('pendingAction');
            
            if (pendingProduct && pendingAction) {
                // Clear the pending data
                sessionStorage.removeItem('pendingCartProduct');
                sessionStorage.removeItem('pendingAction');
                
                // Parse the product data
                const product = JSON.parse(pendingProduct);
                
                // Show success message briefly
                setTimeout(function() {
                    // Redirect back to the product page
                    window.location.href = `shop.html?productId=${product.dateAdded}`;
                }, 1000);
            } else {
                // Show sell form after 1 second
                setTimeout(function() {
                    showSellForm();
                }, 1000);
            }
        } else {
            // Login failed
            document.getElementById('login-error').style.display = 'block';
        }
    }
    
    // Signup form submission
    if (signupForm = document.getElementById('signup-form')) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Signup form submitted");
            
            // Get form values
            const email = document.getElementById('signup-email').value;
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            // Reset error messages
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('password-error').style.display = 'none';
            
            // Validate email
            if (!email.endsWith('@vitstudent.ac.in')) {
                document.getElementById('email-error').style.display = 'block';
                return;
            }
            
            // Validate password
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                document.getElementById('password-error').textContent = passwordValidation.message;
                document.getElementById('password-error').style.display = 'block';
                return;
            }
            
            // Validate password match
            if (password !== confirmPassword) {
                document.getElementById('password-error').textContent = "Passwords do not match";
                document.getElementById('password-error').style.display = 'block';
                return;
            }
            
            // Check if username already exists
            if (users.some(user => user.username === username)) {
                alert('Username already exists. Please choose a different one.');
                return;
            }
            
            // Create new user
            const newUser = {
                email: email,
                username: username,
                password: password,
                dateJoined: new Date().toISOString(),
                profile: {
                    phone: '',
                    gender: '',
                    hostel: '',
                    room: ''
                }
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            document.getElementById('signup-success').style.display = 'block';
            
            // Reset form
            signupForm.reset();
            
            // Switch to login form after 2 seconds
            setTimeout(function() {
                document.getElementById('signup-success').style.display = 'none';
                signupSection.style.display = 'none';
                showLoginForm();
            }, 2000);
        });
    }
    
    // Add switch to login event listener if the element exists
    if (document.getElementById('switch-to-login')) {
        document.getElementById('switch-to-login').addEventListener('click', function(e) {
            e.preventDefault();
            signupSection.style.display = 'none';
            showLoginForm();
        });
    }
});
