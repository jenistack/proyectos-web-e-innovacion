// ============================================================
// MAPA DE OPORTUNIDADES CON IA - LÓGICA DE APLICACIÓN
// ============================================================

// Estado global de la aplicación
const state = {
    opportunities: [],
    filteredOpportunities: [],
    cities: new Set(),
    countries: new Set(),
    categories: new Set(),
    filters: {
        search: '',
        city: '',
        country: '',
        category: '',
        sort: 'recent'
    },
    likedCache: new Set(JSON.parse(localStorage.getItem('liked_opportunities') || '[]'))
};

// Elementos del DOM
const dom = {
    // Stats
    statTotal: document.getElementById('stat-total'),
    statCities: document.getElementById('stat-cities'),
    statCountries: document.getElementById('stat-countries'),
    statLikes: document.getElementById('stat-likes'),
    resultsCount: document.getElementById('results-count'),

    // Grid & States
    grid: document.getElementById('opportunities-grid'),
    loading: document.getElementById('loading-spinner'),
    empty: document.getElementById('empty-state'),
    connectionAlert: document.getElementById('connection-alert'),
    supabaseStatusBadge: document.getElementById('supabase-status-badge'),

    // Filters
    searchInput: document.getElementById('search-input'),
    filterCity: document.getElementById('filter-city'),
    filterCountry: document.getElementById('filter-country'),
    filterCategory: document.getElementById('filter-category'),
    sortSelect: document.getElementById('sort-select'),
    btnResetFilters: document.getElementById('btn-reset-filters'),

    // Publish Modal
    btnOpenModal: document.getElementById('btn-open-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    publishModal: document.getElementById('publish-modal'),
    publishForm: document.getElementById('publish-form'),
    btnSubmitOpportunity: document.getElementById('btn-submit-opportunity'),

    // Config Modal
    btnConfigSupabase: document.getElementById('btn-config-supabase'),
    btnAlertConnect: document.getElementById('btn-alert-connect'),
    configModal: document.getElementById('config-modal'),
    btnCloseConfigModal: document.getElementById('btn-close-config-modal'),
    configForm: document.getElementById('config-form'),
    cfgSupabaseUrl: document.getElementById('cfg-supabase-url'),
    cfgSupabaseKey: document.getElementById('cfg-supabase-key'),
    btnTestConnection: document.getElementById('btn-test-connection'),
    configTestResult: document.getElementById('config-test-result'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// ============================================================
// Inicialización
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAndInitSupabase();
});

function setupEventListeners() {
    // Filtros y Búsqueda reactiva
    dom.searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value.trim().toLowerCase();
        applyFilters();
    });

    dom.filterCity.addEventListener('change', (e) => {
        state.filters.city = e.target.value;
        applyFilters();
    });

    dom.filterCountry.addEventListener('change', (e) => {
        state.filters.country = e.target.value;
        applyFilters();
    });

    dom.filterCategory.addEventListener('change', (e) => {
        state.filters.category = e.target.value;
        applyFilters();
    });

    dom.sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        applyFilters();
    });

    dom.btnResetFilters.addEventListener('click', resetFilters);

    // Modal de Publicación
    dom.btnOpenModal.addEventListener('click', openPublishModal);
    dom.btnCloseModal.addEventListener('click', closePublishModal);
    dom.btnCancelModal.addEventListener('click', closePublishModal);
    dom.publishForm.addEventListener('submit', handlePublishSubmit);

    // Modal de Configuración Supabase
    dom.btnConfigSupabase.addEventListener('click', openConfigModal);
    dom.btnAlertConnect.addEventListener('click', openConfigModal);
    dom.btnCloseConfigModal.addEventListener('click', closeConfigModal);
    dom.configForm.addEventListener('submit', handleConfigSubmit);
    dom.btnTestConnection.addEventListener('click', handleTestConnection);

    // Cerrar modales con Escape o clic fuera
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePublishModal();
            closeConfigModal();
        }
    });

    [dom.publishModal, dom.configModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// ============================================================
// Verificación e Inicialización de Supabase
// ============================================================
async function checkAndInitSupabase() {
    const savedUrl = localStorage.getItem('supabase_url') || DEFAULT_SUPABASE_CONFIG.url;
    const savedKey = localStorage.getItem('supabase_anon_key') || DEFAULT_SUPABASE_CONFIG.anonKey;

    if (savedUrl && savedKey) {
        initSupabase(savedUrl, savedKey);
        dom.supabaseStatusBadge.classList.add('connected');
        dom.connectionAlert.classList.add('hidden');
        await fetchOpportunities();
    } else {
        dom.supabaseStatusBadge.classList.remove('connected');
        dom.connectionAlert.classList.remove('hidden');
        dom.loading.classList.add('hidden');
        dom.empty.classList.remove('hidden');
        dom.resultsCount.textContent = 'Pendiente de conexión a Supabase';
    }
}

// ============================================================
// Cargar Oportunidades desde Supabase (READ)
// ============================================================
async function fetchOpportunities() {
    if (!supabaseClient) {
        showToast('Configura Supabase para sincronizar datos.', 'warning');
        return;
    }

    try {
        dom.loading.classList.remove('hidden');
        dom.empty.classList.add('hidden');
        dom.grid.innerHTML = '';

        const { data, error } = await supabaseClient
            .from('opportunities')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al consultar Supabase:', error);
            showToast('Error al leer de Supabase: ' + error.message, 'error');
            dom.loading.classList.add('hidden');
            dom.empty.classList.remove('hidden');
            return;
        }

        state.opportunities = data || [];
        populateFilterDropdowns();
        updateStats();
        applyFilters();
    } catch (err) {
        console.error('Error de red al consultar Supabase:', err);
        showToast('Error de conexión con Supabase', 'error');
    } finally {
        dom.loading.classList.add('hidden');
    }
}

