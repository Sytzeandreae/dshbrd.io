document.addEventListener('DOMContentLoaded', function() {
  const cuisineFilter = document.getElementById('cuisine-filter');
  const proteinFilter = document.getElementById('protein-filter');
  const searchInput = document.getElementById('search-input');
  const tagButtons = document.querySelectorAll('.tag-filter');
  const timeButtons = document.querySelectorAll('.time-filter');
  const clearBtn = document.getElementById('clear-filters');
  const cards = document.querySelectorAll('.recipe-card');
  const countEl = document.getElementById('visible-count');

  let activeFilters = {
    cuisine: '',
    protein: '',
    time: '',
    tags: [],
    search: ''
  };

  // Time categories
  function getTimeCategory(minutes) {
    const time = parseInt(minutes, 10);
    if (time < 30) return 'quick';
    if (time <= 60) return 'medium';
    return 'slow';
  }

  function applyFilters() {
    let visibleCount = 0;
    const searchTerm = activeFilters.search.toLowerCase().trim();

    cards.forEach(card => {
      const cardCuisine = card.dataset.cuisine;
      const cardProtein = card.dataset.protein;
      const cardTime = card.dataset.time;
      const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
      const cardTitle = card.dataset.title || '';
      const cardIngredients = card.dataset.ingredients || '';

      let show = true;

      // Check cuisine filter
      if (activeFilters.cuisine && cardCuisine !== activeFilters.cuisine) {
        show = false;
      }

      // Check protein filter
      if (activeFilters.protein && cardProtein !== activeFilters.protein) {
        show = false;
      }

      // Check time filter
      if (activeFilters.time) {
        const cardTimeCategory = getTimeCategory(cardTime);
        if (cardTimeCategory !== activeFilters.time) {
          show = false;
        }
      }

      // Check tag filters (must match ALL selected tags)
      if (activeFilters.tags.length > 0) {
        const hasAllTags = activeFilters.tags.every(tag => cardTags.includes(tag));
        if (!hasAllTags) show = false;
      }

      // Check search filter
      if (searchTerm) {
        const matchesTitle = cardTitle.includes(searchTerm);
        const matchesIngredients = cardIngredients.includes(searchTerm);
        if (!matchesTitle && !matchesIngredients) {
          show = false;
        }
      }

      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });

    if (countEl) {
      countEl.textContent = visibleCount;
    }

    updateActiveStates();
    updateURL();
  }

  function updateActiveStates() {
    // Update tag buttons
    tagButtons.forEach(btn => {
      btn.classList.toggle('active', activeFilters.tags.includes(btn.dataset.tag));
    });

    // Update time buttons
    timeButtons.forEach(btn => {
      btn.classList.toggle('active', activeFilters.time === btn.dataset.time);
    });
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (activeFilters.cuisine) params.set('cuisine', activeFilters.cuisine);
    if (activeFilters.protein) params.set('protein', activeFilters.protein);
    if (activeFilters.time) params.set('time', activeFilters.time);
    if (activeFilters.tags.length > 0) params.set('tags', activeFilters.tags.join(','));
    if (activeFilters.search) params.set('q', activeFilters.search);

    const newURL = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }

  function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('cuisine')) {
      activeFilters.cuisine = params.get('cuisine');
      if (cuisineFilter) cuisineFilter.value = activeFilters.cuisine;
    }

    if (params.get('protein')) {
      activeFilters.protein = params.get('protein');
      if (proteinFilter) proteinFilter.value = activeFilters.protein;
    }

    if (params.get('time')) {
      activeFilters.time = params.get('time');
    }

    if (params.get('tags')) {
      activeFilters.tags = params.get('tags').split(',');
    }

    if (params.get('q')) {
      activeFilters.search = params.get('q');
      if (searchInput) searchInput.value = activeFilters.search;
    }

    // Apply filters if any were loaded from URL
    if (params.toString()) {
      applyFilters();
    }
  }

  // Cuisine dropdown
  if (cuisineFilter) {
    cuisineFilter.addEventListener('change', function() {
      activeFilters.cuisine = this.value;
      applyFilters();
    });
  }

  // Protein dropdown
  if (proteinFilter) {
    proteinFilter.addEventListener('change', function() {
      activeFilters.protein = this.value;
      applyFilters();
    });
  }

  // Search input
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        activeFilters.search = this.value;
        applyFilters();
      }, 200);
    });
  }

  // Tag buttons (toggle)
  tagButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const tag = this.dataset.tag;
      const idx = activeFilters.tags.indexOf(tag);
      if (idx > -1) {
        activeFilters.tags.splice(idx, 1);
      } else {
        activeFilters.tags.push(tag);
      }
      applyFilters();
    });
  });

  // Time buttons (single select)
  timeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const time = this.dataset.time;
      activeFilters.time = activeFilters.time === time ? '' : time;
      applyFilters();
    });
  });

  // Clear all filters
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      activeFilters = { cuisine: '', protein: '', time: '', tags: [], search: '' };
      if (cuisineFilter) cuisineFilter.value = '';
      if (proteinFilter) proteinFilter.value = '';
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  }

  // Load filters from URL on page load
  loadFiltersFromURL();
});
