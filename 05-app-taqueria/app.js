/**
 * PANEL INTERNO DE PEDIDOS - TAQUERÍA "EL TROMPO DORADO"
 * Manejo de estado, arrastre kanban, audio de cocina, sincronización y filtros.
 */

// Canal de comunicación en tiempo real entre pestañas
const syncChannel = 'BroadcastChannel' in window ? new BroadcastChannel('taqueria_orders_sync') : null;

class TaqueriaOrderManager {
  constructor() {
    this.orders = this.loadOrders();
    this.currentFilter = 'todos';
    this.searchQuery = '';
    this.soundEnabled = true;
    this.manualOrderItems = [];

    // Inicializar Audio Context para campana de cocina sin dependencias externas
    this.audioCtx = null;

    this.initElements();
    this.initEventListeners();
    this.initDragAndDrop();
    this.render();
    this.startLiveTimers();
    this.setupSyncListener();
  }

  // --- Almacenamiento & Carga ---
  loadOrders() {
    try {
      const saved = localStorage.getItem('taqueria_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Error leyendo localStorage, usando pedidos demo:", e);
    }
    // Si no hay datos previos, usar INITIAL_ORDERS de mock-data.js
    return typeof INITIAL_ORDERS !== 'undefined' ? JSON.parse(JSON.stringify(INITIAL_ORDERS)) : [];
  }

  saveOrders(broadcast = true) {
    try {
      localStorage.setItem('taqueria_orders', JSON.stringify(this.orders));
      if (broadcast && syncChannel) {
        syncChannel.postMessage({ type: 'ORDERS_UPDATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.error("Error guardando pedidos:", e);
    }
  }

  setupSyncListener() {
    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'ORDERS_UPDATED') {
          this.orders = this.loadOrders();
          this.render();
          this.showToast("🔔 Panel sincronizado con un nuevo cambio", "info");
        }
      };
    }

    window.addEventListener('storage', (e) => {
      if (e.key === 'taqueria_orders') {
        this.orders = this.loadOrders();
        this.render();
      }
    });
  }

  // --- Elementos del DOM ---
  initElements() {
    this.searchInput = document.getElementById('searchInput');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.btnNewOrder = document.getElementById('btnNewOrder');
    this.btnSimulateOrder = document.getElementById('btnSimulateOrder');
    this.btnResetDemo = document.getElementById('btnResetDemo');

    // Columnas
    this.colPendiente = document.getElementById('ordersPendiente');
    this.colPreparando = document.getElementById('ordersPreparando');
    this.colListo = document.getElementById('ordersListo');
    this.colEntregado = document.getElementById('ordersEntregado');

    // Contadores de columnas
    this.countPendiente = document.getElementById('countPendiente');
    this.countPreparando = document.getElementById('countPreparando');
    this.countListo = document.getElementById('countListo');
    this.countEntregado = document.getElementById('countEntregado');

    // Métricas globales
    this.metricPendientes = document.getElementById('metricPendientes');
    this.metricPreparando = document.getElementById('metricPreparando');
    this.metricListos = document.getElementById('metricListos');
    this.metricEntregados = document.getElementById('metricEntregados');
    this.metricVentas = document.getElementById('metricVentas');

    // Modales
    this.modalNewOrder = document.getElementById('modalNewOrder');
    this.modalTicket = document.getElementById('modalTicket');
    this.ticketContent = document.getElementById('ticketContent');
    this.printableReceipt = document.getElementById('printableReceipt');
    this.toastContainer = document.getElementById('toastContainer');
  }

  // --- Event Listeners ---
  initEventListeners() {
    // Búsqueda
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    // Filtros por canal
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Control de Sonido
    this.soundToggleBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this.soundToggleBtn.classList.toggle('active', this.soundEnabled);
      this.soundToggleBtn.title = this.soundEnabled ? "Sonido Activado" : "Sonido Silenciado";
      this.showToast(this.soundEnabled ? "🔔 Alertas sonoras activadas" : "🔕 Alertas sonoras silenciadas");
    });

