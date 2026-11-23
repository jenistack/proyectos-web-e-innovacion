/**
 * ComandaYa - Script de la Landing Page
 * Controla:
 * 1. Calculadora Interactiva de Ganancias y Ahorro en Comisiones
 * 2. Demo Interactiva en Tiempo Real (Cliente -> Cocina) con Web Audio API
 * 3. Acordeón de Preguntas Frecuentes (FAQ)
 * 4. Captura y Validación del Formulario de Leads
 * 5. Menú de Navegación Móvil
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initMobileMenu();
  initSmoothScroll();
});

/* ==========================================================================
   1. CALCULADORA INTERACTIVA DE GANANCIAS & AHORRO
   ========================================================================== */
function initCalculator() {
  const ordersSlider = document.getElementById('calcOrders');
  const ticketSlider = document.getElementById('calcTicket');

  if (!ordersSlider || !ticketSlider) return;

  const valOrders = document.getElementById('valOrders');
  const valTicket = document.getElementById('valTicket');
  const resExtraIncome = document.getElementById('resExtraIncome');
  const resCommissionSaved = document.getElementById('resCommissionSaved');
  const resWaitSaved = document.getElementById('resWaitSaved');

  function calculate() {
    const orders = parseInt(ordersSlider.value, 10) || 60;
    const ticket = parseInt(ticketSlider.value, 10) || 140;

    // Actualizar etiquetas visuales de los sliders
    if (valOrders) valOrders.textContent = `${orders} pedidos`;
    if (valTicket) valTicket.textContent = `$${ticket} MXN`;

    // Facturación mensual estimada actual
    const monthlyGross = orders * ticket * 30;

    // Facturación extra estimada: +15% por mayor rotación de mesas + 13% por venta sugerida (Upselling) = ~28%
    const extraIncome = Math.round(monthlyGross * 0.28);

    // Ahorro estimado si el 50% de los pedidos fueran por plataformas de terceros que quitan el 30%
    const commissionSavings = Math.round(monthlyGross * 0.30);

    // Horas de espera ahorradas a los clientes (~15 min por orden optimizada)
    const hoursSaved = Math.round((orders * 30 * 15) / 60);

    // Formatear resultados
    if (resExtraIncome) {
      resExtraIncome.textContent = `+$${extraIncome.toLocaleString('es-MX')} MXN`;
    }
    if (resCommissionSaved) {
      resCommissionSaved.textContent = `$${commissionSavings.toLocaleString('es-MX')} MXN / mes`;
    }
    if (resWaitSaved) {
      resWaitSaved.textContent = `~${hoursSaved.toLocaleString('es-MX')} horas al mes`;
    }
  }

  ordersSlider.addEventListener('input', calculate);
  ticketSlider.addEventListener('input', calculate);

  // Ejecución inicial
  calculate();
}

/* ==========================================================================
   2. DEMO INTERACTIVA EN TIEMPO REAL (Móvil Cliente -> Comanda Cocina)
   ========================================================================== */
const demoState = {
  items: {},
  total: 0,
  count: 0
};

// Sonido sintético de comanda / campana de cocina usando Web Audio API
function playKitchenChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Campana de comanda (Dos tonos armónicos)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.2); // D6

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Si el navegador bloquea audio sin interacción previa, continuar sin error
  }
}

window.addDemoItem = function(name, price) {
  if (!demoState.items[name]) {
    demoState.items[name] = { qty: 0, price: price };
  }
  demoState.items[name].qty += 1;
  demoState.count += 1;
  demoState.total += price;

  updateDemoUI();
};

function updateDemoUI() {
  const countEl = document.getElementById('demoCount');
  const totalEl = document.getElementById('demoTotal');
  const btnSend = document.getElementById('btnSendDemo');

  if (countEl) {
    countEl.textContent = `${demoState.count} producto${demoState.count === 1 ? '' : 's'}`;
  }
  if (totalEl) {
    totalEl.textContent = `$${demoState.total.toFixed(2)}`;
  }
  if (btnSend) {
    if (demoState.count > 0) {
      btnSend.classList.add('pulse-ready');
    } else {
      btnSend.classList.remove('pulse-ready');
    }
  }
}

