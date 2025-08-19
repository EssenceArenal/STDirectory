// Santa Teresa Directory - Main JavaScript

// Global variables
let allBusinesses = [];
let allCategories = [];
let currentFilter = 'all';
let currentSearch = '';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    try {
        // Load data
        await Promise.all([
            loadCategories(),
            loadBusinesses()
        ]);
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Load featured businesses on homepage
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            loadFeaturedBusinesses();
        }
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load application data');
    }
}

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Hero search
    const heroSearch = document.getElementById('hero-search');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    
    if (heroSearch && heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function() {
            const searchTerm = heroSearch.value.trim();
            if (searchTerm) {
                scrollToBusinesses();
                filterBusinesses('all', searchTerm);
            }
        });
        
        heroSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                heroSearchBtn.click();
            }
        });
    }
    
    // Business search and filter
    const businessSearch = document.getElementById('business-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (businessSearch) {
        businessSearch.addEventListener('input', debounce(function() {
            currentSearch = this.value.trim();
            filterBusinesses(currentFilter, currentSearch);
        }, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilter = this.value;
            filterBusinesses(currentFilter, currentSearch);
        });
    }
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories/with-counts');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        allCategories = await response.json();
        populateCategoryFilter();
        displayCategories();
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load businesses from API
async function loadBusinesses() {
    try {
        showLoading();
        const response = await fetch('/api/businesses');
        if (!response.ok) throw new Error('Failed to fetch businesses');
        
        allBusinesses = await response.json();
        displayBusinesses(allBusinesses);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading businesses:', error);
        hideLoading();
        showError('Failed to load businesses');
    }
}

// Load featured businesses
async function loadFeaturedBusinesses() {
    try {
        const response = await fetch('/api/businesses?featured=true');
        if (!response.ok) throw new Error('Failed to fetch featured businesses');
        
        const featuredBusinesses = await response.json();
        displayFeaturedBusinesses(featuredBusinesses);
        
    } catch (error) {
        console.error('Error loading featured businesses:', error);
    }
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    // Clear existing options (except "All Categories")
    const allOption = categoryFilter.querySelector('option[value="all"]');
    categoryFilter.innerHTML = '';
    if (allOption) categoryFilter.appendChild(allOption);
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = `${category.name} (${category.business_count})`;
        categoryFilter.appendChild(option);
    });
}

// Display categories grid
function displayCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    allCategories.forEach(category => {
        if (category.business_count > 0) {
            const categoryCard = createCategoryCard(category);
            categoriesGrid.appendChild(categoryCard);
        }
    });
}

// Create category card element
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all cursor-pointer';
    
    card.innerHTML = `
        <div class="text-4xl mb-3">${category.icon || '📍'}</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">${category.name}</h3>
        <p class="text-sm text-gray-600">${category.business_count} businesses</p>
    `;
    
    card.addEventListener('click', function() {
        scrollToBusinesses();
        document.getElementById('category-filter').value = category.name;
        currentFilter = category.name;
        filterBusinesses(currentFilter, currentSearch);
    });
    
    return card;
}

// Display featured businesses
function displayFeaturedBusinesses(businesses) {
    const container = document.getElementById('featured-businesses');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (businesses.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600 col-span-full">No featured businesses available.</p>';
        return;
    }
    
    businesses.slice(0, 6).forEach(business => {
        const businessCard = createBusinessCard(business, true);
        container.appendChild(businessCard);
    });
}

// Display businesses
function displayBusinesses(businesses) {
    const container = document.getElementById('business-results');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (businesses.length === 0) {
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    
    if (noResults) noResults.classList.add('hidden');
    
    businesses.forEach(business => {
        const businessCard = createBusinessCard(business);
        businessCard.classList.add('fade-in-up');
        container.appendChild(businessCard);
    });
}

// Create business card element
function createBusinessCard(business, isFeatured = false) {
    const card = document.createElement('div');
    card.className = 'business-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer';
    
    const imageUrl = business.image_url || '';
    const imageHtml = imageUrl 
        ? `<img src="${imageUrl}" alt="${business.name}" class="w-full h-48 object-cover">`
        : `<div class="w-full h-48 image-placeholder">
             <span class="text-2xl">${getCategoryIcon(business.category)}</span>
           </div>`;
    
    card.innerHTML = `
        ${imageHtml}
        <div class="p-6">
            <div class="flex items-center justify-between mb-2">
                <span class="inline-block bg-ocean-blue text-white text-xs px-2 py-1 rounded-full">
                    ${business.category}
                </span>
                ${business.featured ? '<span class="featured-badge text-white text-xs px-2 py-1 rounded-full">⭐ Featured</span>' : ''}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">${business.name}</h3>
            <p class="text-gray-600 mb-4 line-clamp-3">${business.description || 'No description available.'}</p>
            <div class="space-y-2">
                ${business.address ? `
                    <div class="flex items-center text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        ${business.address}
                    </div>
                ` : ''}
                ${business.phone ? `
                    <div class="flex items-center text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <a href="tel:${business.phone}" class="hover:text-ocean-blue">${business.phone}</a>
                    </div>
                ` : ''}
                ${business.hours ? `
                    <div class="flex items-center text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        ${business.hours}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    card.addEventListener('click', function() {
        window.location.href = `/business/${business.id}`;
    });
    
    return card;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'Restaurants': '🍽️',
        'Hotels & Lodging': '🏨',
        'Surf Shops': '🏄',
        'Tours & Activities': '🌴',
        'Beach Bars': '🍹',
        'Cafes': '☕',
        'Transportation': '🚗',
        'Health & Wellness': '💆',
        'Shopping': '🛍️',
        'Services': '🔧'
    };
    return icons[category] || '📍';
}

// Filter businesses
function filterBusinesses(category, search) {
    let filtered = [...allBusinesses];
    
    // Filter by category
    if (category && category !== 'all') {
        filtered = filtered.filter(business => business.category === category);
    }
    
    // Filter by search term
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(business => 
            business.name.toLowerCase().includes(searchLower) ||
            business.description?.toLowerCase().includes(searchLower) ||
            business.category.toLowerCase().includes(searchLower)
        );
    }
    
    displayBusinesses(filtered);
}

// Utility functions
function scrollToBusinesses() {
    const businessesSection = document.getElementById('businesses');
    if (businessesSection) {
        businessesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('hidden');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
}

function showError(message) {
    // Create or update error message
    let errorDiv = document.getElementById('global-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'global-error';
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
window.SantaTeresaDirectory = {
    loadBusinesses,
    loadCategories,
    filterBusinesses,
    showError,
    hideLoading,
    showLoading
};