# 📍 Aplikasi Lokasi User

Aplikasi web sederhana untuk mendapatkan informasi lokasi user menggunakan HTML5 Geolocation API.

## ✨ Fitur

- 📍 Mendapatkan koordinat lokasi user (latitude & longitude)
- 🎯 Menampilkan tingkat akurasi lokasi
- 🗺️ Visualisasi lokasi di peta interaktif (Leaflet.js)
- 📍 Reverse geocoding untuk mendapatkan alamat lengkap
- 🎁 Rekomendasi personalisasi berdasarkan lokasi
- 📱 Responsive design untuk mobile dan desktop
- 🔒 Privacy-first: data lokasi tidak disimpan

## 🚀 Cara Menggunakan

1. Buka file `index.html` di browser modern (Chrome, Firefox, Edge, Safari)
2. Klik tombol "Dapatkan Lokasi Saya"
3. Izinkan akses lokasi ketika browser meminta izin
4. Lihat informasi lokasi Anda beserta peta dan rekomendasi

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur aplikasi
- **CSS3**: Styling dan animasi
- **JavaScript**: Logika aplikasi dan Geolocation API
- **Leaflet.js**: Library peta interaktif
- **OpenStreetMap**: Tile provider untuk peta
- **Nominatim API**: Reverse geocoding untuk mendapatkan alamat

## 📋 Persyaratan

- Browser modern yang mendukung Geolocation API
- Koneksi internet (untuk peta dan reverse geocoding)
- HTTPS atau localhost (Geolocation API memerlukan secure context)

## 🔐 Keamanan & Privacy

- Aplikasi meminta izin user sebelum mengakses lokasi
- Data lokasi TIDAK disimpan di server
- Data hanya digunakan untuk meningkatkan user experience
- User dapat menolak akses lokasi kapan saja

## 💡 Use Cases

Aplikasi ini dapat digunakan untuk:

- ✅ Personalisasi konten berdasarkan lokasi
- ✅ Menampilkan cuaca lokal
- ✅ Rekomendasi tempat/merchant terdekat
- ✅ Pengaturan bahasa dan mata uang otomatis
- ✅ Tracking pengiriman
- ✅ Check-in lokasi
- ✅ Emergency services
- ✅ Dan banyak lagi!

## 📝 Catatan

- Geolocation API hanya bekerja di HTTPS atau localhost
- Akurasi lokasi tergantung pada perangkat dan koneksi
- GPS memberikan akurasi terbaik (~10 meter)
- WiFi/IP-based location kurang akurat (~100-1000 meter)

## 🎨 Kustomisasi

Anda dapat dengan mudah mengkustomisasi:

- Warna tema di `style.css`
- Rekomendasi di fungsi `displayRecommendations()` di `script.js`
- Gaya peta di fungsi `displayMap()` di `script.js`

## 📄 Lisensi

Free to use untuk pembelajaran dan proyek pribadi.

---

Dibuat dengan ❤️ untuk meningkatkan user experience