window.triggerSendOrder = function() {
  // Si no ha agregado ningún producto, agregamos uno por defecto para que vea el efecto
  if (demoState.count === 0) {
    window.addDemoItem('3x Tacos Pastor', 75);
    window.addDemoItem('Agua de Horchata 1L', 35);
  }

  // Reproducir campana de cocina
  playKitchenChime();

  const placeholder = document.getElementById('kitchenPlaceholder');
  const ticket = document.getElementById('kitchenTicket');
  const productList = document.getElementById('ticketProductList');
  const ticketSum = document.getElementById('ticketSum');
  const ticketClock = document.getElementById('ticketClock');

  if (placeholder) placeholder.style.display = 'none';

  if (productList) {
    productList.innerHTML = '';
    Object.keys(demoState.items).forEach(dishName => {
      const item = demoState.items[dishName];
      if (item.qty > 0) {
        const row = document.createElement('div');
        row.className = 't-row';
        row.innerHTML = `
          <span>${item.qty}x ${dishName}</span>
          <span>$${(item.qty * item.price).toFixed(2)}</span>
        `;
        productList.appendChild(row);
      }
    });
  }

  if (ticketSum) {
    ticketSum.textContent = `$${demoState.total.toFixed(2)}`;
  }

  if (ticketClock) {
    const now = new Date();
    ticketClock.textContent = now.toLocaleTimeString('es-MX', { hour12: false });
  }

  if (ticket) {
    ticket.style.display = 'block';
    // Reiniciar animación CSS
    ticket.style.animation = 'none';
    ticket.offsetHeight; /* trigger reflow */
    ticket.style.animation = 'ticketSlide 0.4s ease-out forwards';
  }

  // Feedback en el botón de enviar
  const btnSend = document.getElementById('btnSendDemo');
  if (btnSend) {
    const originalText = btnSend.innerHTML;
    btnSend.innerHTML = '✓ ¡Orden Enviada a Cocina!';
    btnSend.style.backgroundColor = '#10B981';

    setTimeout(() => {
      btnSend.innerHTML = originalText;
      btnSend.style.backgroundColor = '';
      // Reiniciar carrito de prueba
      demoState.items = {};
      demoState.count = 0;
      demoState.total = 0;
      updateDemoUI();
    }, 2800);
  }
};

/* ==========================================================================
   3. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
window.toggleFaq = function(button) {
  const currentRow = button.closest('.faq-row');
  const currentBody = currentRow.querySelector('.faq-body');
  const isAlreadyActive = currentRow.classList.contains('active');

  // Cerrar todos los demás items para efecto acordeón limpio
  document.querySelectorAll('.faq-row').forEach(row => {
    row.classList.remove('active');
    const body = row.querySelector('.faq-body');
    if (body) {
      body.style.maxHeight = null;
    }
  });

  // Si no estaba abierto, abrir el seleccionado
  if (!isAlreadyActive && currentBody) {
    currentRow.classList.add('active');
    currentBody.style.maxHeight = currentBody.scrollHeight + 'px';
  }
};

/* ==========================================================================
   4. FORMULARIO DE CAPTURA DE LEADS
   ========================================================================== */
window.submitLeadForm = function(event) {
  event.preventDefault();

  const restaurantName = document.getElementById('leadRestaurant')?.value.trim();
  const ownerName = document.getElementById('leadName')?.value.trim();
  const phone = document.getElementById('leadPhone')?.value.trim();
  const businessType = document.getElementById('leadType')?.value;

  const btnSubmit = document.getElementById('btnSubmitLead');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span>Generando acceso de prueba...</span>';
  }

  // Simulación de envío con feedback inmediato
  setTimeout(() => {
    const form = document.getElementById('leadForm');
    const successBox = document.getElementById('leadSuccess');

    if (form && successBox) {
      form.style.display = 'none';
      successBox.style.display = 'block';

      // Guardar lead localmente
      try {
        const leads = JSON.parse(localStorage.getItem('comandaya_leads') || '[]');
        leads.push({
          restaurantName,
          ownerName,
          phone,
          businessType,
          date: new Date().toISOString()
        });
        localStorage.setItem('comandaya_leads', JSON.stringify(leads));
      } catch (e) {
        // En caso de modo incógnito o storage deshabilitado
      }
    }

    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<span>Quiero mi Menú QR sin Costo &rarr;</span>';
    }
  }, 700);
};

window.resetLeadForm = function() {
  const form = document.getElementById('leadForm');
  const successBox = document.getElementById('leadSuccess');

  if (form && successBox) {
    form.reset();
    form.style.display = 'block';
    successBox.style.display = 'none';
  }
};

/* ==========================================================================
   5. MENÚ MÓVIL Y DESPLAZAMIENTO SUAVE
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (!menuToggle || !mobileDrawer) return;

  menuToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en cualquier enlace interno
  const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link, .btn');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('navbar')?.offsetHeight || 72;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