// ============================================================
// Publicar Nueva Oportunidad en Supabase (INSERT)
// ============================================================
async function handlePublishSubmit(e) {
    e.preventDefault();

    if (!supabaseClient) {
        showToast('Primero debes conectar tu base de datos de Supabase', 'warning');
        openConfigModal();
        return;
    }

    const name = document.getElementById('name').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const category = document.getElementById('category').value;
    const potential = document.getElementById('potential').value;
    const problem = document.getElementById('problem').value.trim();
    const ai_solution = document.getElementById('ai_solution').value.trim();

    if (!name || !city || !country || !category || !potential || !problem || !ai_solution) {
        showToast('Por favor completa todos los campos requeridos', 'warning');
        return;
    }

    const newRecord = {
        name,
        city,
        country,
        category,
        potential,
        problem,
        ai_solution,
        likes: 0
    };

    dom.btnSubmitOpportunity.disabled = true;
    dom.btnSubmitOpportunity.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

    try {
        const { data, error } = await supabaseClient
            .from('opportunities')
            .insert([newRecord])
            .select();

        if (error) {
            console.error('Error al insertar en Supabase:', error);
            showToast('Error al publicar: ' + error.message, 'error');
            return;
        }

        showToast('¡Oportunidad publicada exitosamente en Supabase!', 'success');
        dom.publishForm.reset();
        closePublishModal();

        // Recargar la lista desde Supabase para garantizar sincronía total
        await fetchOpportunities();
    } catch (err) {
        console.error('Excepción al publicar oportunidad:', err);
        showToast('Fallo de conexión al enviar la oportunidad', 'error');
    } finally {
        dom.btnSubmitOpportunity.disabled = false;
        dom.btnSubmitOpportunity.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar en Supabase';
    }
}

// ============================================================
// Dar Like a una Oportunidad (UPDATE)
// ============================================================
async function handleLike(opportunityId, currentLikes, buttonElement) {
    if (!supabaseClient) {
        showToast('Conecta Supabase para dar likes', 'warning');
        return;
    }

    const newLikesCount = (parseInt(currentLikes, 10) || 0) + 1;

    // Feedback visual optimista
    buttonElement.classList.add('liked');
    const likeCountSpan = buttonElement.querySelector('.like-count');
    if (likeCountSpan) likeCountSpan.textContent = newLikesCount;

    try {
        const { error } = await supabaseClient
            .from('opportunities')
            .update({ likes: newLikesCount })
            .eq('id', opportunityId);

        if (error) {
            console.error('Error al actualizar like en Supabase:', error);
            showToast('No se pudo guardar el like: ' + error.message, 'error');
            // Revertir
            if (likeCountSpan) likeCountSpan.textContent = currentLikes;
            buttonElement.classList.remove('liked');
            return;
        }

        // Marcar en local para estilo visual
        state.likedCache.add(opportunityId);
        localStorage.setItem('liked_opportunities', JSON.stringify([...state.likedCache]));

        // Actualizar en el estado local y recargar stats
        const item = state.opportunities.find(o => o.id === opportunityId);
        if (item) item.likes = newLikesCount;
        updateStats();

    } catch (err) {
        console.error('Error de red al dar like:', err);
        showToast('Error al conectar con Supabase', 'error');
        if (likeCountSpan) likeCountSpan.textContent = currentLikes;
        buttonElement.classList.remove('liked');
    }
}

