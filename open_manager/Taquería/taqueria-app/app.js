/**
 * ==========================================================
 * TAQUERÍA EL TROMPO LOCO - LÓGICA DE APLICACIÓN CLIENTE
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- ESTADO GLOBAL ---
  const state = {
    currentCategory: "todos",
    searchQuery: "",
    cart: [],
    selectedProduct: null,
    customization: {
      quantity: 1,
      tortilla: null,
      verdura: null,
      salsa: null,
      extras: [],
      notes: ""
    },
    activeOrder: null,
    ordersHistory: []
  };

  // --- ELEMENTOS DEL DOM ---
  const elements = {
    // Info Taquería
    restaurantName: document.getElementById("restaurantName"),
    restaurantTagline: document.getElementById("restaurantTagline"),
    restaurantAddress: document.getElementById("restaurantAddress"),
    pickupEstimate: document.getElementById("pickupEstimate"),

    // Buscador y Categorías
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    categoriesContainer: document.getElementById("categoriesContainer"),
    productsContainer: document.getElementById("productsContainer"),
    categoryTitleDisplay: document.getElementById("categoryTitleDisplay"),

    // Floating Cart Bar
    cartFloatingBar: document.getElementById("cartFloatingBar"),
    cartFloatingBtn: document.getElementById("cartFloatingBtn"),
    cartItemCountBadge: document.getElementById("cartItemCountBadge"),
    cartTotalPriceBadge: document.getElementById("cartTotalPriceBadge"),

    // Modal de Personalización de Producto
    productModalOverlay: document.getElementById("productModalOverlay"),
    productModalSheet: document.getElementById("productModalSheet"),
    closeProductModalBtn: document.getElementById("closeProductModalBtn"),
    modalProductImg: document.getElementById("modalProductImg"),
    modalProductTitle: document.getElementById("modalProductTitle"),
    modalProductDesc: document.getElementById("modalProductDesc"),
    modalProductBasePrice: document.getElementById("modalProductBasePrice"),
    modalCustomizationArea: document.getElementById("modalCustomizationArea"),
    modalQtyMinus: document.getElementById("modalQtyMinus"),
    modalQtyPlus: document.getElementById("modalQtyPlus"),
    modalQtyNumber: document.getElementById("modalQtyNumber"),
    modalAddCartBtn: document.getElementById("modalAddCartBtn"),
    modalAddCartTotalText: document.getElementById("modalAddCartTotalText"),

    // Modal de Carrito / Resumen
    cartModalOverlay: document.getElementById("cartModalOverlay"),
    cartModalSheet: document.getElementById("cartModalSheet"),
    closeCartModalBtn: document.getElementById("closeCartModalBtn"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartEmptyState: document.getElementById("cartEmptyState"),
    cartFilledState: document.getElementById("cartFilledState"),
    cartSubtotalText: document.getElementById("cartSubtotalText"),
    cartTotalFinalText: document.getElementById("cartTotalFinalText"),
    btnGoToCheckout: document.getElementById("btnGoToCheckout"),

    // Modal de Checkout / Preparar Pedido
    checkoutModalOverlay: document.getElementById("checkoutModalOverlay"),
    closeCheckoutModalBtn: document.getElementById("closeCheckoutModalBtn"),
    checkoutCustomerName: document.getElementById("checkoutCustomerName"),
    checkoutCustomerPhone: document.getElementById("checkoutCustomerPhone"),
    checkoutPickupTime: document.getElementById("checkoutPickupTime"),
    checkoutNotes: document.getElementById("checkoutNotes"),
    checkoutPaymentMethod: document.getElementById("checkoutPaymentMethod"),
    checkoutCashChangeWrapper: document.getElementById("checkoutCashChangeWrapper"),
    checkoutCashChangeInput: document.getElementById("checkoutCashChangeInput"),
    checkoutSummaryCount: document.getElementById("checkoutSummaryCount"),
    checkoutSummaryTotal: document.getElementById("checkoutSummaryTotal"),
    btnConfirmWhatsApp: document.getElementById("btnConfirmWhatsApp"),
    btnConfirmDigitalTicket: document.getElementById("btnConfirmDigitalTicket"),

    // Modal de Ticket Digital & Seguimiento
    ticketModalOverlay: document.getElementById("ticketModalOverlay"),
    closeTicketModalBtn: document.getElementById("closeTicketModalBtn"),
    ticketFolio: document.getElementById("ticketFolio"),
    ticketTime: document.getElementById("ticketTime"),
    ticketClientName: document.getElementById("ticketClientName"),
    ticketClientPhone: document.getElementById("ticketClientPhone"),
    ticketPaymentBadge: document.getElementById("ticketPaymentBadge"),
    ticketItemsContainer: document.getElementById("ticketItemsContainer"),
    ticketTotalAmount: document.getElementById("ticketTotalAmount"),
    ticketStatusSteps: document.getElementById("ticketStatusSteps"),
    btnTicketShareWhatsApp: document.getElementById("btnTicketShareWhatsApp"),
    btnNewOrder: document.getElementById("btnNewOrder"),

    // Modal de Historial de Pedidos
    ordersModalOverlay: document.getElementById("ordersModalOverlay"),
    openOrdersBtn: document.getElementById("openOrdersBtn"),
    closeOrdersModalBtn: document.getElementById("closeOrdersModalBtn"),
    ordersListContainer: document.getElementById("ordersListContainer"),

    // Toast
    toast: document.getElementById("appToast"),
    toastIcon: document.getElementById("toastIcon"),
    toastText: document.getElementById("toastText")
  };

  // --- AUDIO SINTETIZADO (Web Audio API) ---
  const playSound = (type = "pop") => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "success") {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + (idx * 0.09);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.22);
        });
      }
    } catch (e) {}
  };

  // --- NOTIFICACIONES TOAST ---
  let toastTimer = null;
  const showToast = (message, icon = "🌮") => {
    if (elements.toast) {
      if (toastTimer) clearTimeout(toastTimer);
      elements.toastIcon.textContent = icon;
      elements.toastText.textContent = message;
      elements.toast.classList.add("show");
      toastTimer = setTimeout(() => {
        elements.toast.classList.remove("show");
      }, 2600);
    }
  };

  // --- FORMATEO DE MONEDA ---
  const formatMoney = (amount) => {
    const symbol = MENU_DATA.restaurant.currencySymbol || "$";
    return `${symbol}${Number(amount).toFixed(2)}`;
  };

  // --- INICIALIZACIÓN ---
  const initApp = () => {
    loadSavedData();
    renderRestaurantInfo();
    renderCategories();
    renderProducts();
    updateCartUI();
    setupEventListeners();
  };

  // --- LOCALSTORAGE ---
  const loadSavedData = () => {
    try {
      const savedCart = localStorage.getItem("taqueria_cart");
      if (savedCart) state.cart = JSON.parse(savedCart);

      const savedHistory = localStorage.getItem("taqueria_orders_history");
      if (savedHistory) state.ordersHistory = JSON.parse(savedHistory);

      const savedActiveOrder = localStorage.getItem("taqueria_active_order");
      if (savedActiveOrder) state.activeOrder = JSON.parse(savedActiveOrder);
    } catch (e) {}
  };

  const saveCartToStorage = () => {
    try {
      localStorage.setItem("taqueria_cart", JSON.stringify(state.cart));
    } catch (e) {}
  };

  const saveOrdersToStorage = () => {
    try {
      localStorage.setItem("taqueria_orders_history", JSON.stringify(state.ordersHistory));
      if (state.activeOrder) {
        localStorage.setItem("taqueria_active_order", JSON.stringify(state.activeOrder));
      } else {
        localStorage.removeItem("taqueria_active_order");
      }
    } catch (e) {}
  };

  // --- RENDER RESTAURANTE ---
  const renderRestaurantInfo = () => {
    const { restaurant } = MENU_DATA;
    if (elements.restaurantName) elements.restaurantName.textContent = restaurant.name;
    if (elements.restaurantTagline) elements.restaurantTagline.textContent = restaurant.tagline;
    if (elements.restaurantAddress) elements.restaurantAddress.textContent = restaurant.address;
    if (elements.pickupEstimate) elements.pickupEstimate.textContent = `Recogida en ~${restaurant.pickupTimeAvg}`;
  };

  // --- RENDER CATEGORÍAS ---
  const renderCategories = () => {
    if (!elements.categoriesContainer) return;
    elements.categoriesContainer.innerHTML = "";

    MENU_DATA.categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `category-chip ${state.currentCategory === cat.id ? "active" : ""}`;
      btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
      btn.addEventListener("click", () => {
        state.currentCategory = cat.id;
        state.searchQuery = "";
        if (elements.searchInput) elements.searchInput.value = "";
        if (elements.searchClearBtn) elements.searchClearBtn.style.display = "none";
        renderCategories();
        renderProducts();
        playSound("pop");
      });
      elements.categoriesContainer.appendChild(btn);
    });
  };

  // --- RENDER PRODUCTOS ---
  const renderProducts = () => {
    if (!elements.productsContainer) return;
    elements.productsContainer.innerHTML = "";

    let filtered = MENU_DATA.products;

    if (state.currentCategory !== "todos") {
      filtered = filtered.filter(p => p.categoryId === state.currentCategory);
    }

    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (elements.categoryTitleDisplay) {
      if (state.searchQuery.trim() !== "") {
        elements.categoryTitleDisplay.textContent = `Resultados para "${state.searchQuery}" (${filtered.length})`;
      } else {
        const catObj = MENU_DATA.categories.find(c => c.id === state.currentCategory);
        elements.categoryTitleDisplay.textContent = catObj ? `${catObj.icon} ${catObj.name}` : "Menú Completo";
      }
    }

    if (filtered.length === 0) {
      elements.productsContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🌮🔍</div>
          <h3 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 6px;">No encontramos nada parecido</h3>
          <p style="font-size: 0.85rem;">Prueba con palabras como "pastor", "gringa", "birria" o elige otra categoría.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card animate-fade-in";
      
      const badgeHtml = product.tags && product.tags.length > 0
        ? `<div class="product-badge-tag">${product.tags[0]}</div>`
        : "";

      card.innerHTML = `
        <div class="product-thumb-container">
          <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80'" />
          ${badgeHtml}
        </div>
        <div class="product-info">
          <div>
            <h4 class="product-title">${product.name}</h4>
            <p class="product-desc">${product.description}</p>
          </div>
          <div class="product-bottom-row">
            <span class="product-price">${formatMoney(product.price)}</span>
            <button type="button" class="btn-add-quick">
              ${product.isCustomizable ? "Personalizar" : "Agregar"} <span>+</span>
            </button>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        openProductModal(product);
      });

      elements.productsContainer.appendChild(card);
    });
  };

  // --- MODAL DE PERSONALIZACIÓN ---
  const openProductModal = (product) => {
    state.selectedProduct = product;
    
    state.customization = {
      quantity: 1,
      tortilla: product.canHaveTortilla ? MENU_DATA.customizationRules.tortillas[0] : null,
      verdura: product.canHaveVerdura ? MENU_DATA.customizationRules.verduras[0] : null,
      salsa: product.canHaveSalsa ? MENU_DATA.customizationRules.salsas[0] : null,
      extras: [],
      notes: ""
    };

    elements.modalProductImg.src = product.image;
    elements.modalProductTitle.textContent = product.name;
    elements.modalProductDesc.textContent = product.description;
    elements.modalProductBasePrice.textContent = `${formatMoney(product.price)} c/u`;
    elements.modalQtyNumber.textContent = "1";

    renderModalCustomizationOptions(product);
    updateModalPriceCalculation();

    elements.productModalOverlay.classList.add("active");
    playSound("pop");
  };

  const closeProductModal = () => {
    elements.productModalOverlay.classList.remove("active");
    state.selectedProduct = null;
  };

  const renderModalCustomizationOptions = (product) => {
    const container = elements.modalCustomizationArea;
    container.innerHTML = "";

    // 1. Selector de Tortilla
    if (product.canHaveTortilla) {
      const section = document.createElement("div");
      section.className = "option-section";
      section.innerHTML = `
        <div class="option-section-title">
          <span>Elige tu Tortilla</span>
          <span style="color: var(--color-secondary); font-size: 0.75rem;">Obligatorio</span>
        </div>
        <div class="radio-card-group" id="group-tortilla"></div>
      `;
      const group = section.querySelector("#group-tortilla");

      MENU_DATA.customizationRules.tortillas.forEach(item => {
        const isSelected = state.customization.tortilla?.id === item.id;
        const div = document.createElement("div");
        div.className = `option-item ${isSelected ? "selected" : ""}`;
        div.innerHTML = `
          <div class="option-left">
            <div class="custom-radio"></div>
            <span style="font-size: 0.88rem; font-weight: 500;">${item.name}</span>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">
            ${item.price > 0 ? `+${formatMoney(item.price)}` : "Incluido"}
          </span>
        `;
        div.addEventListener("click", () => {
          state.customization.tortilla = item;
          group.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
          div.classList.add("selected");
          updateModalPriceCalculation();
          playSound("pop");
        });
        group.appendChild(div);
      });
      container.appendChild(section);
    }

    // 2. Verdura / Preparación
    if (product.canHaveVerdura) {
      const section = document.createElement("div");
      section.className = "option-section";
      section.innerHTML = `
        <div class="option-section-title">
          <span>Preparación de Verdura</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">1 opción</span>
        </div>
        <div class="radio-card-group" id="group-verdura"></div>
      `;
      const group = section.querySelector("#group-verdura");

      MENU_DATA.customizationRules.verduras.forEach(item => {
        const isSelected = state.customization.verdura?.id === item.id;
        const div = document.createElement("div");
        div.className = `option-item ${isSelected ? "selected" : ""}`;
        div.innerHTML = `
          <div class="option-left">
            <div class="custom-radio"></div>
            <span style="font-size: 0.88rem; font-weight: 500;">${item.name}</span>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">
            ${item.price ? `+${formatMoney(item.price)}` : "Gratis"}
          </span>
        `;
        div.addEventListener("click", () => {
          state.customization.verdura = item;
          group.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
          div.classList.add("selected");
          updateModalPriceCalculation();
          playSound("pop");
        });
        group.appendChild(div);
      });
      container.appendChild(section);
    }

    // 3. Salsa
    if (product.canHaveSalsa) {
      const section = document.createElement("div");
      section.className = "option-section";
      section.innerHTML = `
        <div class="option-section-title">
          <span>Nivel de Salsa</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">Elige tu picante</span>
        </div>
        <div class="radio-card-group" id="group-salsa"></div>
      `;
      const group = section.querySelector("#group-salsa");

      MENU_DATA.customizationRules.salsas.forEach(item => {
        const isSelected = state.customization.salsa?.id === item.id;
        const div = document.createElement("div");
        div.className = `option-item ${isSelected ? "selected" : ""}`;
        div.innerHTML = `
          <div class="option-left">
            <div class="custom-radio"></div>
            <span style="font-size: 0.86rem; font-weight: 500;">${item.name}</span>
          </div>
        `;
        div.addEventListener("click", () => {
          state.customization.salsa = item;
          group.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
          div.classList.add("selected");
          playSound("pop");
        });
        group.appendChild(div);
      });
      container.appendChild(section);
    }

    // 4. Extras
    if (product.canHaveExtras) {
      const section = document.createElement("div");
      section.className = "option-section";
      section.innerHTML = `
        <div class="option-section-title">
          <span>¿Quieres agregar extras?</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">Opcional</span>
        </div>
        <div class="checkbox-card-group" id="group-extras"></div>
      `;
      const group = section.querySelector("#group-extras");

      MENU_DATA.customizationRules.extrasDisponibles.forEach(extra => {
        const isChecked = state.customization.extras.some(e => e.id === extra.id);
        const div = document.createElement("div");
        div.className = `option-item ${isChecked ? "selected" : ""}`;
        div.innerHTML = `
          <div class="option-left">
            <div class="custom-checkbox">✓</div>
            <span style="font-size: 0.88rem; font-weight: 500;">${extra.name}</span>
          </div>
          <span style="font-size: 0.82rem; color: var(--color-secondary); font-weight: 700;">
            ${extra.price > 0 ? `+${formatMoney(extra.price)}` : "Gratis"}
          </span>
        `;
        div.addEventListener("click", () => {
          const index = state.customization.extras.findIndex(e => e.id === extra.id);
          if (index > -1) {
            state.customization.extras.splice(index, 1);
            div.classList.remove("selected");
          } else {
            state.customization.extras.push(extra);
            div.classList.add("selected");
          }
          updateModalPriceCalculation();
          playSound("pop");
        });
        group.appendChild(div);
      });
      container.appendChild(section);
    }

    // 5. Notas especiales
    const notesSection = document.createElement("div");
    notesSection.className = "option-section";
    notesSection.innerHTML = `
      <div class="option-section-title">
        <span>Instrucciones para el taquero</span>
      </div>
      <input type="text" id="modalSpecialNotesInput" class="form-input" placeholder="Ej: Pastor bien doradito, limones extra..." maxlength="120" />
    `;
    const input = notesSection.querySelector("#modalSpecialNotesInput");
    input.addEventListener("input", (e) => {
      state.customization.notes = e.target.value;
    });
    container.appendChild(notesSection);
  };

  const calculateItemUnitPrice = () => {
    if (!state.selectedProduct) return 0;
    let price = state.selectedProduct.price;

    if (state.customization.tortilla?.price) {
      price += state.customization.tortilla.price;
    }
    if (state.customization.verdura?.price) {
      price += state.customization.verdura.price;
    }
    if (state.customization.extras && state.customization.extras.length > 0) {
      state.customization.extras.forEach(extra => {
        if (extra.price) price += extra.price;
      });
    }
    return price;
  };

  const updateModalPriceCalculation = () => {
    const unitPrice = calculateItemUnitPrice();
    const totalPrice = unitPrice * state.customization.quantity;
    if (elements.modalAddCartTotalText) {
      elements.modalAddCartTotalText.textContent = `Agregar al pedido · ${formatMoney(totalPrice)}`;
    }
  };

  // --- CARRITO ---
  const addItemToCart = () => {
    if (!state.selectedProduct) return;

    const unitPrice = calculateItemUnitPrice();
    const cartItem = {
      uid: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      productId: state.selectedProduct.id,
      name: state.selectedProduct.name,
      image: state.selectedProduct.image,
      basePrice: state.selectedProduct.price,
      unitPrice: unitPrice,
      quantity: state.customization.quantity,
      tortilla: state.customization.tortilla ? { ...state.customization.tortilla } : null,
      verdura: state.customization.verdura ? { ...state.customization.verdura } : null,
      salsa: state.customization.salsa ? { ...state.customization.salsa } : null,
      extras: [...state.customization.extras],
      notes: state.customization.notes ? state.customization.notes.trim() : ""
    };

    state.cart.push(cartItem);
    saveCartToStorage();
    updateCartUI();
    closeProductModal();
    showToast(`¡${cartItem.quantity}x ${cartItem.name} al pedido! 🌮`);
    playSound("pop");
  };

  const updateCartItemQuantity = (uid, delta) => {
    const item = state.cart.find(i => i.uid === uid);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(i => i.uid !== uid);
      showToast("Producto eliminado del pedido");
    }

    saveCartToStorage();
    updateCartUI();
    renderCartModalItems();
    playSound("pop");
  };

  const getCartTotals = () => {
    let totalItems = 0;
    let subtotal = 0;

    state.cart.forEach(item => {
      totalItems += item.quantity;
      subtotal += (item.unitPrice * item.quantity);
    });

    return { totalItems, subtotal };
  };

  const updateCartUI = () => {
    const { totalItems, subtotal } = getCartTotals();

    if (elements.cartFloatingBar) {
      if (totalItems > 0) {
        elements.cartFloatingBar.classList.add("visible");
        elements.cartItemCountBadge.textContent = `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
        elements.cartTotalPriceBadge.textContent = formatMoney(subtotal);
      } else {
        elements.cartFloatingBar.classList.remove("visible");
      }
    }
  };

  // --- MODAL DE CARRITO ---
  const openCartModal = () => {
    renderCartModalItems();
    elements.cartModalOverlay.classList.add("active");
    playSound("pop");
  };

  const closeCartModal = () => {
    elements.cartModalOverlay.classList.remove("active");
  };

  const renderCartModalItems = () => {
    const { totalItems, subtotal } = getCartTotals();

    if (totalItems === 0) {
      elements.cartEmptyState.style.display = "block";
      elements.cartFilledState.style.display = "none";
      return;
    }

    elements.cartEmptyState.style.display = "none";
    elements.cartFilledState.style.display = "block";

    if (elements.cartSubtotalText) elements.cartSubtotalText.textContent = formatMoney(subtotal);
    if (elements.cartTotalFinalText) elements.cartTotalFinalText.textContent = formatMoney(subtotal);

    elements.cartItemsList.innerHTML = "";

    state.cart.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.style.cssText = `
        padding: 12px 0;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        gap: 12px;
      `;

      const detailsList = [];
      if (item.tortilla) detailsList.push(item.tortilla.name);
      if (item.verdura) detailsList.push(item.verdura.name);
      if (item.salsa) detailsList.push(item.salsa.name.split(" ")[0] + " " + (item.salsa.name.split(" ")[1] || ""));
      if (item.extras && item.extras.length > 0) {
        detailsList.push(...item.extras.map(e => `+${e.name}`));
      }
      if (item.notes) detailsList.push(`Nota: "${item.notes}"`);

      const detailsHtml = detailsList.length > 0
        ? `<div style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.35; margin-top: 3px;">${detailsList.join(" · ")}</div>`
        : "";

      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 54px; height: 54px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;" />
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main);">${item.name}</h5>
            <span style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--color-secondary);">
              ${formatMoney(item.unitPrice * item.quantity)}
            </span>
          </div>
          ${detailsHtml}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">${formatMoney(item.unitPrice)} c/u</span>
            <div class="qty-stepper" style="transform: scale(0.85); transform-origin: right center;">
              <button type="button" class="qty-btn btn-cart-minus" data-uid="${item.uid}">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button type="button" class="qty-btn btn-cart-plus" data-uid="${item.uid}">+</button>
            </div>
          </div>
        </div>
      `;

      itemEl.querySelector(".btn-cart-minus").addEventListener("click", () => updateCartItemQuantity(item.uid, -1));
      itemEl.querySelector(".btn-cart-plus").addEventListener("click", () => updateCartItemQuantity(item.uid, 1));

      elements.cartItemsList.appendChild(itemEl);
    });
  };

  // --- CHECKOUT ---
  const openCheckoutModal = () => {
    closeCartModal();
    const { totalItems, subtotal } = getCartTotals();
    if (totalItems === 0) {
      showToast("Tu carrito está vacío");
      return;
    }

    elements.checkoutSummaryCount.textContent = `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
    elements.checkoutSummaryTotal.textContent = formatMoney(subtotal);

    populatePickupTimeSlots();

    elements.checkoutModalOverlay.classList.add("active");
    playSound("pop");
  };

  const closeCheckoutModal = () => {
    elements.checkoutModalOverlay.classList.remove("active");
  };

  const populatePickupTimeSlots = () => {
    if (!elements.checkoutPickupTime) return;
    elements.checkoutPickupTime.innerHTML = `
      <option value="Lo antes posible (15-20 min)" selected>⚡ Lo antes posible (En ~15-20 min)</option>
    `;

    const now = new Date();
    for (let i = 1; i <= 6; i++) {
      const slot = new Date(now.getTime() + (i * 20 * 60 * 1000));
      const hours = String(slot.getHours()).padStart(2, "0");
      const minutes = String(Math.floor(slot.getMinutes() / 5) * 5).padStart(2, "0");
      const timeStr = `${hours}:${minutes} hrs`;
      const opt = document.createElement("option");
      opt.value = `A las ${timeStr}`;
      opt.textContent = `⏰ Recoger a las ${timeStr}`;
      elements.checkoutPickupTime.appendChild(opt);
    }
  };

  // --- CONFIRMAR PEDIDO ---
  const handleOrderSubmission = (isWhatsApp = true) => {
    const clientName = elements.checkoutCustomerName.value.trim();
    const clientPhone = elements.checkoutCustomerPhone.value.trim();
    const pickupTime = elements.checkoutPickupTime.value;
    const paymentMethod = elements.checkoutPaymentMethod.value;
    const cashChange = elements.checkoutCashChangeInput.value.trim();
    const notes = elements.checkoutNotes.value.trim();

    if (!clientName) {
      alert("Por favor ingresa tu nombre para identificar el pedido al recoger.");
      elements.checkoutCustomerName.focus();
      return;
    }

    if (!clientPhone || clientPhone.length < 8) {
      alert("Por favor ingresa un número de teléfono o WhatsApp válido.");
      elements.checkoutCustomerPhone.focus();
      return;
    }

    const { totalItems, subtotal } = getCartTotals();
    const folio = "TCQ-" + Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      folio: folio,
      timestamp: Date.now(),
      timeFormatted: dateFormatted,
      clientName: clientName,
      clientPhone: clientPhone,
      pickupTime: pickupTime,
      paymentMethod: paymentMethod,
      cashChange: paymentMethod === "efectivo" && cashChange ? cashChange : null,
      notes: notes,
      items: JSON.parse(JSON.stringify(state.cart)),
      totalItems: totalItems,
      totalAmount: subtotal,
      status: "recibido"
    };

    state.activeOrder = newOrder;
    state.ordersHistory.unshift(newOrder);
    saveOrdersToStorage();

    state.cart = [];
    saveCartToStorage();
    updateCartUI();

    closeCheckoutModal();
    playSound("success");

    triggerCelebration();

    if (isWhatsApp) {
      sendOrderViaWhatsApp(newOrder);
    }

    showDigitalTicket(newOrder);
  };

  const sendOrderViaWhatsApp = (order) => {
    const { restaurant } = MENU_DATA;
    let paymentDesc = order.paymentMethod === "efectivo" 
      ? `Efectivo en mostrador${order.cashChange ? ` (Paga con: $${order.cashChange})` : ""}`
      : "Tarjeta / Datáfono al recoger";

    let message = `🌮 *¡NUEVO PEDIDO PARA RECOGER!* 🌮\n`;
    message += `*Folio:* #${order.folio}\n`;
    message += `*Cliente:* ${order.clientName}\n`;
    message += `*Teléfono:* ${order.clientPhone}\n`;
    message += `*Hora estimada:* ${order.pickupTime}\n`;
    message += `*Forma de pago:* ${paymentDesc}\n\n`;

    message += `📋 *DETALLE DEL PEDIDO:*\n`;
    order.items.forEach(item => {
      message += `• ${item.quantity}x *${item.name}* (${formatMoney(item.unitPrice * item.quantity)})\n`;
      if (item.tortilla) message += `   - Tortilla: ${item.tortilla.name}\n`;
      if (item.verdura) message += `   - Verdura: ${item.verdura.name}\n`;
      if (item.salsa) message += `   - Salsa: ${item.salsa.name}\n`;
      if (item.extras && item.extras.length > 0) {
        message += `   - Extras: ${item.extras.map(e => e.name).join(", ")}\n`;
      }
      if (item.notes) message += `   - 📝 Nota: ${item.notes}\n`;
    });

    if (order.notes) {
      message += `\n💬 *Instrucciones generales:* ${order.notes}\n`;
    }

    message += `\n💰 *TOTAL A PAGAR:* ${formatMoney(order.totalAmount)} ${restaurant.currency}\n`;
    message += `📍 *Recoger en:* ${restaurant.address}\n\n`;
    message += `¡Muchas gracias! Ya voy para allá a recogerlo. 👋`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurant.whatsappPhone}?text=${encodedMsg}`;

    window.open(whatsappUrl, "_blank");
  };

  // --- TICKET DIGITAL ---
  const showDigitalTicket = (order) => {
    if (!order) return;

    elements.ticketFolio.textContent = `#${order.folio}`;
    elements.ticketTime.textContent = order.pickupTime;
    elements.ticketClientName.textContent = order.clientName;
    elements.ticketClientPhone.textContent = order.clientPhone;
    elements.ticketPaymentBadge.textContent = order.paymentMethod === "efectivo" ? "💵 Efectivo en barra" : "💳 Tarjeta en mostrador";
    elements.ticketTotalAmount.textContent = formatMoney(order.totalAmount);

    elements.ticketItemsContainer.innerHTML = "";
    order.items.forEach(item => {
      const row = document.createElement("div");
      row.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        margin-bottom: 6px;
      `;
      row.innerHTML = `
        <div>
          <span style="font-weight: 700;">${item.quantity}x</span> ${item.name}
        </div>
        <span style="font-weight: 600;">${formatMoney(item.unitPrice * item.quantity)}</span>
      `;
      elements.ticketItemsContainer.appendChild(row);
    });

    renderOrderStatusSteps(order.status || "recibido");

    elements.btnTicketShareWhatsApp.onclick = () => sendOrderViaWhatsApp(order);
    elements.ticketModalOverlay.classList.add("active");
  };

  const renderOrderStatusSteps = (currentStatus) => {
    const steps = [
      { key: "recibido", label: "Pedido recibido en barra", desc: "El taquero ya tiene tu comanda", icon: "✓" },
      { key: "en_preparacion", label: "En trompo y plancha", desc: "Dorando y preparando tus tacos", icon: "🔥" },
      { key: "listo", label: "¡Empacado y listo para recoger!", desc: "Acércate al mostrador con tu folio", icon: "🛍️" }
    ];

    elements.ticketStatusSteps.innerHTML = "";
    steps.forEach((step) => {
      const isCompleted = step.key === "recibido" || (currentStatus === "listo") || (currentStatus === "en_preparacion" && step.key === "recibido");
      const isActive = step.key === currentStatus;

      const stepEl = document.createElement("div");
      stepEl.className = `tracker-step ${isActive ? "active" : ""} ${isCompleted && !isActive ? "completed" : ""}`;
      stepEl.innerHTML = `
        <div class="step-icon-wrap">${step.icon}</div>
        <div>
          <h5 style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">${step.label}</h5>
          <p style="font-size: 0.75rem; color: var(--text-muted);">${step.desc}</p>
        </div>
      `;
      elements.ticketStatusSteps.appendChild(stepEl);
    });
  };

  // --- HISTORIAL ---
  const openOrdersHistoryModal = () => {
    elements.ordersListContainer.innerHTML = "";

    if (state.ordersHistory.length === 0) {
      elements.ordersListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🧾</div>
          <h4>No tienes pedidos anteriores</h4>
          <p style="font-size: 0.82rem; margin-top: 4px;">Cuando prepares tu primer pedido para recoger, aparecerá aquí.</p>
        </div>
      `;
    } else {
      state.ordersHistory.forEach(order => {
        const itemCard = document.createElement("div");
        itemCard.style.cssText = `
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: background 0.15s ease;
        `;
        itemCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 800; color: var(--color-secondary);">#${order.folio}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${order.timeFormatted || "Reciente"}</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 6px;">
            ${order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; color: #48CAE4;">⏰ ${order.pickupTime}</span>
            <span style="font-family: var(--font-heading); font-weight: 700; color: #FFFFFF;">${formatMoney(order.totalAmount)}</span>
          </div>
        `;
        itemCard.addEventListener("click", () => {
          elements.ordersModalOverlay.classList.remove("active");
          showDigitalTicket(order);
        });
        elements.ordersListContainer.appendChild(itemCard);
      });
    }

    elements.ordersModalOverlay.classList.add("active");
    playSound("pop");
  };

  // --- CELEBRACIÓN ---
  const triggerCelebration = () => {
    try {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FF4A22', '#FFB703', '#2A9D8F', '#FFFFFF']
        });
      }
    } catch (e) {}
  };

  // --- EVENT LISTENERS ---
  const setupEventListeners = () => {
    // Buscador
    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        if (elements.searchClearBtn) {
          elements.searchClearBtn.style.display = state.searchQuery ? "block" : "none";
        }
        renderProducts();
      });
    }

    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener("click", () => {
        elements.searchInput.value = "";
        state.searchQuery = "";
        elements.searchClearBtn.style.display = "none";
        renderProducts();
        elements.searchInput.focus();
      });
    }

    // Modal Cantidad
    if (elements.modalQtyMinus) {
      elements.modalQtyMinus.addEventListener("click", () => {
        if (state.customization.quantity > 1) {
          state.customization.quantity--;
          elements.modalQtyNumber.textContent = state.customization.quantity;
          updateModalPriceCalculation();
          playSound("pop");
        }
      });
    }

    if (elements.modalQtyPlus) {
      elements.modalQtyPlus.addEventListener("click", () => {
        if (state.customization.quantity < 30) {
          state.customization.quantity++;
          elements.modalQtyNumber.textContent = state.customization.quantity;
          updateModalPriceCalculation();
          playSound("pop");
        }
      });
    }

    if (elements.modalAddCartBtn) {
      elements.modalAddCartBtn.addEventListener("click", addItemToCart);
    }
    if (elements.closeProductModalBtn) {
      elements.closeProductModalBtn.addEventListener("click", closeProductModal);
    }
    if (elements.productModalOverlay) {
      elements.productModalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.productModalOverlay) closeProductModal();
      });
    }

    // Carrito
    if (elements.cartFloatingBtn) {
      elements.cartFloatingBtn.addEventListener("click", openCartModal);
    }
    if (elements.closeCartModalBtn) {
      elements.closeCartModalBtn.addEventListener("click", closeCartModal);
    }
    if (elements.cartModalOverlay) {
      elements.cartModalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.cartModalOverlay) closeCartModal();
      });
    }

    // Checkout
    if (elements.btnGoToCheckout) {
      elements.btnGoToCheckout.addEventListener("click", openCheckoutModal);
    }
    if (elements.closeCheckoutModalBtn) {
      elements.closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);
    }
    if (elements.checkoutModalOverlay) {
      elements.checkoutModalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.checkoutModalOverlay) closeCheckoutModal();
      });
    }

    if (elements.checkoutPaymentMethod) {
      elements.checkoutPaymentMethod.addEventListener("change", (e) => {
        if (elements.checkoutCashChangeWrapper) {
          elements.checkoutCashChangeWrapper.style.display = e.target.value === "efectivo" ? "block" : "none";
        }
      });
    }

    if (elements.btnConfirmWhatsApp) {
      elements.btnConfirmWhatsApp.addEventListener("click", () => handleOrderSubmission(true));
    }
    if (elements.btnConfirmDigitalTicket) {
      elements.btnConfirmDigitalTicket.addEventListener("click", () => handleOrderSubmission(false));
    }

    // Ticket
    if (elements.closeTicketModalBtn) {
      elements.closeTicketModalBtn.addEventListener("click", () => elements.ticketModalOverlay.classList.remove("active"));
    }
    if (elements.btnNewOrder) {
      elements.btnNewOrder.addEventListener("click", () => {
        elements.ticketModalOverlay.classList.remove("active");
        showToast("¡Listo para armar un nuevo pedido! 🌮");
      });
    }

    // Historial
    if (elements.openOrdersBtn) {
      elements.openOrdersBtn.addEventListener("click", openOrdersHistoryModal);
    }
    if (elements.closeOrdersModalBtn) {
      elements.closeOrdersModalBtn.addEventListener("click", () => elements.ordersModalOverlay.classList.remove("active"));
    }
    if (elements.ordersModalOverlay) {
      elements.ordersModalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.ordersModalOverlay) elements.ordersModalOverlay.classList.remove("active");
      });
    }
  };

  initApp();
});

