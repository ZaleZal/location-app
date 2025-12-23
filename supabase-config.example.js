// ============================================
// KONFIGURASI SUPABASE - EXAMPLE FILE
// ============================================
// CARA SETUP:
// 1. Rename file ini jadi: supabase-config.js
// 2. Ganti nilai di bawah dengan kredensial Supabase Anda
// 3. JANGAN commit file supabase-config.js ke Git!

const SUPABASE_URL = 'https://txhetapttfseiybnorgma.supabase.co'; // Ganti dengan Project URL Anda
const SUPABASE_KEY = 'sb_publishable_CaU019kibWMtOwhSao2K7A_PFt0fgjPYOUR-PUBLISHABLE-KEY-HERE'; // Ganti dengan Publishable Key Anda

// ============================================
// JANGAN EDIT DI BAWAH INI
// ============================================

// Fungsi helper untuk fetch ke Supabase
async function supabaseFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Supabase error: ${error}`);
    }

    return response.json();
}

// Validasi konfigurasi
function validateSupabaseConfig() {
    if (SUPABASE_URL === 'https://YOUR-PROJECT.supabase.co' || 
        SUPABASE_KEY === 'YOUR-PUBLISHABLE-KEY-HERE') {
        console.error('❌ SUPABASE BELUM DIKONFIGURASI!');
        console.error('📝 Buka file supabase-config.js dan masukkan kredensial Supabase Anda');
        console.error('📖 Lihat SETUP-SUPABASE.md untuk panduan lengkap');
        return false;
    }
    return true;
}

console.log('✅ Supabase config loaded');
