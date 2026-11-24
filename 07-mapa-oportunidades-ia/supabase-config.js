// =====================================================
// Configuración de Conexión a Supabase
// =====================================================

// Credenciales oficiales de tu proyecto Supabase ya configuradas:
const DEFAULT_SUPABASE_CONFIG = {
    url: 'https://qjhobxbrtwbkezfpsotb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaG9ieGJydHdia2V6ZnBzb3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MTYxNTAsImV4cCI6MjExMTA5MjE1MH0.GZBAPzOOr3SjWOM9Z4s88tEiBXtBqNynb6_wbTjDcYE'
};

// Variable global del cliente de Supabase
let supabaseClient = null;

function initSupabase(url, anonKey) {
    const targetUrl = (url || DEFAULT_SUPABASE_CONFIG.url || '').trim();
    const targetKey = (anonKey || DEFAULT_SUPABASE_CONFIG.anonKey || '').trim();

    if (!targetUrl || !targetKey) {
        return null;
    }
    
    // Normalizar URL
    let cleanUrl = targetUrl;
    if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}.supabase.co`;
    }

    try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(cleanUrl, targetKey);
            localStorage.setItem('supabase_url', cleanUrl);
            localStorage.setItem('supabase_anon_key', targetKey);
            return supabaseClient;
        } else {
            console.error('La librería @supabase/supabase-js no se ha cargado.');
            return null;
        }
    } catch (err) {
        console.error('Error al inicializar Supabase:', err);
        return null;
    }
}
