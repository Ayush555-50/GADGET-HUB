// GLOBAL CART SYSTEM STATE
let cartData = [];

const cards = document.querySelectorAll('.product-card');
const catItems = document.querySelectorAll('.category-item');
const cartBadge = document.getElementById('cartBadge');
const cartOverlay = document.getElementById('cartOverlay');
const cartTrigger = document.getElementById('cartTrigger');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalBill = document.getElementById('cartTotalBill');

// OPEN & CLOSE DRAWER ENGINE
cartTrigger.addEventListener('click', () => cartOverlay.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
cartOverlay.addEventListener('click', (e) => { if(e.target === cartOverlay) cartOverlay.classList.remove('active'); });

// ADD TO CART PROCESSOR
cards.forEach(card => {
    const addBtn = card.querySelector('.btn-cart');
    addBtn.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const title = card.getAttribute('data-title');
        const price = parseInt(card.getAttribute('data-price'));
        const img = card.getAttribute('data-img');

        addToCartData(id, title, price, img);

        // Quick visual feedback on button
        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
        addBtn.style.background = '#10b981';
        setTimeout(() => {
            addBtn.innerHTML = originalText;
            addBtn.style.background = '#4f46e5';
        }, 800);
    });
});

function addToCartData(id, title, price, img) {
    const existingItem = cartData.find(item => item.id === id);
    if(existingItem) {
        existingItem.qty += 1;
    } else {
        cartData.push({ id, title, price, img, qty: 1 });
    }
    renderCartUI();
}

// RENDER LIVE INTERACTIVE SYSTEM PRODUCTS
function renderCartUI() {
    let totalItemsCount = cartData.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.innerText = totalItemsCount;

    if(cartData.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Your cart workspace is currently empty.</p>
            </div>`;
        cartTotalBill.innerText = "₹0";
        return;
    }

    cartItemsContainer.innerHTML = "";
    let grandTotal = 0;

    cartData.forEach(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        const itemHTML = `
            <div class="cart-item-card">
                <div class="cart-item-img"><img src="${item.img}" alt="${item.title}"></div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>₹${item.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="cart-qty-control">
                    <button onclick="changeQty('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="btn-delete-item" onclick="removeItemFromCart('${item.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    cartTotalBill.innerText = "₹" + grandTotal.toLocaleString('en-IN');
}

window.changeQty = function(id, delta) {
    const targetItem = cartData.find(item => item.id === id);
    if(targetItem) {
        targetItem.qty += delta;
        if(targetItem.qty <= 0) {
            cartData = cartData.filter(item => item.id !== id);
        }
        renderCartUI();
    }
}

window.removeItemFromCart = function(id) {
    cartData = cartData.filter(item => item.id !== id);
    renderCartUI();
}

// PROCEED TO CHECKOUT ROUTER
window.processCheckout = function() {
    if(cartData.length === 0) {
        alert("Your cart workspace is empty. Add items first!");
        return;
    }
    alert(`Order Initialized Successfully!\nProcessing Secure Gateway Payment for ${cartTotalBill.innerText}.\nThank you for shopping on Gadgets Hub!`);
    cartData = [];
    renderCartUI();
    cartOverlay.classList.remove('active');
}

// SIDEBAR FILTER
catItems.forEach(cat => {
    cat.addEventListener('click', () => {
        document.querySelector('.category-item.active').classList.remove('active');
        cat.classList.add('active');
        
        const selectedCategory = cat.getAttribute('data-cat');
        filterProducts(selectedCategory);
        
        document.getElementById('productsSection').scrollIntoView({behavior: 'smooth'});
    });
});

function filterProducts(category) {
    cards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        if (category === 'all' || cardType === category) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

window.filterFromBanner = function(categoryType) {
    catItems.forEach(item => {
        if(item.getAttribute('data-cat') === categoryType) {
            document.querySelector('.category-item.active').classList.remove('active');
            item.classList.add('active');
        }
    });
    filterProducts(categoryType);
    document.getElementById('productsSection').scrollIntoView({behavior: 'smooth'});
}

window.resetFilters = function() {
    document.querySelector('.category-item.active').classList.remove('active');
    document.querySelector('[data-cat="all"]').classList.add('active');
    filterProducts('all');
}

// NAV LINK CONTROL
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');

        const targetId = item.getAttribute('data-target');
        if (targetId === 'homeSection') {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            document.getElementById(targetId).scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });
});

// SEARCH CONTROL
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase() || '';
        if(title.includes(value)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

// LOGIN MODALS SYSTEM
const overlay = document.getElementById('authModalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const nameField = document.getElementById('nameField');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalSubmitBtn = document.getElementById('modalSubmitBtn');

loginBtn.addEventListener('click', () => {
    modalTitle.innerText = "Welcome Back";
    modalDesc.innerText = "Log in to check out your hardware carts.";
    nameField.style.display = "none";
    modalSubmitBtn.innerText = "Sign In";
    overlay.classList.add('active');
});

signupBtn.addEventListener('click', () => {
    modalTitle.innerText = "Create Profile";
    modalDesc.innerText = "Sign up to track upcoming drops and coupon codes.";
    nameField.style.display = "block";
    modalSubmitBtn.innerText = "Register";
    overlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.classList.remove('active'); });