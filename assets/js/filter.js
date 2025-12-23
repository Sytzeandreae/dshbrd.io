document.addEventListener('DOMContentLoaded', function() {
  const cuisineFilter = document.getElementById('cuisine-filter');
  const tagButtons = document.querySelectorAll('.tag-filter');
  const clearBtn = document.getElementById('clear-filters');
  const cards = document.querySelectorAll('.recipe-card');
  const countEl = document.getElementById('visible-count');

  let activeFilters = {
    cuisine: '',
    tags: []
  };

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCuisine = card.dataset.cuisine;
      const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];

      let show = true;

      // Check cuisine filter
      if (activeFilters.cuisine && cardCuisine !== activeFilters.cuisine) {
        show = false;
      }

      // Check tag filters (must match ALL selected tags)
      if (activeFilters.tags.length > 0) {
        const hasAllTags = activeFilters.tags.every(tag => cardTags.includes(tag));
        if (!hasAllTags) show = false;
      }

      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });

    if (countEl) {
      countEl.textContent = visibleCount;
    }

    updateActiveStates();
  }

  function updateActiveStates() {
    tagButtons.forEach(btn => {
      btn.classList.toggle('active', activeFilters.tags.includes(btn.dataset.tag));
    });
  }

  // Cuisine dropdown
  if (cuisineFilter) {
    cuisineFilter.addEventListener('change', function() {
      activeFilters.cuisine = this.value;
      applyFilters();
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

  // Clear all filters
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      activeFilters = { cuisine: '', tags: [] };
      if (cuisineFilter) cuisineFilter.value = '';
      applyFilters();
    });
  }
});
