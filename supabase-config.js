// ============================================
// KONFIGURASI SUPABASE
// ============================================
// PENTING: Ganti dengan kredensial Supabase Anda!
// Cara mendapatkan:
// 1. Buka https://supabase.com
// 2. Login dan buka project Anda
// 3. Settings > API
// 4. Copy Project URL dan anon public key

const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'; // Ganti dengan Project URL Anda
const SUPABASE_KEY = 'YOUR-ANON-PUBLIC-KEY'; // Ganti dengan anon public key Anda

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
        SUPABASE_KEY === 'YOUR-ANON-PUBLIC-KEY') {
        console.error('❌ SUPABASE BELUM DIKONFIGURASI!');
        console.error('📝 Buka file supabase-config.js dan masukkan kredensial Supabase Anda');
        console.error('📖 Lihat SETUP-SUPABASE.md untuk panduan lengkap');
        return false;
    }
    return true;
}

console.log('✅ Supabase config loaded');
