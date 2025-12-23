// Variabel global
let map;
let marker;
let currentUserLocation = null; // Menyimpan lokasi user saat ini

// Elemen DOM
const getLocationBtn = document.getElementById('getLocationBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const locationInfo = document.getElementById('locationInfo');

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplikasi dimuat!');
    console.log('Tombol:', getLocationBtn);
    console.log('Loading:', loadingIndicator);
    console.log('Error:', errorMessage);
    console.log('LocationInfo:', locationInfo);
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getUserLocation);
        console.log('✅ Event listener terpasang!');
    } else {
        console.error('❌ Tombol tidak ditemukan!');
    }
});

// Fungsi untuk mendapatkan lokasi user
function getUserLocation() {
    console.log('🔍 Meminta lokasi...');
    
    // Cek apakah browser mendukung geolocation
    if (!navigator.geolocation) {
        showError('Browser Anda tidak mendukung Geolocation API');
        return;
    }

    // Reset tampilan
    hideError();
    hideLocationInfo();
    showLoading();

    console.log('⏳ Menunggu izin lokasi dari user...');

    // Dapatkan lokasi dengan opsi untuk mobile
    navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
            enableHighAccuracy: true, // Gunakan GPS untuk akurasi tinggi (penting untuk mobile!)
            timeout: 60000, // 60 detik - mobile butuh waktu lebih lama
            maximumAge: 0 // Selalu minta lokasi baru, jangan pakai cache
        }
    );
}

// Fungsi ketika berhasil mendapatkan lokasi
function handleSuccess(position) {
    console.log('✅ Lokasi berhasil didapat:', position);
    hideLoading();
    
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    console.log('📍 Koordinat:', latitude, longitude, 'Akurasi:', accuracy);

    // Simpan lokasi ke variable global
    currentUserLocation = {
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        timestamp: new Date().toISOString(),
        method: 'GPS'
    };

    // Simpan ke localStorage
    localStorage.setItem('userLocation', JSON.stringify(currentUserLocation));
    console.log('💾 Lokasi disimpan ke localStorage dan variable global!');
    console.log('📦 Data lokasi:', currentUserLocation);

    // Tampilkan informasi
    displayLocationInfo(latitude, longitude, accuracy);
    
    // Dapatkan alamat dari koordinat
    getAddressFromCoordinates(latitude, longitude);
    
    // Tampilkan peta dengan akurasi
    displayMap(latitude, longitude, accuracy);
    
    showLocationInfo();
}

// Fungsi ketika gagal mendapatkan lokasi
function handleError(error) {
    hideLoading();
    
    let message = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = '❌ Anda menolak permintaan untuk mendapatkan lokasi. Silakan izinkan akses lokasi di pengaturan browser Anda.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = '❌ Informasi lokasi tidak tersedia. Pastikan GPS/WiFi Anda aktif.';
            break;
        case error.TIMEOUT:
            message = '❌ Waktu permintaan lokasi habis. GPS membutuhkan waktu lebih lama di HP.\n\n📱 Tips untuk HP:\n1. Pastikan GPS aktif di pengaturan\n2. Tunggu 10-30 detik\n3. Jika masih gagal, coba kembali atau gunakan WiFi\n4. Atau gunakan tombol "Lokasi IP" di bawah (kurang akurat)';
            break;
        default:
            message = '❌ Terjadi kesalahan yang tidak diketahui: ' + error.message;
            break;
    }
    
    showError(message);
    
    // Tambahkan tombol coba lagi dan fallback
    const errorDiv = document.createElement('div');
    errorDiv.style.marginTop = '15px';
    errorDiv.style.display = 'flex';
    errorDiv.style.gap = '10px';
    errorDiv.style.justifyContent = 'center';
    errorDiv.style.flexWrap = 'wrap';
    
    const retryButton = document.createElement('button');
    retryButton.textContent = '🔄 Coba Lagi';
    retryButton.className = 'btn-primary';
    retryButton.onclick = getUserLocation;
    
    const fallbackButton = document.createElement('button');
    fallbackButton.textContent = '🌐 Gunakan Lokasi IP (Tidak Akurat)';
    fallbackButton.className = 'btn-primary';
    fallbackButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    fallbackButton.style.fontSize = '0.9em';
    fallbackButton.onclick = getLocationByIP;
    
    errorDiv.appendChild(retryButton);
    errorDiv.appendChild(fallbackButton);
    
    if (!errorMessage.querySelector('button')) {
        errorMessage.appendChild(errorDiv);
    }
}

