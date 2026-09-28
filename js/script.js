// ===================== MÚSICA PERSISTENTE ENTRE PÁGINAS =====================
const audio = new Audio('assets/music/die-for-you-instrumental.mp3');
audio.loop = true;
audio.volume = 0.45;

// Elementos
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

// ==================== FUNÇÕES DE CONTROLE ====================

// Salvar estado atual da música
function saveMusicState() {
    localStorage.setItem('musicPlaying', isPlaying);
    localStorage.setItem('musicCurrentTime', audio.currentTime);
    localStorage.setItem('musicVolume', audio.volume);
}

// Carregar estado da música
function loadMusicState() {
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicCurrentTime')) || 0;
    const savedVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.45;

    audio.volume = savedVolume;
    
    if (savedTime > 0) {
        audio.currentTime = savedTime;
    }

    if (wasPlaying) {
        audio.play().catch(() => {});
        isPlaying = true;
        if (musicBtn) musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// ==================== EVENTOS ====================

if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audio.play().catch(err => {
                console.log("Reprodução bloqueada:", err);
            });
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
        saveMusicState();
    });
}

// Salvar estado quando o usuário sair da página
window.addEventListener('beforeunload', saveMusicState);

// Tentar tocar automaticamente ao carregar
window.addEventListener('load', () => {
    loadMusicState();
    
    setTimeout(() => {
        if (isPlaying) {
            audio.play().catch(() => {});
        }
    }, 800);
});

// Atualizar o tempo salvo periodicamente
setInterval(() => {
    if (isPlaying) {
        saveMusicState();
    }
}, 3000);

// ===================== CONTAGEM REGRESSIVA =====================
// Antes do casamento: "Casaremos em:" (contagem regressiva)
// Depois do casamento: "Casados há:" (tempo que já passou)

// Data e hora do casamento (-03:00 = horário de Brasília, igual para todos os visitantes)
const WEDDING_DATE = new Date("2026-11-22T16:00:00-03:00").getTime();

function buildCountdownHTML(totalMs) {
    const days    = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    const item = (value, singular, plural) => `
        <div class="countdown-item">
            <div class="number">${value}</div>
            <div class="label">${value === 1 ? singular : plural}</div>
        </div>`;

    return item(days, "Dia", "Dias")
         + item(hours, "Hora", "Horas")
         + item(minutes, "Minuto", "Minutos")
         + item(seconds, "Segundo", "Segundos");
}

function updateCountdown() {
    const container = document.getElementById('countdown-container');
    const title = document.getElementById('countdown-title');

    // Só executa se o elemento existir na página atual
    if (!container) return;

    const distance = WEDDING_DATE - Date.now();

    if (distance >= 0) {
        // Ainda vai casar
        if (title) title.textContent = "Contando os dias...";
        container.innerHTML = buildCountdownHTML(distance);
    } else {
        // Já casaram: mostra há quanto tempo
        if (title) title.textContent = "Casados há:";
        container.innerHTML = buildCountdownHTML(Math.abs(distance));
    }
}

// Executa apenas se o elemento existir
if (document.getElementById('countdown-container')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===================== NAVBAR SCROLL =====================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

function irPara(pagina) {
    const preloader = document.createElement('iframe');
    preloader.src = 'preloader.html';
    preloader.style.position = 'fixed';
    preloader.style.top = '0';
    preloader.style.left = '0';
    preloader.style.width = '100%';
    preloader.style.height = '100%';
    preloader.style.border = 'none';
    preloader.style.zIndex = '99999';
    document.body.appendChild(preloader);
    
    setTimeout(() => {
        window.location.href = pagina;
    }, 1800);
}

// ===================== SALVAR NO CALENDÁRIO =====================
function addToCalendar() {
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Casamento José e Noemy")}&dates=20261122T160000/20261122T200000&details=${encodeURIComponent("O grande dia! 💍")}&location=${encodeURIComponent("Espaço dois Irmãos, R. Osmílton Teixeira, 1130 - Chácara Recreio Alvorada, Hortolândia - SP, 13183-751")}`;
    
    window.open(url, '_blank');
}

function abrirMapa() {
    window.open(
        "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzc2NmowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=br&sa=X&geocode=KbXO_a1JvMiUMdtUv4VhxQz9&daddr=R.+Osm%C3%ADlton+Teixeira,+1130+-+Ch%C3%A1cara+Recreio+Alvorada,+Hortol%C3%A2ndia+-+SP,+13183-751",
        '_blank'
    );
}
// Garante que o menu sempre fique full screen na home
const collapseEl = document.getElementById('navbarNav');

collapseEl.addEventListener('shown.bs.collapse', () => {
    collapseEl.style.height = '100vh';
    collapseEl.style.height = '100dvh';
    collapseEl.style.maxHeight = 'none';
});