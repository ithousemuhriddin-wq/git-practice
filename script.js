const menuData = [
    {
        id: 1,
        name: "Chizburger XL",
        category: "burgers",
        price: 35000,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Yumshoq bulochka, shirador mol go'shti kotleti, erigan cheddar pishlog'i, yangi sabzavotlar va FastBite sousidan tayyorlangan klassik, to'yimli burger."
    },
    {
        id: 2,
        name: "Double burger",
        category: "burgers",
        price: 48000,
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=815&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Yumshoq bulochka, ikki qavat sersuv mol go'shti kotleti, ikki baravar erigan cheddar pishlog'i, yangi sabzavotlar va FastBite sousidan tayyorlangan o'ta to'yimli va ulkan burger."
    },
    {
        id: 3,
        name: "Kartoshka Fri",
        category: "sides",
        price: 18000,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Tashqarisi oltin rangli va qarsillama, ichi esa yumshoq hamda issiq holatda tortiladigan klassik kartoshka."
    },
    {
        id: 4,
        name: "Hot dog",
        category: "hotdogs",
        price: 10000,
        image: "https://food.fnr.sndimg.com/content/dam/images/food/plus/fullset/2020/06/08/0/FNM_070120-Grilled-Hot-Dogs_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1591625198177.webp",
        desc: "Mazzali hot-dog"
    },
    {
        id: 5,
        name: "Coca-Cola",
        category: "drinks",
        price: 11000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS3YL0wsO1pXOqozK_HJeu58InPVRWZ8GwFPAE86JLSQ&s=10",
        desc: "Muzdek Coca-Cola"
    }
];

let cart = [];

const menuGrid = document.getElementById('menuGrid');
const filterContainer = document.getElementById('filterContainer');
const cartToggle = document.getElementById('cartToggle');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');   
const totalPriceEl = document.getElementById('totalPrice');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

function renderMenu(category = 'all') {
    menuGrid.innerHTML = '';;
    const filtered = category === 'all'
    ? menuData
    : menuData.filter(item => item.category === category);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="card-img">
<div class="card-body">
    <div>
        <div class="card-title">${product.name}</div>
        <div class="card-desc">${product.desc}</div>
    </div>
    <div class="card-footer">
        <span class="price">${product.price.toLocaleString()} so'm</span>
        <button class="add-btn" onclick="addToCart(${product.id}, this)">+ Qo'shish</button>
    </div>
</div>
        `;
        menuGrid.appendChild(card);
    });
}

function addToCart(productId, btnElement){
    const existing = cart.find(item => item.id === productId);
    if (existing){
        existing.quantity++;
    }
    else{
        const product = menuData.find(item => item.id === productId)
        cart.push({ ...product, quantity: 1});
    }

    if (btnElement){
        const originalText = btnElement.textContent;
        btnElement.textContent = "Qo'shildi! ✓";
        btnElement.classList.add('added');

        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.classList.remove('added');
        }, 600)
    }
    updateCartUI();
}

function changeQuantity(productId, delta){
    const item = cart.find(item => item.id === productId);
    if (item){
        item.quantity += delta;
        if (item.quantity <= 0){
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function updateCartUI(){
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = totalSum.toLocaleString();

    cartItemsEl.innerHTML = cart.length === 0 ? "<p>Savat bo'sh</p>" : '';
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
    <div>
        <div><strong>${item.name}</strong></div>
        <small>${item.price.toLocaleString()} so'm x ${item.quantity}</small>
    </div>
    <div class="cart-item-controls">
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <span style="margin: 0 8px;">${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
    </div>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    cartToggle.classList.add('bump');
    setTimeout(() => {
        cartToggle.classList.remove('bump');
    }, 400);
}

filterContainer.addEventListener('click', (e) =>{
    if (e.target.classList.contains('filter-btn')){
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.category);
    }
});

cartToggle.addEventListener('click', () => cartModal.classList.add('open'));
closeCart.addEventListener('click', () => cartModal.classList.remove('open'));


renderMenu();

if (clearCartBtn){
    clearCartBtn.addEventListener('click', () => {
        if(cart.length === 0){
            alert("Savat bo'sh!");
            return;
        }
        if(confirm("Savatni rostdan ham tozalamoqchimisiz?")){
            cart = [];
            updateCartUI();
        }
    });
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Savat bo'sh!"); 
    return;
  }

  let message = "🍔 *FastBite yangi zakaz!*\n\n";
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} — ${item.quantity} ta. (${(item.price * item.quantity).toLocaleString()} so'm)\n`;
  });

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\n💰 *Jami:* ${totalSum.toLocaleString()} so'm`;

  const telegramUsername = "rezzik221"; 

  const encodedMessage = encodeURIComponent(message);
  const telegramUrl = `https://t.me/${telegramUsername}?text=${encodedMessage}`;

  window.open(telegramUrl, '_blank');
});