// ============================================================
// Renderizado y Filtros Reactivos
// ============================================================
function applyFilters() {
    let result = [...state.opportunities];

    // Filtro por término de búsqueda (nombre, problema, solución, ciudad, país)
    if (state.filters.search) {
        const q = state.filters.search;
        result = result.filter(item => 
            (item.name && item.name.toLowerCase().includes(q)) ||
            (item.problem && item.problem.toLowerCase().includes(q)) ||
            (item.ai_solution && item.ai_solution.toLowerCase().includes(q)) ||
            (item.city && item.city.toLowerCase().includes(q)) ||
            (item.country && item.country.toLowerCase().includes(q))
        );
    }

    // Filtro por Ciudad
    if (state.filters.city) {
        result = result.filter(item => item.city === state.filters.city);
    }

    // Filtro por País
    if (state.filters.country) {
        result = result.filter(item => item.country === state.filters.country);
    }

    // Filtro por Categoría
    if (state.filters.category) {
        result = result.filter(item => item.category === state.filters.category);
    }

    // Ordenamiento
    if (state.filters.sort === 'likes') {
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
        result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    state.filteredOpportunities = result;
    renderGrid(result);
}

function renderGrid(list) {
    dom.resultsCount.textContent = `Mostrando ${list.length} de ${state.opportunities.length} oportunidades`;

    if (list.length === 0) {
        dom.grid.innerHTML = '';
        dom.empty.classList.remove('hidden');
        return;
    }

    dom.empty.classList.add('hidden');
    dom.grid.innerHTML = list.map(item => createCardHTML(item)).join('');

    // Asignar listeners a los botones de like
    dom.grid.querySelectorAll('.btn-like').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.opportunity-card');
            const id = card.dataset.id;
            const currentLikes = parseInt(card.dataset.likes, 10) || 0;
            handleLike(id, currentLikes, e.currentTarget);
        });
    });
}

function createCardHTML(item) {
    const isLiked = state.likedCache.has(item.id);
    const potentialClass = (item.potential || '').toLowerCase().trim();
    const formattedDate = formatDate(item.created_at);

    return `
        <article class="opportunity-card" data-id="${item.id}" data-likes="${item.likes || 0}">
            <div>
                <div class="card-top">
                    <span class="location-tag">
                        <i class="fa-solid fa-location-dot"></i>
                        ${escapeHTML(item.city)}, ${escapeHTML(item.country)}
                    </span>
                    <span class="badge-potential ${potentialClass}">
                        ${escapeHTML(item.potential)}
                    </span>
                </div>

                <h3 class="card-title">${escapeHTML(item.name)}</h3>
                <span class="badge-category"><i class="fa-solid fa-tag"></i> ${escapeHTML(item.category)}</span>

                <div class="section-block">
                    <div class="section-block-title">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #f87171;"></i> Problema Detectado
                    </div>
                    <div class="problem-box">
                        ${escapeHTML(item.problem)}
                    </div>
                </div>

                <div class="section-block">
                    <div class="section-block-title">
                        <i class="fa-solid fa-wand-magic-sparkles" style="color: #818cf8;"></i> Solución con IA
                    </div>
                    <div class="ai-solution-box">
                        ${escapeHTML(item.ai_solution)}
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <span class="card-date"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
                <button class="btn-like ${isLiked ? 'liked' : ''}" title="Votar esta oportunidad">
                    <i class="fa-solid fa-heart"></i>
                    <span class="like-count">${item.likes || 0}</span>
                </button>
            </div>
        </article>
    `;
}

function populateFilterDropdowns() {
    const cities = new Set();
    const countries = new Set();

    state.opportunities.forEach(item => {
        if (item.city) cities.add(item.city.trim());
        if (item.country) countries.add(item.country.trim());
    });

    // Rellenar selector de Ciudades
    const currentCity = dom.filterCity.value;
    dom.filterCity.innerHTML = '<option value="">Todas las ciudades</option>' +
        Array.from(cities).sort().map(c => `<option value="${escapeHTML(c)}" ${c === currentCity ? 'selected' : ''}>${escapeHTML(c)}</option>`).join('');

    // Rellenar selector de Países
    const currentCountry = dom.filterCountry.value;
    dom.filterCountry.innerHTML = '<option value="">Todos los países</option>' +
        Array.from(countries).sort().map(co => `<option value="${escapeHTML(co)}" ${co === currentCountry ? 'selected' : ''}>${escapeHTML(co)}</option>`).join('');
}

