# 🚀 Setup Supabase untuk Menyimpan Lokasi User

## Langkah 1: Daftar Supabase (Gratis!)

1. Buka https://supabase.com
2. Klik "Start your project"
3. Login dengan GitHub
4. Klik "New Project"
   - **Name:** location-app
   - **Database Password:** [buat password kuat, SIMPAN!]
   - **Region:** Southeast Asia (Singapore) - terdekat dengan Indonesia
   - **Pricing Plan:** Free (gratis selamanya!)
5. Tunggu ~2 menit sampai project ready

## Langkah 2: Buat Tabel di Database

1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar
2. Copy-paste SQL berikut, lalu klik **"Run"**:

```sql
-- Buat tabel untuk menyimpan lokasi user
CREATE TABLE user_locations (
  id BIGSERIAL PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  method VARCHAR(10),
  city TEXT,
  region TEXT,
  country TEXT,
  isp TEXT,
  address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Buat index untuk query cepat
CREATE INDEX idx_timestamp ON user_locations(timestamp DESC);
CREATE INDEX idx_method ON user_locations(method);

-- Enable Row Level Security (keamanan)
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua orang INSERT data (untuk demo)
CREATE POLICY "Enable insert for all users" ON user_locations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: izinkan semua orang baca data (untuk demo)
CREATE POLICY "Enable read for all users" ON user_locations
  FOR SELECT TO anon
  USING (true);

-- Tambahkan komentar
COMMENT ON TABLE user_locations IS 'Tabel untuk menyimpan data lokasi user';
```

3. Klik **"Run"** - Tabel berhasil dibuat! ✅

## Langkah 3: Dapatkan API Keys

1. Di dashboard Supabase, klik **"Settings"** (icon ⚙️) di sidebar
2. Klik **"API"**
3. **COPY** 2 nilai ini:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (key panjang)

## Langkah 4: Update File Config

Buka file `supabase-config.js` dan masukkan API keys Anda:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'; // Ganti ini
const SUPABASE_KEY = 'YOUR-ANON-KEY'; // Ganti ini
```

## Langkah 5: Test!

1. Buka `index.html` di browser
2. Klik "Dapatkan Lokasi GPS"
3. Klik tombol "🚀 Kirim ke Server"
4. Cek di Supabase:
   - Buka **"Table Editor"**
   - Pilih tabel **user_locations**
   - Data lokasi Anda akan muncul! 🎉

## 📊 Melihat Data di Supabase

Di dashboard Supabase:
- **Table Editor:** Lihat data dalam bentuk tabel
- **SQL Editor:** Query data dengan SQL
- **API Docs:** Auto-generate API documentation

## 🔐 Keamanan (Production)

Untuk production, tambahkan:
1. Authentication (user login)
2. RLS policies yang lebih ketat
3. Rate limiting
4. CORS configuration

## 💰 Limits Free Plan

- **Database:** 500 MB
- **Bandwidth:** 5 GB/bulan
- **API Requests:** Unlimited
- **Projects:** 2 project gratis

Cukup untuk ribuan lokasi user! 🚀