// Fungsi untuk mendapatkan lokasi berdasarkan IP (fallback)
async function getLocationByIP() {
    hideError();
    showLoading();
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
            hideLoading();
            const lat = data.latitude;
            const lng = data.longitude;
            
            // Tampilkan informasi dengan catatan bahwa ini dari IP
            document.getElementById('latitude').textContent = lat.toFixed(6);
            document.getElementById('longitude').textContent = lng.toFixed(6);
            document.getElementById('accuracy').textContent = '±1000-5000 meter (IP-based)';
            document.getElementById('address').textContent = `${data.city}, ${data.region}, ${data.country_name}`;
            
            // Tampilkan peta
            displayMap(lat, lng, 5000); // Default 5km untuk IP
            
            // Tampilkan rekomendasi
            displayRecommendations(lat, lng);
            
            // Simpan lokasi (dari IP)
            currentUserLocation = {
                latitude: lat,
                longitude: lng,
                accuracy: 5000,
                timestamp: new Date().toISOString(),
                method: 'IP',
                city: data.city,
                region: data.region,
                country: data.country_name,
                isp: data.org
            };
            localStorage.setItem('userLocation', JSON.stringify(currentUserLocation));
            console.log('💾 Lokasi IP disimpan:', currentUserLocation);
            
            showLocationInfo();
            
            // Tambahkan tombol untuk melihat data lokasi
            addLocationDataViewer();
            
            // Tampilkan peringatan
            const warning = document.createElement('div');
            warning.style.background = '#fee';
            warning.style.border = '2px solid #fcc';
            warning.style.color = '#c33';
            warning.style.padding = '20px';
            warning.style.borderRadius = '10px';
            warning.style.marginBottom = '20px';
            warning.innerHTML = `
                <strong>⚠️ PERHATIAN - Lokasi Tidak Akurat!</strong><br><br>
                Lokasi ini berdasarkan <strong>alamat IP Anda</strong> yang menunjukkan lokasi <strong>server ISP/Provider Internet</strong> Anda, 
                bukan lokasi fisik Anda yang sebenarnya.<br><br>
                📍 <strong>Lokasi asli Anda:</strong> ${data.city}, ${data.region}<br>
                🏢 <strong>ISP Anda:</strong> ${data.org}<br><br>
                <strong>Untuk lokasi yang akurat (±10-100 meter), gunakan tombol "Dapatkan Lokasi GPS" dan izinkan akses lokasi.</strong>
            `;
            
            locationInfo.insertBefore(warning, locationInfo.firstChild);
        } else {
            throw new Error('Data lokasi tidak tersedia');
        }
    } catch (error) {
        hideLoading();
        showError('❌ Gagal mendapatkan lokasi dari IP. Silakan coba lagi atau aktifkan GPS.');
        console.error('IP geolocation error:', error);
    }
}

// Fungsi untuk menampilkan informasi lokasi
function displayLocationInfo(lat, lng, accuracy) {
    document.getElementById('latitude').textContent = lat.toFixed(6);
    document.getElementById('longitude').textContent = lng.toFixed(6);
    document.getElementById('accuracy').textContent = `±${Math.round(accuracy)} meter`;
}

// Fungsi untuk mendapatkan alamat dari koordinat (Reverse Geocoding)
async function getAddressFromCoordinates(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
            document.getElementById('address').textContent = data.display_name;
        } else {
            document.getElementById('address').textContent = 'Alamat tidak ditemukan';
        }
    } catch (error) {
        document.getElementById('address').textContent = 'Gagal mendapatkan alamat';
        console.error('Error getting address:', error);
    }
}

// Fungsi untuk menampilkan peta
function displayMap(lat, lng, accuracyValue) {
    console.log('🗺️ Menampilkan peta - Lat:', lat, 'Lng:', lng, 'Accuracy:', accuracyValue);
    
    // Hapus peta lama jika ada
    if (map) {
        map.remove();
    }

    // Buat peta baru
    map = L.map('map').setView([lat, lng], 15);

    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Tambahkan marker
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>Lokasi Anda</b><br>Lat: ' + lat.toFixed(6) + '<br>Lng: ' + lng.toFixed(6))
        .openPopup();

    // Tambahkan circle untuk menunjukkan akurasi
    // Pastikan accuracyValue adalah angka yang valid
    if (accuracyValue && !isNaN(accuracyValue) && accuracyValue > 0) {
        L.circle([lat, lng], {
            color: '#667eea',
            fillColor: '#667eea',
            fillOpacity: 0.2,
            radius: accuracyValue
        }).addTo(map);
        console.log('✅ Circle ditambahkan dengan radius:', accuracyValue);
    } else {
        console.warn('⚠️ Accuracy tidak valid, skip circle');
    }
}

