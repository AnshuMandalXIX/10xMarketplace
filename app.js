// ===== AI TV MARKETPLACE APP =====

// Format number as Indian Rupees
function inr(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

let cart = JSON.parse(localStorage.getItem('aitvCart') || '[]');
let currentCategory = 'all';
let currentSubcat = 'All';
let activePromo = null;
let currentStep = 1;
let selectedPayMethod = 'card';
let filteredCourses = [...COURSES];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCategoryGrid();
  renderFeaturedCourses();
  renderDealsSection();
  renderLearningPaths();
  startCountdown();
  handleSearchEnter();
});

// ===== VIEW MANAGEMENT =====
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById(`view-${viewName}`);
  if (view) view.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'cart') renderCart();
  if (viewName === 'checkout') renderCheckout();
}

// ===== CATEGORY GRID =====
function renderCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" onclick="filterCategory('${cat.id}')">
      <div class="cat-emoji">${cat.emoji}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${cat.count} courses</div>
    </div>
  `).join('');
}

// ===== FEATURED COURSES =====
function renderFeaturedCourses() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = COURSES.filter(c => c.badge === 'Bestseller').slice(0, 4);
  grid.innerHTML = featured.map(c => courseCard(c)).join('');
}

// ===== DEALS =====
function renderDealsSection() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;
  const deals = COURSES.filter(c => c.originalPrice > c.price * 2).slice(0, 4);
  grid.innerHTML = deals.map(c => courseCard(c, true)).join('');
}

// ===== LEARNING PATHS =====
function renderLearningPaths() {
  const grid = document.getElementById('pathsGrid');
  if (!grid) return;
  grid.innerHTML = LEARNING_PATHS.map(p => `
    <div class="path-card" onclick="showPathCourses(${JSON.stringify(p.courses)}, '${p.title}')">
      <div class="path-icon">${p.icon}</div>
      <div class="path-title">${p.title}</div>
      <div class="path-desc">${p.desc}</div>
      <div class="path-steps">📚 ${p.steps}</div>
    </div>
  `).join('');
}

function showPathCourses(courseIds, title) {
  currentCategory = 'all';
  filteredCourses = COURSES.filter(c => courseIds.includes(c.id));
  showView('categories');
  document.getElementById('catViewTitle').textContent = title;
  renderCategoryCoursesGrid();
  document.getElementById('subcategoryTabs').innerHTML = '';
}

// ===== COURSE CARD =====
function courseCard(course, isDeal = false) {
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  const badgeHtml = isDeal
    ? `<span class="course-badge deal">🔥 ${discount}% OFF</span>`
    : course.badge ? `<span class="course-badge ${course.badge === 'New' ? 'new' : ''}">${course.badge}</span>` : '';
  const inCart = cart.some(c => c.id === course.id);
  return `
    <div class="course-card" onclick="showProduct(${course.id})">
      <div class="course-thumb" style="background:${course.bg}">
        ${badgeHtml}
        ${course.emoji}
      </div>
      <div class="course-body">
        <div class="course-category">${CATEGORIES.find(c => c.id === course.category)?.name || ''}</div>
        <div class="course-title">${course.title}</div>
        <div class="course-meta">
          <span class="course-rating">⭐ ${course.rating}</span>
          <span>(${course.reviews.toLocaleString()})</span>
          <span>•</span>
          <span class="level-badge level-${course.level}">${course.level}</span>
        </div>
        <div class="course-instructor">by ${course.instructor}</div>
        <div class="course-footer">
          <div>
            <span class="course-price">${inr(course.price)}</span>
            <span class="course-original-price">${inr(course.originalPrice)}</span>
          </div>
          <button class="add-to-cart-btn ${inCart ? 'added' : ''}"
            onclick="event.stopPropagation(); addToCart(${course.id})"
          >${inCart ? '✓ Added' : '+ Cart'}</button>
        </div>
      </div>
    </div>`;
}

// ===== FILTER BY CATEGORY =====
function filterCategory(catId) {
  currentCategory = catId;
  currentSubcat = 'All';

  if (catId === 'all') {
    filteredCourses = [...COURSES];
    document.getElementById('catViewTitle').textContent = 'All Courses';
  } else if (catId === 'deals') {
    filteredCourses = COURSES.filter(c => c.originalPrice > c.price * 2);
    document.getElementById('catViewTitle').textContent = '🔥 Hot Deals';
  } else {
    filteredCourses = COURSES.filter(c => c.category === catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    document.getElementById('catViewTitle').textContent = `${cat?.emoji} ${cat?.name}`;
  }

  renderSubcategoryTabs();
  renderCategoryCoursesGrid();
  showView('categories');
  updateCatNavActive(catId);
}

function updateCatNavActive(catId) {
  document.querySelectorAll('.cat-nav-item').forEach((btn, i) => {
    btn.classList.remove('active');
    const ids = ['all', 'ai-fundamentals', 'programming', 'creative', 'kids', 'business', 'advanced', 'deals'];
    if (ids[i] === catId) btn.classList.add('active');
  });
}

function renderSubcategoryTabs() {
  const tabs = document.getElementById('subcategoryTabs');
  if (!tabs) return;
  const subcats = SUBCATEGORIES[currentCategory];
  if (!subcats) { tabs.innerHTML = ''; return; }
  tabs.innerHTML = subcats.map(s => `
    <button class="subcat-tab ${s === currentSubcat ? 'active' : ''}" onclick="filterSubcat('${s}')">${s}</button>
  `).join('');
}

function filterSubcat(subcat) {
  currentSubcat = subcat;
  document.querySelectorAll('.subcat-tab').forEach(t => {
    t.classList.toggle('active', t.textContent === subcat);
  });
  if (subcat === 'All') {
    filteredCourses = COURSES.filter(c => currentCategory === 'all' || c.category === currentCategory);
  } else {
    filteredCourses = COURSES.filter(c =>
      (currentCategory === 'all' || c.category === currentCategory) && c.subcategory === subcat
    );
  }
  renderCategoryCoursesGrid();
}

function renderCategoryCoursesGrid() {
  const grid = document.getElementById('categoryCourseGrid');
  const count = document.getElementById('resultsCount');
  if (!grid) return;
  if (filteredCourses.length === 0) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:#7a789a;font-size:18px;">😕 No courses found. Try different filters!</div>';
    if (count) count.textContent = '0 courses found';
    return;
  }
  grid.innerHTML = filteredCourses.map(c => courseCard(c)).join('');
  if (count) count.textContent = `Showing ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`;
}

// ===== SORT =====
function sortCourses() {
  const val = document.getElementById('sortSelect').value;
  let sorted = [...filteredCourses];
  if (val === 'popular') sorted.sort((a, b) => b.reviews - a.reviews);
  if (val === 'newest') sorted.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
  if (val === 'price-low') sorted.sort((a, b) => a.price - b.price);
  if (val === 'price-high') sorted.sort((a, b) => b.price - a.price);
  if (val === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  filteredCourses = sorted;
  renderCategoryCoursesGrid();
}

// ===== FILTERS =====
function applyFilters() {
  let base = currentCategory === 'all' ? [...COURSES] : COURSES.filter(c => c.category === currentCategory);
  if (currentSubcat !== 'All') base = base.filter(c => c.subcategory === currentSubcat);

  const priceChecks = [...document.querySelectorAll('.filter-group input[type="checkbox"]:checked')].map(i => i.value);
  if (priceChecks.length > 0) {
    base = base.filter(c => {
      return priceChecks.some(p => {
        if (p === 'under-10') return c.price < 10;
        if (p === '10-25') return c.price >= 10 && c.price <= 25;
        if (p === '25-50') return c.price > 25 && c.price <= 50;
        if (p === 'over-50') return c.price > 50;
      });
    });
  }

  const levels = [...document.querySelectorAll('.filter-group input[type="checkbox"][value="beginner"],.filter-group input[type="checkbox"][value="intermediate"],.filter-group input[type="checkbox"][value="advanced"]')]
    .filter(i => i.checked).map(i => i.value);
  if (levels.length > 0) base = base.filter(c => levels.includes(c.level));

  const ratingEl = document.querySelector('input[name="rating"]:checked');
  if (ratingEl && ratingEl.value !== 'any') base = base.filter(c => c.rating >= parseFloat(ratingEl.value));

  filteredCourses = base;
  renderCategoryCoursesGrid();
}

function clearFilters() {
  document.querySelectorAll('.filter-group input').forEach(i => {
    if (i.type === 'checkbox') i.checked = false;
    if (i.type === 'radio' && i.value === 'any') i.checked = true;
  });
  filteredCourses = currentCategory === 'all' ? [...COURSES] : COURSES.filter(c => c.category === currentCategory);
  renderCategoryCoursesGrid();
}

// ===== PRODUCT DETAIL =====
function showProduct(id) {
  const course = COURSES.find(c => c.id === id);
  if (!course) return;
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  const inCart = cart.some(c => c.id === course.id);
  const cat = CATEGORIES.find(c => c.id === course.category);

  document.getElementById('productDetail').innerHTML = `
    <button class="back-btn" onclick="history.back()" style="margin-bottom:20px">← Back</button>
    <div class="product-detail-grid">
      <div>
        <div class="product-thumb-large" style="background:${course.bg}">${course.emoji}</div>
        <div class="product-meta">
          <span style="background:${cat?.bg};color:${cat?.color};padding:4px 14px;border-radius:50px;font-size:13px;font-weight:800">${cat?.emoji} ${cat?.name}</span>
          <span class="level-badge level-${course.level}">${course.level}</span>
          <span style="color:#f59e0b;font-weight:800">⭐ ${course.rating} (${course.reviews.toLocaleString()} reviews)</span>
        </div>
        <h1 class="product-title">${course.title}</h1>
        <p class="product-desc">${course.desc}</p>

        <div class="product-includes">
          <h3>📦 What's Included</h3>
          ${course.includes.map(i => `<div class="include-item">${i}</div>`).join('')}
          <div class="include-item">${course.duration} of on-demand video</div>
          <div class="include-item">${course.lessons} lessons</div>
        </div>

        <div class="curriculum">
          <h3>🗂️ Course Curriculum</h3>
          ${course.curriculum.map((lesson, i) => `
            <div class="curriculum-item">
              <div class="lesson-num">${i + 1}</div>
              <div class="lesson-title">${lesson}</div>
              <div class="lesson-duration">${Math.floor(Math.random() * 20 + 10)}min</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="buy-box">
          <div>
            <span class="buy-box-price">${inr(course.price)}</span>
            <span class="buy-box-original">${inr(course.originalPrice)}</span>
          </div>
          <div class="buy-box-savings">🎉 You save ${discount}% — Limited time!</div>
          <button class="btn-primary" onclick="addToCart(${course.id}); showView('cart')">${inCart ? '✓ Go to Cart →' : '🛒 Add to Cart'}</button>
          <button class="btn-secondary" onclick="buyNow(${course.id})">⚡ Buy Now</button>
          <div class="buy-box-guarantee">
            <span>🔐</span><span>30-day money-back guarantee</span>
          </div>
          <div class="buy-box-guarantee">
            <span>♾️</span><span>Lifetime access after purchase</span>
          </div>
          <div class="buy-box-guarantee">
            <span>🏆</span><span>Certificate of completion</span>
          </div>
        </div>
      </div>
    </div>`;

  showView('product');
}

function buyNow(id) {
  addToCart(id);
  showView('checkout');
}

// ===== CART =====
function addToCart(id) {
  const course = COURSES.find(c => c.id === id);
  if (!course) return;
  if (cart.some(c => c.id === id)) {
    showToast(`"${course.title}" is already in your cart!`);
    return;
  }
  cart.push(course);
  saveCart();
  updateCartCount();
  showToast(`🛒 Added "${course.title}" to cart!`);
  // Update any visible card buttons
  document.querySelectorAll(`.add-to-cart-btn`).forEach(btn => {
    const card = btn.closest('.course-card');
    if (card && card.onclick && card.onclick.toString().includes(`showProduct(${id})`)) {
      btn.textContent = '✓ Added';
      btn.classList.add('added');
    }
  });
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function saveCart() { localStorage.setItem('aitvCart', JSON.stringify(cart)); }

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Discover amazing AI courses and start learning today!</p>
        <button class="btn-primary" onclick="showView('home')">Browse Courses</button>
      </div>`;
    updateSummary();
    return;
  }

  container.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-thumb" style="background:${c.bg}">${c.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${c.title}</div>
        <div class="cart-item-cat">by ${c.instructor}</div>
        <div style="font-size:12px;color:#7a789a;margin-top:4px">⭐ ${c.rating} • ${c.duration} • ${c.lessons} lessons</div>
      </div>
      <div class="cart-item-price">${inr(c.price)}</div>
      <button class="remove-btn" onclick="removeFromCart(${c.id})">✕</button>
    </div>`).join('');

  updateSummary();
}

