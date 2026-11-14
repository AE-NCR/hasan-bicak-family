const CORRECT_PASSWORD = "hasan123";

// --- KLASÖR VE FOTOĞRAF VERİLERİ ---
// Buradan istediğin gibi yeni klasörler ve fotoğraflar ekleyebilirsin!
const albumsData = [
    {
        id: 'hepsi',
        title: 'Tüm Anılar',
        icon: 'fa-layer-group',
        image: '' // Boş bırakılırsa ikon görünür
    },
    {
        id: 'aile',
        title: 'Aile Buluşması',
        icon: 'fa-users',
        photos: [
            { title: 'Büyük Aile Yemeği', desc: 'Özel gün hatırası', src: '' },
            { title: 'Bayram Kutlaması', desc: 'Ailecek çekilen fotoğraf', src: '' }
        ]
    },
    {
        id: 'tatil',
        title: 'Tatil Gezileri',
        icon: 'fa-umbrella-beach',
        photos: [
            { title: 'Yaz Tatili', desc: 'Deniz kenarı anısı', src: '' },
            { title: 'Doğa Yürüyüşü', desc: 'Hafta sonu gezisi', src: '' }
        ]
    },
    {
        id: 'nostalji',
        title: 'Eski Albümler',
        icon: 'fa-box-archive',
        photos: [
            { title: 'Eski Yıllar', desc: 'Nostaljik aile karesi', src: '' }
        ]
    }
];

// Giriş Kontrolü
function handleLogin(e) {
    e.preventDefault();

    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const cardBox = document.getElementById('cardBox');
    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');

    if (passwordInput.value === CORRECT_PASSWORD) {
        errorMessage.classList.add('hidden');
        lockScreen.classList.add('fade-exit-active');

        setTimeout(() => {
            lockScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.classList.add('fade-enter-active');
            }, 50);
        }, 400);

    } else {
        errorMessage.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();

        cardBox.classList.remove('animate-shake');
        void cardBox.offsetWidth;
        cardBox.classList.add('animate-shake');

        setTimeout(() => {
            cardBox.classList.remove('animate-shake');
        }, 500);
    }
}

// Sekmeler Arası Geçiş
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.add('hidden'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('text-white', 'bg-neutral-800', 'border', 'border-neutral-700');
        btn.classList.add('text-neutral-400');
    });

    const selectedContent = document.getElementById('sec-' + tabId);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    const selectedBtn = document.getElementById('tab-' + tabId);
    if (selectedBtn) {
        selectedBtn.classList.remove('text-neutral-400');
        selectedBtn.classList.add('text-white', 'bg-neutral-800', 'border', 'border-neutral-700');
    }
}

// Sayfayı Kilitleme
function lockPage() {
    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');

    passwordInput.value = '';
    mainContent.classList.remove('fade-enter-active');

    setTimeout(() => {
        mainContent.classList.add('hidden');
        lockScreen.classList.remove('hidden', 'fade-exit-active');
    }, 300);
}

// --- INSTAGRAM TARZI HİKAYE KLASÖRLERİNİ OLUŞTURMA ---
function renderStoryFolders() {
    const container = document.getElementById('albumStoriesContainer');
    container.innerHTML = '';

    albumsData.forEach((album, index) => {
        const storyHTML = `
            <button onclick="selectAlbum('${album.id}')" class="flex flex-col items-center gap-2 group flex-shrink-0 focus:outline-none">
                <!-- Renkli Instagram Halkası -->
                <div class="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 group-hover:scale-105 transition-transform shadow-lg">
                    <!-- İç Siyah Kenarlık ve Resim/İkon Alanı -->
                    <div class="w-full h-full bg-neutral-950 rounded-full p-[2px] flex items-center justify-center overflow-hidden">
                        <div class="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors">
                            ${album.image ? `<img src="${album.image}" class="w-full h-full object-cover rounded-full">` : `<i class="fa-solid ${album.icon} text-xl"></i>`}
                        </div>
                    </div>
                </div>
                <span class="text-xs font-medium text-neutral-300 group-hover:text-white max-w-[80px] truncate text-center">${album.title}</span>
            </button>
        `;
        container.innerHTML += storyHTML;
    });
}

// --- SEÇİLEN ALBÜMÜN FOTOĞRAFLARINI EKRANA BASMA ---
function selectAlbum(albumId) {
    const titleElem = document.getElementById('currentAlbumTitle');
    const gridElem = document.getElementById('photosGrid');
    gridElem.innerHTML = '';

    let photosToDisplay = [];
    let currentTitle = 'Tüm Fotoğraflar';

    if (albumId === 'hepsi') {
        albumsData.forEach(album => {
            if (album.photos) photosToDisplay.push(...album.photos);
        });
    } else {
        const foundAlbum = albumsData.find(a => a.id === albumId);
        if (foundAlbum) {
            currentTitle = foundAlbum.title;
            photosToDisplay = foundAlbum.photos || [];
        }
    }

    titleElem.innerHTML = `<i class="fa-solid fa-folder-open text-amber-500"></i> <span>${currentTitle}</span>`;

    if (photosToDisplay.length === 0) {
        gridElem.innerHTML = `<div class="col-span-full text-center py-12 text-neutral-500">Bu klasörde henüz fotoğraf yok.</div>`;
        return;
    }

    photosToDisplay.forEach(photo => {
        const cardHTML = `
            <div class="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group shadow-lg">
                <div class="h-48 bg-neutral-800 flex items-center justify-center relative overflow-hidden">
                    ${photo.src ? `<img src="${photo.src}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` : `<i class="fa-regular fa-image text-4xl text-neutral-600 group-hover:scale-110 transition-transform"></i>`}
                </div>
                <div class="p-4 border-t border-neutral-800">
                    <h4 class="font-semibold text-white">${photo.title}</h4>
                    <p class="text-xs text-neutral-400 mt-1">${photo.desc}</p>
                </div>
            </div>
        `;
        gridElem.innerHTML += cardHTML;
    });
}

// Sayfa yüklendiğinde klasörleri ve ilk fotoğrafları hazırla
window.addEventListener('DOMContentLoaded', () => {
    renderStoryFolders();
    selectAlbum('hepsi');
});
