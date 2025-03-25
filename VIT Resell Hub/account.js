document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Get elements
    const authContainer = document.getElementById('auth-container');
    const accountDetails = document.getElementById('account-details');
    
    // Get auth tabs
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    
    // If not logged in, show auth forms
    if (!currentUser) {
        authContainer.style.display = 'block';
        accountDetails.style.display = 'none';
        
        // Tab switching
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginFormContainer.style.display = 'block';
            signupFormContainer.style.display = 'none';
        });
        
        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupFormContainer.style.display = 'block';
            loginFormContainer.style.display = 'none';
        });
        
        // Handle login form submission
        const loginForm = document.getElementById('account-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
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
                
                // Get users from localStorage
                let users = [];
                if (localStorage.getItem('users')) {
                    users = JSON.parse(localStorage.getItem('users'));
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
                    
                    // Reload the page after 1 second to show user details
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    // Login failed
                    document.getElementById('login-error').style.display = 'block';
                }
            });
        }
        
        // Handle signup form submission
        const signupForm = document.getElementById('account-signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('signup-email').value;
                const username = document.getElementById('signup-username').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm').value;
                
                // Reset error messages
                document.getElementById('signup-email-error').style.display = 'none';
                document.getElementById('password-error').style.display = 'none';
                
                // Validate email
                if (!email.endsWith('@vitstudent.ac.in')) {
                    document.getElementById('signup-email-error').style.display = 'block';
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
                
                // Get users from localStorage
                let users = [];
                if (localStorage.getItem('users')) {
                    users = JSON.parse(localStorage.getItem('users'));
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
                e.target.reset();
                
                // Switch to login tab after 2 seconds
                setTimeout(function() {
                    document.getElementById('signup-success').style.display = 'none';
                    loginTab.click();
                }, 2000);
            });
        }
        
        return;
    }
    
    // User is logged in, show account details
    authContainer.style.display = 'none';
    accountDetails.style.display = 'block';
    
    // Get user data from localStorage
    let users = [];
    if (localStorage.getItem('users')) {
        users = JSON.parse(localStorage.getItem('users'));
    }
    
    // Find current user data
    const userData = users.find(user => user.username === currentUser);
    
    if (!userData) {
        alert('User data not found. Please log in again.');
        sessionStorage.removeItem('currentUser');
        window.location.reload();
        return;
    }
    
    // Initialize user profile data if not exists
    if (!userData.profile) {
        userData.profile = {
            phone: '',
            gender: '',
            hostel: '',
            room: ''
        };
    }
    
    // Check if user has phone number from selling items
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const userItems = items.filter(item => item.seller === currentUser);
    
    // If user has sold items with phone number but profile doesn't have it yet
    if (userItems.length > 0 && userItems.some(item => item.phone) && !userData.profile.phone) {
        // Get the most recent phone number used
        const latestItem = userItems
            .filter(item => item.phone)
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))[0];
            
        if (latestItem && latestItem.phone) {
            userData.profile.phone = latestItem.phone;
            // Save updated user data
            saveUserData(users);
        }
    }
    
    // Display user data
    displayUserData(userData);
    
    // Display user listings
    displayUserListings(userData.username);
    
    // Get edit buttons
    const editAccountBtn = document.getElementById('edit-account-btn');
    const editHostelBtn = document.getElementById('edit-hostel-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const cancelHostelBtn = document.getElementById('cancel-hostel-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Get forms
    const accountEditForm = document.getElementById('account-edit-form');
    const hostelEditForm = document.getElementById('hostel-edit-form');
    
    // Add event listeners
    editAccountBtn.addEventListener('click', function() {
        // Show edit form, hide view
        document.getElementById('account-view').style.display = 'none';
        document.getElementById('account-edit').style.display = 'block';
        
        // Fill form with current data
        document.getElementById('edit-username').value = userData.username;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-phone').value = userData.profile.phone || '';
        document.getElementById('edit-gender').value = userData.profile.gender || '';
    });
    
    editHostelBtn.addEventListener('click', function() {
        // Show edit form, hide view
        document.getElementById('hostel-view').style.display = 'none';
        document.getElementById('hostel-edit').style.display = 'block';
        
        // Fill form with current data
        document.getElementById('edit-hostel').value = userData.profile.hostel || '';
        document.getElementById('edit-room').value = userData.profile.room || '';
    });
    
    cancelEditBtn.addEventListener('click', function() {
        // Hide edit form, show view
        document.getElementById('account-edit').style.display = 'none';
        document.getElementById('account-view').style.display = 'block';
    });
    
    cancelHostelBtn.addEventListener('click', function() {
        // Hide edit form, show view
        document.getElementById('hostel-edit').style.display = 'none';
        document.getElementById('hostel-view').style.display = 'block';
    });
    
    // Handle account edit form submission
    accountEditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const phone = document.getElementById('edit-phone').value;
        const gender = document.getElementById('edit-gender').value;
        
        // Validate phone number if provided
        if (phone && !/^\d{10}$/.test(phone)) {
            document.getElementById('phone-error').style.display = 'block';
            return;
        } else {
            document.getElementById('phone-error').style.display = 'none';
        }
        
        // Update user data
        userData.profile.phone = phone;
        userData.profile.gender = gender;
        
        // Save updated user data
        saveUserData(users);
        
        // Update display
        displayUserData(userData);
        
        // Hide edit form, show view
        document.getElementById('account-edit').style.display = 'none';
        document.getElementById('account-view').style.display = 'block';
        
        // Show success message
        alert('Account information updated successfully!');
        
        // If phone number was updated, update it in all user's items
        if (phone) {
            updateItemsWithPhone(userData.username, phone);
        }
    });
    
    // Handle hostel edit form submission
    hostelEditForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const hostel = document.getElementById('edit-hostel').value;
        const room = document.getElementById('edit-room').value;
        
        // Update user data
        userData.profile.hostel = hostel;
        userData.profile.room = room;
        
        // Save updated user data
        saveUserData(users);
        
        // Update display
        displayUserData(userData);
        
        // Hide edit form, show view
        document.getElementById('hostel-edit').style.display = 'none';
        document.getElementById('hostel-view').style.display = 'block';
        
        // Show success message
        alert('Hostel information updated successfully!');
    });
    
    // Handle logout
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            // Clear session storage
            sessionStorage.removeItem('currentUser');
            
            // Reload the page to show login form
            window.location.reload();
        }
    });
    
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
    
    // Function to save user data to localStorage
    function saveUserData(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Function to display user data
    function displayUserData(user) {
        // Display account information
        document.getElementById('username-value').textContent = user.username;
        document.getElementById('email-value').textContent = user.email;
        
        // Display profile information if available
        if (user.profile) {
            // Phone number
            if (user.profile.phone) {
                document.getElementById('phone-value').textContent = user.profile.phone;
            } else {
                document.getElementById('phone-value').textContent = 'Not provided';
            }
            
            // Gender
            if (user.profile.gender) {
                document.getElementById('gender-value').textContent = user.profile.gender;
            } else {
                document.getElementById('gender-value').textContent = 'Not provided';
            }
            
            // Hostel
            if (user.profile.hostel) {
                document.getElementById('hostel-value').textContent = user.profile.hostel;
            } else {
                document.getElementById('hostel-value').textContent = 'Not provided';
            }
            
            // Room
            if (user.profile.room) {
                document.getElementById('room-value').textContent = user.profile.room;
            } else {
                document.getElementById('room-value').textContent = 'Not provided';
            }
        }
    }
    
    // Function to display user listings
    function displayUserListings(username) {
        const listingsContainer = document.getElementById('user-listings');
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const userItems = items.filter(item => item.seller === username);
        
        if (userItems.length === 0) {
            listingsContainer.innerHTML = '<p class="no-listings">You haven\'t listed any items for sale yet.</p>';
            return;
        }
        
        listingsContainer.innerHTML = '';
        
        userItems.forEach(item => {
            const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(item.price);
            
            const listingCard = document.createElement('div');
            listingCard.className = 'listing-card';
            listingCard.innerHTML = `
                <div class="listing-image">
                    <div class="placeholder-icon"><i class="fa-solid fa-image"></i></div>
                </div>
                <div class="listing-details">
                    <h4>${item.name}</h4>
                    <p class="listing-price">${formattedPrice}</p>
                    <p class="listing-date">Listed on: ${new Date(item.dateAdded).toLocaleDateString()}</p>
                </div>
            `;
            
            listingsContainer.appendChild(listingCard);
        });
    }
    
    // Function to update items with the user's phone number if it changes
    function updateItemsWithPhone(username, phone) {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        let updated = false;
        
        items.forEach(item => {
            if (item.seller === username && (!item.phone || item.phone !== phone)) {
                item.phone = phone;
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
    // In the login form submission handler, after successful login:
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
            // We'll use the dateAdded as a unique identifier
            window.location.href = `shop.html?productId=${product.dateAdded}`;
        }, 1000);
    } else {
        // No pending action, just reload the page to show user details
        setTimeout(function() {
            window.location.reload();
        }, 1000);
    }
} else {
    // Login failed
    document.getElementById('login-error').style.display = 'block';
}

});
