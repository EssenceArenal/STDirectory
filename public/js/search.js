// Santa Teresa Directory - Search Functionality

// Advanced search features
class SearchManager {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
        this.searchSuggestions = [];
        this.initializeSearch();
    }
    
    initializeSearch() {
        // Initialize search suggestions
        this.loadSearchSuggestions();
        
        // Set up search input with autocomplete
        this.setupSearchAutocomplete();
        
        // Set up search filters
        this.setupSearchFilters();
    }
    
    async loadSearchSuggestions() {
        try {
            // Get all businesses and categories for suggestions
            const [businessesRes, categoriesRes] = await Promise.all([
                fetch('/api/businesses'),
                fetch('/api/categories')
            ]);
            
            const businesses = await businessesRes.json();
            const categories = await categoriesRes.json();
            
            // Create suggestion list
            this.searchSuggestions = [
                ...categories.map(cat => ({ type: 'category', value: cat.name, icon: cat.icon })),
                ...businesses.map(biz => ({ type: 'business', value: biz.name, category: biz.category }))
            ];
            
        } catch (error) {
            console.error('Error loading search suggestions:', error);
        }
    }
    
    setupSearchAutocomplete() {
        const searchInputs = document.querySelectorAll('#hero-search, #business-search');
        
        searchInputs.forEach(input => {
            this.addAutocomplete(input);
        });
    }
    
    addAutocomplete(input) {
        let suggestionsList = null;
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }
            
            const suggestions = this.getSuggestions(query);
            this.showSuggestions(input, suggestions);
        });
        
        input.addEventListener('keydown', (e) => {
            if (suggestionsList && suggestionsList.style.display !== 'none') {
                this.handleKeyNavigation(e, suggestionsList);
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    getSuggestions(query) {
        return this.searchSuggestions
            .filter(item => item.value.toLowerCase().includes(query))
            .slice(0, 8);
    }
    
    showSuggestions(input, suggestions) {
        this.hideSuggestions();
        
        if (suggestions.length === 0) return;
        
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1';
        suggestionsList.id = 'search-suggestions';
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center';
            
            const icon = suggestion.type === 'category' 
                ? suggestion.icon || '📍'
                : '🏢';
            
            const category = suggestion.type === 'business' 
                ? `<span class="text-xs text-gray-500 ml-2">${suggestion.category}</span>`
                : '';
            
            item.innerHTML = `
                <span class="text-lg mr-3">${icon}</span>
                <div>
                    <span class="text-gray-900">${this.highlightMatch(suggestion.value, input.value)}</span>
                    ${category}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(input, suggestion);
            });
            
            suggestionsList.appendChild(item);
        });
        
        // Position relative to input
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(suggestionsList);
    }
    
    hideSuggestions() {
        const existing = document.getElementById('search-suggestions');
        if (existing) {
            existing.remove();
        }
    }
    
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong class="text-ocean-blue">$1</strong>');
    }
    
    selectSuggestion(input, suggestion) {
        input.value = suggestion.value;
        this.hideSuggestions();
        
        // Add to search history
        this.addToSearchHistory(suggestion.value);
        
        // Trigger search
        if (suggestion.type === 'category') {
            this.searchByCategory(suggestion.value);
        } else {
            this.searchByTerm(suggestion.value);
        }
    }
    
    handleKeyNavigation(e, suggestionsList) {
        const items = suggestionsList.querySelectorAll('div');
        let currentIndex = -1;
        
        // Find currently selected item
        items.forEach((item, index) => {
            if (item.classList.contains('bg-gray-100')) {
                currentIndex = index;
            }
        });
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentIndex >= 0) {
                items[currentIndex].click();
            }
            return;
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
            return;
        }
        
        // Update selection
        items.forEach((item, index) => {
            item.classList.toggle('bg-gray-100', index === currentIndex);
        });
    }
    
    searchByCategory(category) {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
            currentFilter = category;
        }
        
        this.scrollToBusinesses();
        this.executeSearch();
    }
    
    searchByTerm(term) {
        const businessSearch = document.getElementById('business-search');
        if (businessSearch) {
            businessSearch.value = term;
            currentSearch = term;
        }
        
        this.scrollToBusinesses();
        this.executeSearch();
    }
    
    executeSearch() {
        if (typeof filterBusinesses === 'function') {
            filterBusinesses(currentFilter, currentSearch);
        } else if (window.SantaTeresaDirectory) {
            window.SantaTeresaDirectory.filterBusinesses(currentFilter, currentSearch);
        }
    }
    
    scrollToBusinesses() {
        const businessesSection = document.getElementById('businesses');
        if (businessesSection) {
            businessesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    setupSearchFilters() {
        // Advanced filter toggles
        this.setupLocationFilter();
        this.setupFeaturedFilter();
        this.setupSortOptions();
    }
    
    setupLocationFilter() {
        // Future enhancement: filter by specific areas in Santa Teresa
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filterByLocation(e.target.value);
            });
        }
    }
    
    setupFeaturedFilter() {
        const featuredToggle = document.getElementById('featured-toggle');
        if (featuredToggle) {
            featuredToggle.addEventListener('change', (e) => {
                this.filterByFeatured(e.target.checked);
            });
        }
    }
    
    setupSortOptions() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortResults(e.target.value);
            });
        }
    }
    
    filterByLocation(location) {
        // Implementation for location-based filtering
        console.log('Filtering by location:', location);
    }
    
    filterByFeatured(showFeaturedOnly) {
        // Implementation for featured-only filtering
        console.log('Show featured only:', showFeaturedOnly);
    }
    
    sortResults(sortBy) {
        // Implementation for sorting results
        console.log('Sorting by:', sortBy);
        // Options: name, category, featured, newest
    }
    
    // Search history management
    loadSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('santateresa_search_history') || '[]');
        } catch (error) {
            return [];
        }
    }
    
    addToSearchHistory(term) {
        if (!term || term.length < 2) return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => 
            item.toLowerCase() !== term.toLowerCase()
        );
        
        // Add to beginning
        this.searchHistory.unshift(term);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        try {
            localStorage.setItem('santateresa_search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }
    
    getSearchHistory() {
        return this.searchHistory;
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        try {
            localStorage.removeItem('santateresa_search_history');
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    }
}

// Quick search functionality
class QuickSearch {
    constructor() {
        this.setupQuickSearchButtons();
    }
    
    setupQuickSearchButtons() {
        // Add quick search buttons for popular categories
        this.addQuickSearchBar();
    }
    
    addQuickSearchBar() {
        const container = document.getElementById('quick-search-container');
        if (!container) return;
        
        const popularSearches = [
            { term: 'Restaurants', icon: '🍽️' },
            { term: 'Surf Shops', icon: '🏄' },
            { term: 'Hotels', icon: '🏨' },
            { term: 'Tours', icon: '🌴' },
            { term: 'Beach Bars', icon: '🍹' }
        ];
        
        popularSearches.forEach(search => {
            const button = document.createElement('button');
            button.className = 'inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors';
            button.innerHTML = `<span class="mr-2">${search.icon}</span>${search.term}`;
            
            button.addEventListener('click', () => {
                this.quickSearch(search.term);
            });
            
            container.appendChild(button);
        });
    }
    
    quickSearch(term) {
        // Set the search term and execute search
        const searchInput = document.getElementById('business-search');
        if (searchInput) {
            searchInput.value = term;
        }
        
        // Scroll to results
        const businessesSection = document.getElementById('businesses');
        if (businessesSection) {
            businessesSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Execute search
        if (window.SantaTeresaDirectory) {
            window.SantaTeresaDirectory.filterBusinesses('all', term);
        }
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on pages that have search functionality
    if (document.getElementById('hero-search') || document.getElementById('business-search')) {
        window.searchManager = new SearchManager();
        window.quickSearch = new QuickSearch();
    }
});

// Export for use in other scripts
window.SearchManager = SearchManager;
window.QuickSearch = QuickSearch;