// Fungsi helper untuk menampilkan/menyembunyikan elemen
function showLoading() {
    console.log('⏳ Menampilkan loading...');
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    console.log('✅ Menyembunyikan loading...');
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    console.error('❌ Error:', message);
    errorMessage.innerHTML = message; // Ubah ke innerHTML untuk support HTML
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.innerHTML = ''; // Bersihkan konten
}

function showLocationInfo() {
    console.log('📍 Menampilkan informasi lokasi...');
    locationInfo.classList.remove('hidden');
}

function hideLocationInfo() {
    locationInfo.classList.add('hidden');
}

// Fungsi kirim ke server
async function sendLocationToServer(event) {
    // Validasi konfigurasi Supabase
    if (!validateSupabaseConfig()) {
        alert('❌ Supabase belum dikonfigurasi!\n\nSilakan buka file supabase-config.js dan masukkan kredensial Supabase Anda.\n\nLihat SETUP-SUPABASE.md untuk panduan lengkap.');
        return;
    }

    if (!currentUserLocation) {
        alert('❌ Tidak ada data lokasi untuk dikirim!');
        return;
    }

    console.log('🚀 Mengirim data ke Supabase PostgreSQL...');
    console.log('📦 Data yang dikirim:', currentUserLocation);

    try {
        // Tampilkan loading
        let originalText = '🚀 Simulasi Kirim ke Server';
        let buttonElement = null;
        
        if (event && event.target) {
            buttonElement = event.target;
            originalText = buttonElement.textContent;
            buttonElement.textContent = '⏳ Mengirim...';
            buttonElement.disabled = true;
        }

        // Siapkan data untuk dikirim
        const dataToSend = {
            latitude: currentUserLocation.latitude,
            longitude: currentUserLocation.longitude,
            accuracy: currentUserLocation.accuracy,
            method: currentUserLocation.method || 'GPS',
            city: currentUserLocation.city || null,
            region: currentUserLocation.region || null,
            country: currentUserLocation.country || null,
            isp: currentUserLocation.isp || null,
            address: document.getElementById('address').textContent || null,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        console.log('📤 Mengirim ke Supabase:', dataToSend);

        // Kirim ke Supabase
        const result = await supabaseFetch('/user_locations', {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        });

        console.log('✅ Response dari Supabase:', result);

        // Kembalikan tombol
        if (buttonElement) {
            buttonElement.textContent = originalText;
            buttonElement.disabled = false;
        }

        // Tampilkan success message
        alert(`oke nanti kita ketemu di Taman Maluku`);

        // Tampilkan konfirmasi di halaman
        const successDiv = document.createElement('div');
        successDiv.style.background = '#d4edda';
        successDiv.style.border = '2px solid #c3e6cb';
        successDiv.style.color = '#155724';
        successDiv.style.padding = '15px';
        successDiv.style.borderRadius = '10px';
        successDiv.style.marginTop = '15px';
        successDiv.innerHTML = `
            <strong>✅ Data Berhasil Disimpan!</strong><br>
            <small>Database ID: ${result[0].id} | ${new Date(result[0].timestamp).toLocaleString('id-ID')}</small>
        `;

        const viewer = document.getElementById('locationDataViewer');
        if (viewer && !viewer.querySelector('.success-message')) {
            successDiv.className = 'success-message';
            viewer.appendChild(successDiv);
            
            // Hapus setelah 5 detik
            setTimeout(() => successDiv.remove(), 5000);
        }

    } catch (error) {
        console.error('❌ Error saat kirim ke server:', error);
        
        // Kembalikan tombol jika error
        if (buttonElement) {
            buttonElement.textContent = originalText;
            buttonElement.disabled = false;
        }

        // Tampilkan error yang lebih informatif
        let errorMessage = 'Lokasinya aktifin dulu oss, biar bisa ketemu nanti.\n\n';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Kemungkinan masalah:\n' +
                            '\n' +
                            'Masalah jaringan\n\n' +
                            '';
        } else {
            errorMessage += 'Error: ' + error.message + '\n\n' +
                          'Cek console (F12) untuk detail lengkap.';
        }
        
        alert(errorMessage);
    }
}