function updateSummary() {
  const subtotal = cart.reduce((sum, c) => sum + c.price, 0);
  const discount = activePromo ? subtotal * activePromo : 0;
  const total = subtotal - discount;

  ['summarySubtotal', 'coSubtotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = inr(subtotal);
  });
  ['summaryDiscount', 'coDiscount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = `-${inr(discount)}`;
  });
  ['summaryTotal', 'coTotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = inr(total);
  });
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msg = document.getElementById('promoMsg');
  if (PROMO_CODES[code]) {
    activePromo = PROMO_CODES[code];
    const pct = Math.round(activePromo * 100);
    msg.style.color = '#22c55e';
    msg.textContent = `✅ Code "${code}" applied! ${pct}% off your order.`;
    updateSummary();
  } else {
    msg.style.color = '#ef4444';
    msg.textContent = `❌ Invalid promo code. Try: AITV20, WELCOME30, KIDS50`;
  }
}

// ===== CHECKOUT =====
function renderCheckout() {
  renderCart();
  updateSummary();

  const itemsEl = document.getElementById('checkoutOrderItems');
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(c => `
      <div class="co-item">
        <div class="co-item-thumb" style="background:${c.bg}">${c.emoji}</div>
        <div class="co-item-info">
          <div class="co-item-name">${c.title}</div>
        </div>
        <div class="co-item-price">${inr(c.price)}</div>
      </div>`).join('');
  }

  goToStep(1);
}

