/**
 * Search Initialization Script
 * 
 * Loads the docfind WASM module and handles search functionality.
 * This script is loaded after the page is ready and implements:
 * - WASM module loading
 * - Search query handling with debouncing
 * - Result rendering
 * - Keyboard navigation support
 */

let searchModule = null;
let isLoading = false;

/**
 * Initialize the docfind WASM module
 */
async function initializeSearch() {
  if (searchModule || isLoading) {
    return searchModule;
  }

  isLoading = true;
  
  try {
    // Import the docfind module
    const module = await import('/docfind.js');
    searchModule = module.default;
    console.log('✓ Docfind search initialized');
    return searchModule;
  } catch (error) {
    console.error('Failed to initialize search:', error);
    return null;
  } finally {
    isLoading = false;
  }
}

/**
 * Perform search query
 */
async function performSearch(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Ensure search module is loaded
  if (!searchModule) {
    await initializeSearch();
  }

  if (!searchModule) {
    console.error('Search module not available');
    return [];
  }

  try {
    // Perform search using docfind
    const results = await searchModule(query.trim());
    return results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Render search results to the DOM
 */
function renderResults(results, query) {
  const resultsContainer = document.getElementById('search-results');
  const emptyState = document.getElementById('search-empty');
  const noResultsState = document.getElementById('search-no-results');
  const noResultsQuery = document.getElementById('search-no-results-query');
  const loadingState = document.getElementById('search-loading');

  if (!resultsContainer) return;

  // Hide loading state
  if (loadingState) loadingState.classList.add('hidden');

  // Clear previous results
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    // Show no results state
    if (emptyState) emptyState.classList.add('hidden');
    if (noResultsState) {
      noResultsState.classList.remove('hidden');
      if (noResultsQuery) noResultsQuery.textContent = query;
    }
    return;
  }

  // Hide empty/no-results states
  if (emptyState) emptyState.classList.add('hidden');
  if (noResultsState) noResultsState.classList.add('hidden');

  // Render top 10 results
  const topResults = results.slice(0, 10);
  
  topResults.forEach((result, index) => {
    const li = document.createElement('li');
    li.className = 'group cursor-pointer px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
    li.setAttribute('role', 'option');
    
    const link = document.createElement('a');
    link.href = result.href;
    link.className = 'block focus:outline-none';
    
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex items-baseline gap-2';
    
    const title = document.createElement('h3');
    title.className = 'flex-1 text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400';
    title.textContent = result.title;
    
    titleDiv.appendChild(title);
    
    // Excerpt (first 150 chars of body)
    const excerpt = document.createElement('p');
    excerpt.className = 'mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2';
    
    // Extract excerpt from body, removing the title and tags if they're at the start
    let bodyText = result.body || '';
    const excerptText = bodyText.substring(0, 200) + (bodyText.length > 200 ? '...' : '');
    excerpt.textContent = excerptText;
    
    // Highlight matching terms (simple implementation)
    const highlighted = highlightMatches(excerptText, query);
    excerpt.innerHTML = highlighted;
    
    link.appendChild(titleDiv);
    link.appendChild(excerpt);
    li.appendChild(link);
    resultsContainer.appendChild(li);
  });
}

/**
 * Highlight matching terms in text
 */
function highlightMatches(text, query) {
  if (!query) return text;
  
  // Split query into words
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  // Escape special regex characters
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex pattern for all query words
  const pattern = words.map(escapeRegex).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  // Replace matches with highlighted spans
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-gray-100">$1</mark>');
}

/**
 * Debounce function to limit search frequency
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Handle search input
 */
const handleSearch = debounce(async (query) => {
  const loadingState = document.getElementById('search-loading');
  const emptyState = document.getElementById('search-empty');
  
  if (!query || query.trim().length === 0) {
    // Show empty state
    if (emptyState) emptyState.classList.remove('hidden');
    if (loadingState) loadingState.classList.add('hidden');
    
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) resultsContainer.innerHTML = '';
    
    return;
  }

  // Show loading state
  if (loadingState) loadingState.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  // Perform search
  const results = await performSearch(query);
  
  // Render results
  renderResults(results, query);
}, 300); // 300ms debounce

/**
 * Setup search input listener
 */
function setupSearchInput() {
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }
}

/**
 * Preload search module when user hovers over search button
 */
function setupPreloading() {
  const searchButton = document.getElementById('search-button');
  
  if (searchButton) {
    searchButton.addEventListener('mouseenter', () => {
      if (!searchModule && !isLoading) {
        initializeSearch();
      }
    }, { once: true });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupSearchInput();
    setupPreloading();
  });
} else {
  setupSearchInput();
  setupPreloading();
}

console.log('Search script loaded');
