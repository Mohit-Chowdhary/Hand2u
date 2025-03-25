document.addEventListener('DOMContentLoaded', function() {
    // Get all featured listing elements
    const featuredListings = document.querySelectorAll('.pro');
    
    // Add click event listeners to each featured listing
    featuredListings.forEach((listing, index) => {
      listing.style.cursor = 'pointer';
      
      // Determine category based on index or content
      let category;
      const titleElement = listing.querySelector('h5');
      if (titleElement) {
        category = titleElement.textContent.toLowerCase();
      } else {
        // Fallback categories if h5 is not found
        const categories = ['calculators', 'cycles', 'study-materials'];
        category = categories[index];
      }
      
      // Add hover effect
      listing.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 25px 35px rgba(0,0,0,0.05)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      });
      
      listing.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '20px 20px 30px rgba(0,0,0,0.02)';
      });
      
      // Add click event
      listing.addEventListener('click', function() {
        // Store the category in sessionStorage to be used by shop.js
        sessionStorage.setItem('selectedCategory', category);
        // Redirect to shop page
        window.location.href = 'shop.html';
      });
    });
  });