function goToStep(step) {
  if (step === 2 && !validateStep1()) return;
  if (step === 3 && !validateStep2()) return;

  currentStep = step;
  [1, 2, 3].forEach(s => {
    document.getElementById(`checkout-step-${s}`)?.classList.add('hidden');
    const ind = document.getElementById(`step${s}-ind`);
    if (ind) {
      ind.classList.remove('active', 'done');
      if (s < step) ind.classList.add('done');
      if (s === step) ind.classList.add('active');
    }
  });
  document.getElementById(`checkout-step-${step}`)?.classList.remove('hidden');

  if (step === 3) renderOrderReview();
}

function validateStep1() {
  const firstName = document.getElementById('firstName')?.value.trim();
  const lastName = document.getElementById('lastName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  if (!firstName || !lastName || !email) {
    showToast('⚠️ Please fill in all required fields!');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Please enter a valid email address!');
    return false;
  }
  return true;
}

function validateStep2() {
  if (selectedPayMethod === 'card') {
    const num = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry')?.value;
    const cvv = document.getElementById('cardCvv')?.value;
    const name = document.getElementById('cardName')?.value.trim();
    if (!num || num.length < 15 || !expiry || !cvv || !name) {
      showToast('⚠️ Please fill in all card details!');
      return false;
    }
  } else if (selectedPayMethod === 'upi') {
    const upi = document.getElementById('upiId')?.value.trim();
    if (!upi || !upi.includes('@')) {
      showToast('⚠️ Please enter a valid UPI ID!');
      return false;
    }
  }
  return true;
}