function updateStats() {
    const total = state.opportunities.length;
    const citiesCount = new Set(state.opportunities.map(o => o.city && o.city.trim()).filter(Boolean)).size;
    const countriesCount = new Set(state.opportunities.map(o => o.country && o.country.trim()).filter(Boolean)).size;
    const totalLikes = state.opportunities.reduce((acc, curr) => acc + (parseInt(curr.likes, 10) || 0), 0);

    dom.statTotal.textContent = total;
    dom.statCities.textContent = citiesCount;
    dom.statCountries.textContent = countriesCount;
    dom.statLikes.textContent = totalLikes;
}

function resetFilters() {
    state.filters.search = '';
    state.filters.city = '';
    state.filters.country = '';
    state.filters.category = '';
    state.filters.sort = 'recent';

    dom.searchInput.value = '';
    dom.filterCity.value = '';
    dom.filterCountry.value = '';
    dom.filterCategory.value = '';
    dom.sortSelect.value = 'recent';

    applyFilters();
}

// ============================================================
// Modales y Configuración
// ============================================================
function openPublishModal() {
    dom.publishModal.classList.remove('hidden');
    document.getElementById('name').focus();
}

function closePublishModal() {
    dom.publishModal.classList.add('hidden');
}

function openConfigModal() {
    dom.cfgSupabaseUrl.value = localStorage.getItem('supabase_url') || DEFAULT_SUPABASE_CONFIG.url || '';
    dom.cfgSupabaseKey.value = localStorage.getItem('supabase_anon_key') || DEFAULT_SUPABASE_CONFIG.anonKey || '';
    dom.configTestResult.className = 'config-status-box';
    dom.configTestResult.style.display = 'none';
    dom.configModal.classList.remove('hidden');
}

function closeConfigModal() {
    dom.configModal.classList.add('hidden');
}

async function handleConfigSubmit(e) {
    e.preventDefault();
    const url = dom.cfgSupabaseUrl.value.trim();
    const key = dom.cfgSupabaseKey.value.trim();

    const client = initSupabase(url, key);
    if (!client) {
        showToast('No se pudo inicializar Supabase. Verifica los datos.', 'error');
        return;
    }

    closeConfigModal();
    dom.supabaseStatusBadge.classList.add('connected');
    dom.connectionAlert.classList.add('hidden');
    showToast('Credenciales guardadas exitosamente', 'success');
    await fetchOpportunities();
}

async function handleTestConnection() {
    const url = dom.cfgSupabaseUrl.value.trim();
    const key = dom.cfgSupabaseKey.value.trim();

    if (!url || !key) {
        showConfigStatus('Por favor ingresa la URL y la Anon Key de Supabase.', 'error');
        return;
    }

    dom.btnTestConnection.disabled = true;
    dom.btnTestConnection.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Probando...';

    try {
        const testClient = window.supabase.createClient(url, key);
        const { data, error } = await testClient.from('opportunities').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.code === '42P01') {
                showConfigStatus('Conexión con Supabase exitosa, pero la tabla "opportunities" aún no existe. Cópiala desde el script SQL de abajo.', 'error');
            } else {
                showConfigStatus('Error al conectar: ' + error.message, 'error');
            }
        } else {
            showConfigStatus('¡Conexión exitosa! La tabla "opportunities" está lista para usar.', 'success');
        }
    } catch (err) {
        showConfigStatus('Fallo de red al conectar con Supabase: ' + err.message, 'error');
    } finally {
        dom.btnTestConnection.disabled = false;
        dom.btnTestConnection.innerHTML = '<i class="fa-solid fa-vial"></i> Probar Conexión';
    }
}

function showConfigStatus(message, type) {
    dom.configTestResult.textContent = message;
    dom.configTestResult.className = `config-status-box ${type}`;
    dom.configTestResult.style.display = 'block';
}

// ============================================================
// Utilidades
// ============================================================
function showToast(message, type = 'success') {
    dom.toastMessage.textContent = message;
    const icon = dom.toast.querySelector('.toast-icon');

    if (type === 'error') {
        icon.className = 'fa-solid fa-circle-exclamation toast-icon';
        icon.style.color = 'var(--danger)';
    } else if (type === 'warning') {
        icon.className = 'fa-solid fa-triangle-exclamation toast-icon';
        icon.style.color = 'var(--warning)';
    } else {
        icon.className = 'fa-solid fa-check-circle toast-icon';
        icon.style.color = 'var(--success)';
    }

    dom.toast.classList.remove('hidden');
    clearTimeout(dom.toastTimeout);
    dom.toastTimeout = setTimeout(() => {
        dom.toast.classList.add('hidden');
    }, 4000);
}

function formatDate(dateString) {
    if (!dateString) return 'Reciente';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return 'Reciente';
    }
}

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
