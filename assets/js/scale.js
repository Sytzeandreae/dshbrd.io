document.addEventListener('DOMContentLoaded', function() {
  const ingredientsSection = document.querySelector('.recipe-ingredients');
  if (!ingredientsSection) return;

  const baseServings = parseInt(ingredientsSection.dataset.baseServings, 10);
  let currentServings = baseServings;

  const servingCount = document.querySelector('.serving-count');
  const minusBtn = document.querySelector('.serving-btn.minus');
  const plusBtn = document.querySelector('.serving-btn.plus');
  const ingredients = document.querySelectorAll('.ingredient[data-qty]');

  // Fraction display mapping
  const FRACTIONS = {
    0.125: '1/8',
    0.25: '1/4',
    0.333: '1/3',
    0.375: '3/8',
    0.5: '1/2',
    0.625: '5/8',
    0.666: '2/3',
    0.75: '3/4',
    0.875: '7/8'
  };

  // Nice rounding for cooking quantities
  function niceRound(num) {
    const niceValues = [0.125, 0.25, 0.333, 0.375, 0.5, 0.625, 0.666, 0.75, 0.875, 1];

    const whole = Math.floor(num);
    const decimal = num - whole;

    if (decimal < 0.0625) return whole || num;

    // Find closest nice fraction
    let closest = 0;
    let minDiff = 1;
    for (const nice of niceValues) {
      const diff = Math.abs(decimal - nice);
      if (diff < minDiff) {
        minDiff = diff;
        closest = nice;
      }
    }

    return whole + closest;
  }

  // Format number as fraction string
  function formatQuantity(num) {
    if (num === 0) return '';

    const rounded = niceRound(num);
    const whole = Math.floor(rounded);
    const decimal = rounded - whole;

    // Find matching fraction
    for (const [dec, frac] of Object.entries(FRACTIONS)) {
      if (Math.abs(decimal - parseFloat(dec)) < 0.02) {
        return whole > 0 ? `${whole} ${frac}` : frac;
      }
    }

    // No fraction match
    if (whole === rounded) return whole.toString();
    return rounded.toFixed(2).replace(/\.?0+$/, '');
  }

  // Unit formatting with pluralization
  function formatUnit(unit, qty) {
    const unitNames = {
      tbsp: 'tablespoon',
      tsp: 'teaspoon',
      cup: 'cup',
      oz: 'oz',
      lb: 'lb',
      g: 'g',
      kg: 'kg',
      ml: 'ml',
      L: 'L',
      inch: 'inch',
      clove: 'clove',
      sprig: 'sprig',
      can: 'can',
      piece: 'piece',
      head: 'head',
      bunch: 'bunch'
    };

    const singular = unitNames[unit] || unit;
    const nonPluralUnits = ['oz', 'lb', 'g', 'kg', 'ml', 'L'];

    if (qty > 1 && singular.length > 2 && !nonPluralUnits.includes(unit)) {
      return singular + 's';
    }
    return singular;
  }

  // Scale a quantity
  function scaleQuantity(baseQty, baseServings, newServings) {
    const ratio = newServings / baseServings;
    return baseQty * ratio;
  }

  // Update all ingredient displays
  function updateIngredients() {
    servingCount.textContent = currentServings;

    ingredients.forEach(li => {
      const qtyData = li.dataset.qty;
      const qtySpan = li.querySelector('.quantity');

      if (qtyData.includes(',')) {
        // Range: "10,12" -> scale both values
        const [low, high] = qtyData.split(',').map(Number);
        const scaledLow = scaleQuantity(low, baseServings, currentServings);
        const scaledHigh = scaleQuantity(high, baseServings, currentServings);
        qtySpan.textContent = `${formatQuantity(scaledLow)}-${formatQuantity(scaledHigh)}`;
      } else {
        // Single value
        const baseQty = parseFloat(qtyData);
        const scaled = scaleQuantity(baseQty, baseServings, currentServings);
        qtySpan.textContent = formatQuantity(scaled);
      }

      // Update unit pluralization
      const unitSpan = li.querySelector('.unit');
      if (unitSpan) {
        const unit = li.dataset.unit;
        const scaledQty = qtyData.includes(',')
          ? scaleQuantity(parseFloat(qtyData.split(',')[0]), baseServings, currentServings)
          : scaleQuantity(parseFloat(qtyData), baseServings, currentServings);
        unitSpan.textContent = formatUnit(unit, scaledQty);
      }
    });

    // Update button states
    minusBtn.disabled = currentServings <= 1;
    plusBtn.disabled = currentServings >= 24;
  }

  // Event listeners
  minusBtn.addEventListener('click', () => {
    if (currentServings > 1) {
      currentServings--;
      updateIngredients();
    }
  });

  plusBtn.addEventListener('click', () => {
    if (currentServings < 24) {
      currentServings++;
      updateIngredients();
    }
  });

  // Keyboard support for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('.serving-adjuster')) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        plusBtn.click();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        minusBtn.click();
      }
    }
  });

  // Initialize button states
  updateIngredients();
});