function renderOrderReview() {
  const el = document.getElementById('orderReview');
  if (!el) return;
  const subtotal = cart.reduce((sum, c) => sum + c.price, 0);
  const discount = activePromo ? subtotal * activePromo : 0;
  const firstName = document.getElementById('firstName')?.value || '';
  const lastName = document.getElementById('lastName')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const payLabel = selectedPayMethod === 'card' ? `Card ending in ${document.getElementById('cardNumber')?.value.slice(-4) || '****'}` : selectedPayMethod === 'paypal' ? 'PayPal' : 'UPI';

  el.innerHTML = `
    <div class="review-row"><span class="review-label">Name</span><span class="review-value">${firstName} ${lastName}</span></div>
    <div class="review-row"><span class="review-label">Email</span><span class="review-value">${email}</span></div>
    <div class="review-row"><span class="review-label">Courses</span><span class="review-value">${cart.length} course${cart.length !== 1 ? 's' : ''}</span></div>
    <div class="review-row"><span class="review-label">Payment</span><span class="review-value">${payLabel}</span></div>
    <div class="review-row"><span class="review-label">Subtotal</span><span class="review-value">${inr(subtotal)}</span></div>
    ${discount > 0 ? `<div class="review-row"><span class="review-label">Discount</span><span class="review-value" style="color:#22c55e">-${inr(discount)}</span></div>` : ''}
    <div class="review-row" style="font-weight:800;font-size:16px"><span class="review-label">Total Due</span><span class="review-value">${inr(subtotal - discount)}</span></div>
  `;
}

