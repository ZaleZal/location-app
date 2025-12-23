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

    // Dapatkan lokasi dengan opsi yang lebih toleran
    navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
            enableHighAccuracy: false, // Ubah ke false untuk lebih cepat
            timeout: 30000, // Perpanjang timeout jadi 30 detik
            maximumAge: 60000 // Izinkan cache lokasi hingga 1 menit
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
    
    // Tampilkan rekomendasi berdasarkan lokasi
    displayRecommendations(latitude, longitude);
    
    showLocationInfo();

    // Tambahkan tombol untuk melihat data lokasi
    addLocationDataViewer();
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
            message = '❌ Waktu permintaan lokasi habis. Silakan coba lagi atau aktifkan GPS/WiFi Anda.';
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

// Fungsi untuk menampilkan rekomendasi berdasarkan lokasi
function displayRecommendations(lat, lng) {
    const recommendationsList = document.getElementById('recommendationsList');
    
    // Contoh rekomendasi berdasarkan lokasi
    // Dalam aplikasi nyata, ini bisa dari API backend
    const recommendations = [
        {
            title: 'Konten Lokal',
            description: 'Menampilkan berita dan informasi relevan untuk wilayah Anda'
        },
        {
            title: 'Cuaca Lokal',
            description: 'Prakiraan cuaca untuk lokasi Anda saat ini'
        },
        {
            title: 'Rekomendasi Tempat',
            description: 'Restoran, toko, dan tempat menarik di sekitar Anda'
        },
        {
            title: 'Bahasa & Mata Uang',
            description: 'Konten ditampilkan dalam bahasa dan mata uang lokal Anda'
        },
        {
            title: 'Penawaran Khusus',
            description: 'Promo dan diskon dari merchant terdekat dengan lokasi Anda'
        }
    ];

    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <strong>${rec.title}</strong>
            <span>${rec.description}</span>
        </div>
    `).join('');
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

// Fungsi untuk menambahkan tombol viewer data lokasi
function addLocationDataViewer() {
    // Cek apakah sudah ada
    if (document.getElementById('locationDataViewer')) {
        return;
    }

    const viewerSection = document.createElement('div');
    viewerSection.id = 'locationDataViewer';
    viewerSection.style.marginTop = '20px';
    viewerSection.style.padding = '20px';
    viewerSection.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    viewerSection.style.borderRadius = '15px';
    viewerSection.style.color = 'white';
    
    viewerSection.innerHTML = `
        <h3 style="margin-top: 0;">🔍 Akses Data Lokasi</h3>
        <p style="margin-bottom: 15px;">Data lokasi tersedia di berbagai tempat:</p>
        
        <div style="display: grid; gap: 10px;">
            <button onclick="showLocationInConsole()" class="data-btn">
                📋 Tampilkan di Console
            </button>
            <button onclick="copyLocationToClipboard()" class="data-btn">
                📋 Copy Data ke Clipboard
            </button>
            <button onclick="showLocationJSON()" class="data-btn">
                📄 Lihat JSON Format
            </button>
            <button onclick="sendLocationToServer()" class="data-btn">
                🚀 Simulasi Kirim ke Server
            </button>
        </div>
        
        <div id="jsonDisplay" style="display: none; margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 10px; font-family: monospace; font-size: 12px; overflow-x: auto;"></div>
    `;
    
    locationInfo.appendChild(viewerSection);
}

// Fungsi untuk menampilkan lokasi di console
function showLocationInConsole() {
    console.clear();
    console.log('🌍 ==================== DATA LOKASI USER ====================');
    console.log('📍 Variable Global (currentUserLocation):');
    console.log(currentUserLocation);
    console.log('\n💾 Data dari localStorage:');
    console.log(JSON.parse(localStorage.getItem('userLocation')));
    console.log('\n📊 Cara mengakses data:');
    console.log('- JavaScript: currentUserLocation.latitude');
    console.log('- LocalStorage: JSON.parse(localStorage.getItem("userLocation"))');
    console.log('===========================================================');
    alert('✅ Data lokasi ditampilkan di Console! Tekan F12 untuk melihat.');
}

// Fungsi untuk copy data ke clipboard
function copyLocationToClipboard() {
    const data = JSON.stringify(currentUserLocation, null, 2);
    navigator.clipboard.writeText(data).then(() => {
        alert('✅ Data lokasi berhasil di-copy ke clipboard!\n\nAnda bisa paste di text editor.');
    }).catch(err => {
        alert('❌ Gagal copy: ' + err);
    });
}

// Fungsi untuk menampilkan JSON
function showLocationJSON() {
    const jsonDisplay = document.getElementById('jsonDisplay');
    if (jsonDisplay.style.display === 'none') {
        jsonDisplay.style.display = 'block';
        jsonDisplay.innerHTML = '<pre>' + JSON.stringify(currentUserLocation, null, 2) + '</pre>';
    } else {
        jsonDisplay.style.display = 'none';
    }
}

// Fungsi simulasi kirim ke server
async function sendLocationToServer() {
    // Simulasi kirim ke server (ganti URL dengan backend Anda)
    console.log('🚀 Mengirim data ke server...');
    console.log('Data yang dikirim:', currentUserLocation);
    
    // Contoh dengan fetch (uncomment jika punya backend)
    /*
    try {
        const response = await fetch('https://your-api.com/save-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentUserLocation)
        });
        const result = await response.json();
        console.log('✅ Response dari server:', result);
        alert('✅ Data berhasil dikirim ke server!');
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Gagal kirim ke server: ' + error.message);
    }
    */
    
    // Simulasi saja
    alert('✅ Simulasi berhasil!\n\nData lokasi siap dikirim ke server.\nCek console untuk melihat data yang akan dikirim.\n\nUntuk kirim ke server sungguhan, uncomment kode di fungsi sendLocationToServer()');
}