    // Alternar Tema (Oscuro / Claro)
    this.themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      this.themeToggleBtn.innerHTML = isLight ? '🌙' : '☀️';
      this.showToast(isLight ? "Modo diurno activado" : "Modo cocina/nocturno activado");
    });

    // Botón Nuevo Pedido Manual
    this.btnNewOrder.addEventListener('click', () => this.openNewOrderModal());

    // Botón Simular Pedido Rápido
    this.btnSimulateOrder.addEventListener('click', () => this.simulateIncomingOrder());

    // Reiniciar Datos Demo
    this.btnResetDemo.addEventListener('click', () => {
      if (confirm("¿Deseas reiniciar los pedidos al estado inicial de demostración?")) {
        this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
        this.saveOrders();
        this.render();
        this.showToast("Datos de demostración restablecidos", "info");
      }
    });

    // Cerrar Modales al presionar la X o hacer clic fuera
    document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modalNewOrder.classList.remove('open');
        this.modalTicket.classList.remove('open');
      });
    });

    [this.modalNewOrder, this.modalTicket].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });

    // Guardar Pedido Manual Form
    document.getElementById('formNewOrder').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitManualOrder();
    });

    // Imprimir comanda
    document.getElementById('btnPrintTicket').addEventListener('click', () => {
      window.print();
    });
  }

  // --- Audio Synthesis (Sonido de Timbre de Cocina / Pedido Nuevo) ---
  playSound(type = 'bell') {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (type === 'new_order') {
        // Doble campana agradable y llamativa
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // Segundo tono
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6
        gain2.gain.setValueAtTime(0.35, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.2);
        osc2.stop(now + 0.9);
      } else if (type === 'ready') {
        // Campana de orden lista (ding cristalino)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now); // B5
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      }
    } catch (e) {
      console.warn("Audio Context no disponible:", e);
    }
  }

  // --- Cambio de Estados de Pedidos ---
  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const previousStatus = order.status;
    order.status = newStatus;

    if (newStatus === 'preparando' && !order.prepStartedAt) {
      order.prepStartedAt = new Date().toISOString();
    } else if (newStatus === 'listo' && !order.readyAt) {
      order.readyAt = new Date().toISOString();
      this.playSound('ready');
    } else if (newStatus === 'entregado') {
      order.deliveredAt = new Date().toISOString();
      if (order.paymentStatus === 'pendiente_pago') {
        order.paymentStatus = 'pagado';
      }
    }

    this.saveOrders();
    this.render();

    const statusLabels = {
      'pendiente': '🟡 Pendiente',
      'preparando': '🔵 En Preparación',
      'listo': '🟢 Listo para Servir',
      'entregado': '⚪ Entregado'
    };

    this.showToast(`Pedido ${order.id} movido a ${statusLabels[newStatus]}`);
  }

  // --- Drag and Drop Nativo ---
  initDragAndDrop() {
    const columns = [
      { el: this.colPendiente, status: 'pendiente' },
      { el: this.colPreparando, status: 'preparando' },
      { el: this.colListo, status: 'listo' },
      { el: this.colEntregado, status: 'entregado' }
    ];

    columns.forEach(({ el, status }) => {
      const container = el.closest('.kanban-column');

      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
      });

      container.addEventListener('dragleave', (e) => {
        if (!container.contains(e.relatedTarget)) {
          container.classList.remove('drag-over');
        }
      });

      container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        const orderId = e.dataTransfer.getData('text/plain');
        if (orderId) {
          this.updateOrderStatus(orderId, status);
        }
      });
    });
  }

  // --- Render Principal ---
  render() {
    const filteredOrders = this.orders.filter(order => {
      // Filtro de canal
      if (this.currentFilter !== 'todos' && order.orderType !== this.currentFilter) {
        return false;
      }
      // Filtro de búsqueda
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCustomer = order.customer.toLowerCase().includes(q);
        const matchesTable = order.tableNumber && order.tableNumber.toString().includes(q);
        const matchesItem = order.items.some(item => item.name.toLowerCase().includes(q));
        return matchesId || matchesCustomer || matchesTable || matchesItem;
      }
      return true;
    });

    // Separar por estado
    const pendientes = filteredOrders.filter(o => o.status === 'pendiente');
    const preparando = filteredOrders.filter(o => o.status === 'preparando');
    const listos = filteredOrders.filter(o => o.status === 'listo');
    const entregados = filteredOrders.filter(o => o.status === 'entregado');

    // Actualizar contadores en columnas
    this.countPendiente.textContent = pendientes.length;
    this.countPreparando.textContent = preparando.length;
    this.countListo.textContent = listos.length;
    this.countEntregado.textContent = entregados.length;

    // Pintar tarjetas en cada columna
    this.colPendiente.innerHTML = pendientes.map(o => this.createOrderCardHTML(o)).join('');
    this.colPreparando.innerHTML = preparando.map(o => this.createOrderCardHTML(o)).join('');
    this.colListo.innerHTML = listos.map(o => this.createOrderCardHTML(o)).join('');
    this.colEntregado.innerHTML = entregados.map(o => this.createOrderCardHTML(o)).join('');

    // Actualizar Métricas Superiores
    this.updateKPIs();

    // Re-vincular eventos interactivos de las tarjetas
    this.bindCardEvents();
  }

  // --- Actualizar Indicadores KPI ---
  updateKPIs() {
    const totalPendientes = this.orders.filter(o => o.status === 'pendiente').length;
    const totalPreparando = this.orders.filter(o => o.status === 'preparando').length;
    const totalListos = this.orders.filter(o => o.status === 'listo').length;
    const entregados = this.orders.filter(o => o.status === 'entregado');

    const totalVentas = this.orders.reduce((sum, o) => sum + (o.total || 0), 0);

    this.metricPendientes.textContent = totalPendientes;
    this.metricPreparando.textContent = totalPreparando;
    this.metricListos.textContent = totalListos;
    this.metricEntregados.textContent = entregados.length;
    this.metricVentas.textContent = `$${totalVentas.toLocaleString('es-MX')}`;
  }

  // --- HTML de Tarjeta de Pedido ---
  createOrderCardHTML(order) {
    const minutesAgo = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (60 * 1000));
    let timerClass = 'timer-green';
    if (minutesAgo >= 15 && (order.status === 'pendiente' || order.status === 'preparando')) {
      timerClass = 'timer-red';
    } else if (minutesAgo >= 8) {
      timerClass = 'timer-amber';
    }

    const channelTags = {
      'mesa': `<span class="order-channel-tag salon">🍽️ Mesa ${order.tableNumber || ''}</span>`,
      'llevar': `<span class="order-channel-tag llevar">🥡 Para Llevar</span>`,
      'delivery': `<span class="order-channel-tag delivery">🛵 ${order.channel || 'Delivery'}</span>`
    };

    const nextActions = {
      'pendiente': `<button class="btn-state-advance to-preparando" data-action="preparando" data-id="${order.id}">👨‍🍳 Empezar a Preparar</button>`,
      'preparando': `<button class="btn-state-advance to-listo" data-action="listo" data-id="${order.id}">🔔 Marcar como Listo</button>`,
      'listo': `<button class="btn-state-advance to-entregado" data-action="entregado" data-id="${order.id}">✅ Entregar Pedido</button>`,
      'entregado': `<button class="btn-state-advance" style="background:#374151;" data-action="pendiente" data-id="${order.id}">↩️ Reabrir Pedido</button>`
    };

    return `
      <article class="order-card" draggable="true" data-order-id="${order.id}">
        <div class="card-top">
          <div class="order-id-group">
            <span class="order-id">${order.id}</span>
            ${channelTags[order.orderType] || ''}
          </div>
          <span class="order-timer ${timerClass}" title="Tiempo transcurrido">
            ⏱️ ${minutesAgo === 0 ? 'Ahora' : `${minutesAgo} min`}
          </span>
        </div>

        <div class="card-customer">
          👤 ${order.customer}
        </div>

        <ul class="card-items-list">
          ${order.items.map(item => `
            <li class="card-item">
              <div class="item-main-row">
                <div class="item-qty-name">
                  <span class="item-qty">${item.quantity}x</span>
                  <span class="item-name">${item.name}</span>
                </div>
                <span class="item-price">$${item.price * item.quantity}</span>
              </div>
              ${item.options ? `<div class="item-options">• ${item.options}</div>` : ''}
            </li>
          `).join('')}
        </ul>

        ${order.notes ? `
          <div class="card-notes">
            <span>⚠️</span>
            <div><strong>Nota cocina:</strong> ${order.notes}</div>
          </div>
        ` : ''}

        <div class="card-footer">
          <div class="card-total">Total: $${order.total}</div>
          <span class="card-pay-status ${order.paymentStatus || 'pagado'}">
            ${order.paymentStatus === 'pendiente_pago' ? '💳 Por cobrar' : '✅ Pagado'}
          </span>
        </div>

        <div class="card-actions">
          ${nextActions[order.status] || ''}

          <div class="card-secondary-actions">
            <button class="btn-action-small btn-ticket" data-id="${order.id}" title="Imprimir Comanda">
              🖨️ Comanda
            </button>
            
            <select class="status-dropdown" data-id="${order.id}">
              <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Mover a: Pendiente</option>
              <option value="preparando" ${order.status === 'preparando' ? 'selected' : ''}>Mover a: Preparando</option>
              <option value="listo" ${order.status === 'listo' ? 'selected' : ''}>Mover a: Listo</option>
              <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Mover a: Entregado</option>
            </select>
          </div>
        </div>
      </article>
    `;
  }

  // --- Vincular Eventos de Cada Tarjeta ---
  bindCardEvents() {
    // Botones de avance rápido de estado
    document.querySelectorAll('.btn-state-advance').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.dataset.id;
        const nextStatus = e.currentTarget.dataset.action;
        this.updateOrderStatus(orderId, nextStatus);
      });
    });

    // Selectores directos de estado
    document.querySelectorAll('.status-dropdown').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const orderId = e.target.dataset.id;
        const newStatus = e.target.value;
        this.updateOrderStatus(orderId, newStatus);
      });
    });

    // Botón Comanda
    document.querySelectorAll('.btn-ticket').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.dataset.id;
        this.openTicketModal(orderId);
      });
    });

    // Eventos de arrastre nativo en las tarjetas
    document.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        card.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', card.dataset.orderId);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('is-dragging');
      });
    });
  }

  // --- Cronómetro en Vivo para los tiempos ---
  startLiveTimers() {
    setInterval(() => {
      this.render();
    }, 15000); // Actualiza cada 15 seg para reflejar minutos transcurridos y alertas de color
  }

  // --- Modal de Comanda Térmica / Imprimible ---
  openTicketModal(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const dateStr = new Date(order.createdAt).toLocaleString('es-MX', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const ticketHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0;">🌮 TAQUERÍA EL TROMPO DORADO 🌮</h2>
        <p style="font-size: 0.8rem; margin: 2px 0;">*** COMANDA DE COCINA Y MOSTRADOR ***</p>
        <p style="font-size: 0.75rem; color: #666;">Folio: <strong>${order.id}</strong> | ${dateStr}</p>
        <hr style="border: none; border-top: 1px dashed #444; margin: 8px 0;">
      </div>

      <div style="font-size: 0.85rem; margin-bottom: 10px;">
        <div><strong>Tipo:</strong> ${order.orderType === 'mesa' ? `SALÓN - MESA ${order.tableNumber}` : order.channel}</div>
        <div><strong>Cliente:</strong> ${order.customer}</div>
        <div><strong>Estado Actual:</strong> [ ${order.status.toUpperCase()} ]</div>
      </div>

      <hr style="border: none; border-top: 1px dashed #444; margin: 8px 0;">

      <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd; text-align: left;">
            <th style="padding: 4px 0;">Cant</th>
            <th style="padding: 4px 0;">Descripción</th>
            <th style="padding: 4px 0; text-align: right;">Importe</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(it => `
            <tr>
              <td style="padding: 4px 0; font-weight: bold; vertical-align: top;">${it.quantity}x</td>
              <td style="padding: 4px 0;">
                <div><strong>${it.name}</strong></div>
                ${it.options ? `<div style="font-size: 0.75rem; color: #555;">> ${it.options}</div>` : ''}
              </td>
              <td style="padding: 4px 0; text-align: right; vertical-align: top;">$${it.price * it.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <hr style="border: none; border-top: 1px dashed #444; margin: 8px 0;">

      ${order.notes ? `
        <div style="background: #f4f4f4; padding: 6px; border-radius: 4px; font-size: 0.8rem; margin-bottom: 8px;">
          <strong>NOTA ESPECIAL COCINA:</strong><br>${order.notes}
        </div>
      ` : ''}

      <div style="text-align: right; font-size: 1rem; font-weight: bold;">
        TOTAL: $${order.total} MXN
      </div>
      <div style="text-align: right; font-size: 0.8rem; color: #555;">
        Pago: ${order.paymentMethod || 'Efectivo'} (${order.paymentStatus === 'pagado' ? 'PAGADO' : 'PENDIENTE'})
      </div>

      <div style="text-align: center; margin-top: 16px; font-size: 0.75rem;">
        ¡Buen provecho!
      </div>
    `;

    this.ticketContent.innerHTML = ticketHTML;
    this.printableReceipt.innerHTML = ticketHTML;
    this.modalTicket.classList.add('open');
  }

  // --- Modal de Nuevo Pedido Manual ---
  openNewOrderModal() {
    this.manualOrderItems = [];
    document.getElementById('formNewOrder').reset();
    this.renderMenuCatalogInModal();
    this.renderManualItemsTable();
    this.modalNewOrder.classList.add('open');
  }

  renderMenuCatalogInModal() {
    const container = document.getElementById('menuChipsContainer');
    if (!container || typeof MENU_CATALOG === 'undefined') return;

    container.innerHTML = MENU_CATALOG.map(cat => `
      <div>
        <div class="menu-category-title">${cat.category}</div>
        <div class="menu-chips-grid">
          ${cat.items.map(it => `
            <button type="button" class="menu-chip" data-name="${it.name}" data-price="${it.price}" data-desc="${it.defaultDesc}">
              <span>+ ${it.name}</span>
              <small style="opacity: 0.75;">$${it.price}</small>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.menu-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.dataset.name;
        const price = parseFloat(chip.dataset.price);
        const desc = chip.dataset.desc;

        const existing = this.manualOrderItems.find(i => i.name === name);
        if (existing) {
          existing.quantity += 1;
        } else {
          this.manualOrderItems.push({
            name,
            price,
            quantity: 1,
            options: desc
          });
        }
        this.renderManualItemsTable();
      });
    });
  }

  renderManualItemsTable() {
    const tableBody = document.getElementById('manualItemsBody');
    const totalEl = document.getElementById('manualOrderTotal');
    if (!tableBody) return;

    if (this.manualOrderItems.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 16px;">Selecciona platillos del catálogo superior para agregarlos al pedido.</td></tr>`;
      totalEl.textContent = '$0';
      return;
    }

    let grandTotal = 0;
    tableBody.innerHTML = this.manualOrderItems.map((item, idx) => {
      const subtotal = item.price * item.quantity;
      grandTotal += subtotal;
      return `
        <tr>
          <td>
            <strong>${item.name}</strong>
            <input type="text" class="form-input" style="font-size:0.75rem; padding: 2px 6px; margin-top: 4px; width: 100%;" 
                   value="${item.options || ''}" placeholder="Ej: Sin cebolla, con salsa verde..."
                   onchange="taqueriaApp.updateItemOption(${idx}, this.value)">
          </td>
          <td style="width: 100px;">
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="taqueriaApp.changeItemQty(${idx}, -1)">-</button>
              <span>${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="taqueriaApp.changeItemQty(${idx}, 1)">+</button>
            </div>
          </td>
          <td>$${subtotal}</td>
          <td>
            <button type="button" style="background:transparent; border:none; color:var(--brand-red); cursor:pointer;" onclick="taqueriaApp.removeItem(${idx})">✕</button>
          </td>
        </tr>
      `;
    }).join('');

    totalEl.textContent = `$${grandTotal}`;
  }

  changeItemQty(idx, delta) {
    if (this.manualOrderItems[idx]) {
      this.manualOrderItems[idx].quantity += delta;
      if (this.manualOrderItems[idx].quantity <= 0) {
        this.manualOrderItems.splice(idx, 1);
      }
      this.renderManualItemsTable();
    }
  }

  updateItemOption(idx, val) {
    if (this.manualOrderItems[idx]) {
      this.manualOrderItems[idx].options = val;
    }
  }

  removeItem(idx) {
    this.manualOrderItems.splice(idx, 1);
    this.renderManualItemsTable();
  }

  submitManualOrder() {
    if (this.manualOrderItems.length === 0) {
      alert("Por favor agrega al menos un platillo o taco al pedido.");
      return;
    }

    const customer = document.getElementById('manualCustomer').value.trim() || 'Cliente Mostrador';
    const orderType = document.getElementById('manualOrderType').value;
    const tableNumber = document.getElementById('manualTable').value.trim() || (orderType === 'mesa' ? '1' : null);
    const notes = document.getElementById('manualNotes').value.trim();
    const paymentMethod = document.getElementById('manualPayment').value;

    const total = this.manualOrderItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    // Generar Folio TK-XXX
    const nextNumber = 100 + this.orders.length + Math.floor(Math.random() * 20);
    const newId = `TK-${nextNumber}`;

    const newOrder = {
      id: newId,
      customer,
      orderType,
      tableNumber,
      channel: orderType === 'mesa' ? 'Salón' : (orderType === 'llevar' ? 'Para Llevar' : 'Teléfono / Domicilio'),
      createdAt: new Date().toISOString(),
      status: 'pendiente',
      items: JSON.parse(JSON.stringify(this.manualOrderItems)),
      notes,
      total,
      paymentStatus: paymentMethod === 'Efectivo' ? 'pendiente_pago' : 'pagado',
      paymentMethod
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.render();
    this.playSound('new_order');
    this.modalNewOrder.classList.remove('open');
    this.showToast(`✅ Pedido ${newId} creado con éxito y enviado a Pendientes`);
  }

  // --- Simular Entrada Automática de Pedido (Para Pruebas) ---
  simulateIncomingOrder() {
    const clients = [
      "Sofía Hernández", "Mateo Cruz", "Familia Lozano", "Repartidor Didi #108",
      "Gael Villalobos", "Mesa 9 (Oficinistas)", "Mariana Ortiz"
    ];
    const tacoCombinations = [
      [
        { quantity: 5, name: "Tacos al Pastor", price: 22, options: "Con verdura completa y salsa roja" },
        { quantity: 1, name: "Agua de Horchata 1L", price: 35, options: "Fría" }
      ],
      [
        { quantity: 3, name: "Tacos Campechanos", price: 28, options: "Con chicharrón crujiente" },
        { quantity: 2, name: "Gringas de Suadero", price: 48, options: "Con queso extra" },
        { quantity: 2, name: "Refresco 600ml", price: 28, options: "Coca Zero" }
      ],
      [
        { quantity: 4, name: "Tacos de Tripa (Dorada)", price: 26, options: "Bien doradita con limón" },
        { quantity: 1, name: "Cebollitas Cambray", price: 30, options: "Asadas" }
      ]
    ];

    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomItems = tacoCombinations[Math.floor(Math.random() * tacoCombinations.length)];
    const types = ['mesa', 'llevar', 'delivery'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const total = randomItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);

    const randomId = `TK-${Math.floor(100 + Math.random() * 899)}`;

    const simulatedOrder = {
      id: randomId,
      customer: randomClient,
      orderType: randomType,
      tableNumber: randomType === 'mesa' ? String(Math.floor(Math.random() * 10) + 1) : null,
      channel: randomType === 'mesa' ? 'Salón' : (randomType === 'llevar' ? 'Para Llevar' : 'App Digital'),
      createdAt: new Date().toISOString(),
      status: 'pendiente',
      items: randomItems,
      notes: "Pedido entrante recibido en tiempo real.",
      total,
      paymentStatus: randomType === 'delivery' ? 'pagado' : 'pendiente_pago',
      paymentMethod: randomType === 'delivery' ? 'Tarjeta' : 'Efectivo'
    };

    this.orders.unshift(simulatedOrder);
    this.saveOrders();
    this.render();
    this.playSound('new_order');

    // Efecto de resaltado visual en la tarjeta
    setTimeout(() => {
      const card = document.querySelector(`[data-order-id="${randomId}"]`);
      if (card) {
        card.classList.add('new-order-highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);

    this.showToast(`🔥 ¡Nuevo Pedido Entrante ${randomId}! (${randomClient})`);
  }

  // --- Sistema de Notificaciones Toast ---
  showToast(message, type = 'normal') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Inicializar la aplicación global
let taqueriaApp;
document.addEventListener('DOMContentLoaded', () => {
  taqueriaApp = new TaqueriaOrderManager();
});