function placeOrder() {
  if (!document.getElementById('termsCheck')?.checked) {
    showToast('⚠️ Please agree to the Terms of Service to continue.');
    return;
  }

  const btn = document.querySelector('#checkout-step-3 .btn-primary');
  if (btn) { btn.textContent = '⏳ Processing...'; btn.disabled = true; }

  setTimeout(() => {
    const orderId = 'AITV-' + Date.now().toString(36).toUpperCase();
    document.getElementById('orderId').textContent = orderId;

    const successCourses = document.getElementById('successCourses');
    if (successCourses) {
      successCourses.innerHTML = cart.map(c => `
        <div class="success-course-item">
          <span style="font-size:28px;background:${c.bg};width:50px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center">${c.emoji}</span>
          <div>
            <div style="font-weight:800;color:#272659">${c.title}</div>
            <div style="font-size:12px;color:#7a789a">Ready to access • Lifetime access</div>
          </div>
        </div>`).join('');
    }

    showView('success');
  }, 2000);
}

function resetOrder() {
  cart = [];
  saveCart();
  updateCartCount();
  activePromo = null;
}

// ===== PAYMENT METHODS =====
function selectPayMethod(btn, method) {
  selectedPayMethod = method;
  document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cardForm').classList.toggle('hidden', method !== 'card');
  document.getElementById('paypalForm').classList.toggle('hidden', method !== 'paypal');
  document.getElementById('upiForm').classList.toggle('hidden', method !== 'upi');
}

// ===== CARD FORMATTING =====
function formatCard(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

// ===== SEARCH =====
function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const catFilter = document.getElementById('searchCatSelect').value;
  if (!query) return;

  let results = COURSES.filter(c => {
    const matchesText = c.title.toLowerCase().includes(query) ||
      c.desc.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query) ||
      c.subcategory.toLowerCase().includes(query);
    const matchesCat = catFilter === 'all' || c.category === catFilter;
    return matchesText && matchesCat;
  });

  document.getElementById('searchResultsTitle').textContent =
    `🔍 "${query}" — ${results.length} result${results.length !== 1 ? 's' : ''}`;
  document.getElementById('searchResultsGrid').innerHTML =
    results.length > 0
      ? results.map(c => courseCard(c)).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#7a789a">
           <div style="font-size:60px">🔍</div>
           <h2 style="color:#272659;margin:16px 0 8px">No results for "${query}"</h2>
           <p>Try a different search term or browse our categories</p>
         </div>`;

  showView('search');
}

function handleSearchEnter() {
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') performSearch();
  });
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== COUNTDOWN TIMER =====
function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let end = localStorage.getItem('aitvDeadline');
  if (!end || Date.now() > parseInt(end)) {
    end = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('aitvDeadline', end);
  }
  setInterval(() => {
    const diff = parseInt(end) - Date.now();
    if (diff <= 0) { el.textContent = 'Deals expired'; return; }
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `⏱️ Ends in ${h}:${m}:${s}`;
  }, 1000);
}

// ===== SCROLL TO SECTION =====
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
