// ============================================
// DADOS
// ============================================
const servicesData = [
    { name: 'Carteira Estudantil', category: 'Destaques', icon: 'fa-id-card', desc: 'Solicite sua carteira de estudante municipal' },
    { name: 'Credpop Xexéu', category: 'Destaques', icon: 'fa-hand-holding-usd', desc: 'Programa de microcrédito popular' },
    { name: 'Academia Xexéu', category: 'Destaques', icon: 'fa-dumbbell', desc: 'Academia municipal gratuita' },
    { name: 'Saúde Xexéu', category: 'Destaques', icon: 'fa-laptop-medical', desc: 'Serviços de saúde municipal' },
    { name: 'Biblioteca', category: 'Destaques', icon: 'fa-book', desc: 'Biblioteca Municipal de Xexéu' },
    { name: 'IPTU Xexéu', category: 'Serviços', icon: 'fa-file-invoice-dollar', desc: 'Imposto Predial e Territorial Urbano' },
    { name: 'Iluminação Pública', category: 'Serviços', icon: 'fa-lightbulb', desc: 'Solicite reparos na iluminação' },
    { name: 'Poda e Limpeza', category: 'Serviços', icon: 'fa-tree', desc: 'Serviços de poda e limpeza urbana' },
    { name: 'Sinalização Urbana', category: 'Serviços', icon: 'fa-road', desc: 'Manutenção de sinalização' },
    { name: 'Transparência', category: 'Institucional', icon: 'fa-chart-line', desc: 'Portal da Transparência Municipal' },
    { name: 'Ouvidoria', category: 'Institucional', icon: 'fa-headset', desc: 'Fale com a Ouvidoria Municipal' },
    { name: 'Notícias', category: 'Institucional', icon: 'fa-newspaper', desc: 'Últimas notícias de Xexéu' }
];

const eventsData = [
    { title: 'Festa de São João', date: '2024-06-24', time: '19:00', location: 'Praça Central', category: 'cultural' },
    { title: 'Campeonato de Futebol', date: '2024-06-15', time: '09:00', location: 'Estádio Municipal', category: 'esportivo' },
    { title: 'Festa da Padroeira', date: '2024-07-16', time: '18:00', location: 'Igreja Matriz', category: 'religioso' },
    { title: 'Feira de Artesanato', date: '2024-06-08', time: '14:00', location: 'Centro de Convenções', category: 'cultural' },
    { title: 'Corrida da Cidade', date: '2024-06-30', time: '07:00', location: 'Avenida Principal', category: 'esportivo' },
    { title: 'Festival Gastronômico', date: '2024-07-06', time: '12:00', location: 'Praça de Alimentação', category: 'gastronomico' },
    { title: 'Cavalgada', date: '2024-07-20', time: '08:00', location: 'Parque de Exposições', category: 'cultural' },
    { title: 'Show de Prêmios', date: '2024-07-27', time: '20:00', location: 'Ginásio Municipal', category: 'cultural' }
];

let currentUser = null;
let weatherData = null;

// ============================================
// CLIMA
// ============================================
function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1) return '🌤️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌧️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
}

function getWeatherDesc(code) {
    if (code === 0) return 'Céu limpo';
    if (code === 1) return 'Parcialmente limpo';
    if (code === 2) return 'Parcialmente nublado';
    if (code === 3) return 'Nublado';
    if (code >= 45 && code <= 48) return 'Neblina';
    if (code >= 51 && code <= 55) return 'Garoa';
    if (code >= 61 && code <= 65) return 'Chuva';
    if (code >= 71 && code <= 77) return 'Neve';
    if (code >= 80 && code <= 82) return 'Pancadas de chuva';
    if (code >= 85 && code <= 86) return 'Neve';
    if (code >= 95) return 'Tempestade';
    return 'Indisponível';
}

async function fetchWeather() {
    try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-8.8083&longitude=-35.6258&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/Recife&forecast_days=7');
        weatherData = await r.json();
        updateWeatherFloating();
    } catch (e) {
        console.error('Erro clima:', e);
    }
}

function updateWeatherFloating() {
    if (!weatherData) return;
    const c = weatherData.current;
    const d = weatherData.daily;
    
    document.getElementById('floatingTemp').textContent = Math.round(c.temperature_2m) + '°';
    document.getElementById('weatherIcon').textContent = getWeatherIcon(c.weather_code);
    document.getElementById('expHumidity').textContent = c.relative_humidity_2m + '%';
    document.getElementById('expWind').textContent = Math.round(c.wind_speed_10m) + ' km/h';
    document.getElementById('expFeels').textContent = Math.round(c.apparent_temperature) + '°';
    document.getElementById('expHL').textContent = Math.round(d.temperature_2m_max[0]) + '° / ' + Math.round(d.temperature_2m_min[0]) + '°';
    
    const sb = document.getElementById('weatherStatus');
    const t = c.temperature_2m;
    sb.classList.remove('status-good', 'status-moderate', 'status-bad');
    if (t >= 20 && t <= 30) {
        sb.classList.add('status-good');
        sb.textContent = 'AGRADÁVEL';
    } else if (t > 30 || t < 15) {
        sb.classList.add('status-moderate');
        sb.textContent = 'MODERADO';
    } else {
        sb.classList.add('status-bad');
        sb.textContent = 'FRIO';
    }
}

function toggleWeatherModal() {
    const m = document.getElementById('weatherModal');
    if (m.style.display === 'flex') {
        m.style.display = 'none';
    } else {
        updateWeatherModalContent();
        m.style.display = 'flex';
    }
}

function updateWeatherModalContent() {
    if (!weatherData) return;
    const c = weatherData.current;
    const d = weatherData.daily;
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const now = new Date();
    let w = '';
    for (let i = 1; i < 7; i++) {
        const dt = new Date(now);
        dt.setDate(dt.getDate() + i);
        w += `<div class="daily-item"><span class="daily-day">${days[dt.getDay()]}</span><div class="daily-temps"><span class="daily-low">${Math.round(d.temperature_2m_min[i])}°</span><span class="daily-high">${Math.round(d.temperature_2m_max[i])}°</span></div></div>`;
    }
    document.getElementById('weatherModalContent').innerHTML = `
        <div class="weather-main-info">
            <div class="weather-main-icon">${getWeatherIcon(c.weather_code)}</div>
            <div class="weather-main-temp">${Math.round(c.temperature_2m)}°C</div>
            <div class="weather-main-desc">${getWeatherDesc(c.weather_code)}</div>
            <p style="color:#6b7280;margin-top:4px;">Xexéu, Pernambuco</p>
        </div>
        <div class="weather-details-grid">
            <div class="weather-detail-item"><div class="weather-detail-icon" style="background:#eff6ff;color:#2563eb;"><i class="fas fa-tint"></i></div><div class="weather-detail-info"><span class="weather-detail-label">Umidade</span><span class="weather-detail-value">${c.relative_humidity_2m}%</span></div></div>
            <div class="weather-detail-item"><div class="weather-detail-icon" style="background:#fef3c7;color:#d97706;"><i class="fas fa-wind"></i></div><div class="weather-detail-info"><span class="weather-detail-label">Vento</span><span class="weather-detail-value">${Math.round(c.wind_speed_10m)} km/h</span></div></div>
            <div class="weather-detail-item"><div class="weather-detail-icon" style="background:#dcfce7;color:#16a34a;"><i class="fas fa-temperature-high"></i></div><div class="weather-detail-info"><span class="weather-detail-label">Sensação</span><span class="weather-detail-value">${Math.round(c.apparent_temperature)}°C</span></div></div>
            <div class="weather-detail-item"><div class="weather-detail-icon" style="background:#f3e8ff;color:#9333ea;"><i class="fas fa-arrows-up-down"></i></div><div class="weather-detail-info"><span class="weather-detail-label">Máx / Mín</span><span class="weather-detail-value">${Math.round(d.temperature_2m_max[0])}° / ${Math.round(d.temperature_2m_min[0])}°</span></div></div>
        </div>
        <div class="weather-weekly"><h3>Próximos Dias</h3>${w}</div>`;
}

fetchWeather();
setInterval(fetchWeather, 20 * 60 * 1000);

function updateWeatherVisibility() {
    const w = document.getElementById('weatherFloating');
    const h = document.getElementById('homePage');
    if (w && h) w.style.display = h.style.display === 'none' ? 'none' : 'block';
}

// ============================================
// AUTENTICAÇÃO
// ============================================
function loadUser() {
    const u = localStorage.getItem('conectaXexeuUser');
    if (u) { currentUser = JSON.parse(u); updateUIForLoggedUser(); }
}

function saveUser(u) {
    currentUser = u;
    localStorage.setItem('conectaXexeuUser', JSON.stringify(u));
    updateUIForLoggedUser();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('conectaXexeuUser');
    updateUIForLoggedUser();
    showToast('👋 Você saiu da sua conta');
}

function updateUIForLoggedUser() {
    const pb = document.getElementById('profileNavBtn');
    const mp = document.getElementById('mobilePerfil');
    if (currentUser) {
        if (pb) pb.innerHTML = `<i class="fas fa-user-check" style="font-size:20px;color:#10b981;"></i><span style="color:#10b981;">${currentUser.name.split(' ')[0]}</span>`;
        if (mp) mp.innerHTML = `<i class="fas fa-user-check w-5" style="color:#10b981;"></i> ${currentUser.name.split(' ')[0]}`;
    } else {
        if (pb) pb.innerHTML = '<i class="far fa-user-circle"></i><span>Perfil</span>';
        if (mp) mp.innerHTML = '<i class="fas fa-user-circle w-5"></i> Meu Perfil';
    }
}

// ============================================
// NAVEGAÇÃO
// ============================================
function showAuthPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('agendaPage').style.display = 'none';
    document.getElementById('authPage').style.display = 'flex';
    updateWeatherVisibility();
}

function showHomePage() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('agendaPage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
    updateWeatherVisibility();
}

function showAgendaPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('agendaPage').style.display = 'block';
    updateWeatherVisibility();
    renderEvents('todos');
}

function renderEvents(f = 'todos') {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    let fe = f === 'todos' ? eventsData : eventsData.filter(e => e.category === f);
    fe.sort((a, b) => new Date(a.date) - new Date(b.date));
    const l = document.getElementById('eventsList');
    if (fe.length === 0) {
        l.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#6b7280;"><i class="fas fa-calendar-times" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i><p style="font-size:16px;font-weight:500;">Nenhum evento encontrado</p></div>';
        return;
    }
    l.innerHTML = fe.map(e => {
        const d = new Date(e.date + 'T00:00:00');
        return `<div class="event-card">
            <div class="event-date"><span class="day">${d.getDate()}</span><span class="month">${months[d.getMonth()]}</span></div>
            <div class="event-info"><h3 class="event-title">${e.title}</h3><div class="event-location"><i class="fas fa-map-marker-alt"></i>${e.location}</div><div class="event-time"><i class="far fa-clock"></i>${e.time}</div><span class="event-category ${e.category}">${({cultural:'🎭 Cultural',esportivo:'⚽ Esportivo',religioso:'🙏 Religioso',gastronomico:'🍽️ Gastronômico'})[e.category]}</span></div>
        </div>`;
    }).join('');
}

function filterEvents(c) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderEvents(c);
}

function handleProfileClick() {
    if (currentUser) {
        if (confirm('Deseja sair da sua conta?')) logout();
    } else {
        showAuthPage();
    }
}

function switchAuthPageTab(t) {
    const lf = document.getElementById('loginPageForm');
    const rf = document.getElementById('registerPageForm');
    const tabs = document.querySelectorAll('.auth-page-tab');
    tabs.forEach(ta => ta.classList.remove('active'));
    if (t === 'login') {
        lf.style.display = 'block';
        rf.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        lf.style.display = 'none';
        rf.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

function formatCPF(i) {
    let v = i.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
    i.value = v;
}

function togglePassword(id, b) {
    const inp = document.getElementById(id);
    const ic = b.querySelector('i');
    if (inp.type === 'password') {
        inp.type = 'text';
        ic.classList.remove('fa-eye');
        ic.classList.add('fa-eye-slash');
    } else {
        inp.type = 'password';
        ic.classList.remove('fa-eye-slash');
        ic.classList.add('fa-eye');
    }
}

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(cpf.charAt(i)) * (10 - i);
    let d = 11 - (s % 11);
    if (d > 9) d = 0;
    if (d !== parseInt(cpf.charAt(9))) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(cpf.charAt(i)) * (11 - i);
    d = 11 - (s % 11);
    if (d > 9) d = 0;
    if (d !== parseInt(cpf.charAt(10))) return false;
    return true;
}

function handleLoginPage(e) {
    e.preventDefault();
    const cpf = document.getElementById('loginPageCpf').value.replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
    const user = users.find(u => u.cpf === cpf);
    if (!user) { showToast('❌ CPF não cadastrado'); return; }
    if (user.password !== document.getElementById('loginPagePassword').value) { showToast('❌ Senha incorreta'); return; }
    saveUser({ name: user.name, cpf: user.cpf, email: user.email });
    showHomePage();
    showToast('✅ Bem-vindo(a), ' + user.name.split(' ')[0] + '!');
}

function handleRegisterPage(e) {
    e.preventDefault();
    const name = document.getElementById('registerPageName').value.trim();
    const cpf = document.getElementById('registerPageCpf').value.replace(/\D/g, '');
    const pw = document.getElementById('registerPagePassword').value;
    if (name.length < 3) { showToast('❌ Nome deve ter pelo menos 3 caracteres'); return; }
    if (!validateCPF(cpf)) { showToast('❌ CPF inválido'); return; }
    if (pw.length < 6) { showToast('❌ Senha deve ter pelo menos 6 caracteres'); return; }
    if (pw !== document.getElementById('registerPageConfirmPassword').value) { showToast('❌ As senhas não coincidem'); return; }
    const users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
    if (users.find(u => u.cpf === cpf)) { showToast('❌ CPF já cadastrado'); return; }
    const newUser = { name, cpf, password: pw, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('conectaXexeuUsers', JSON.stringify(users));
    saveUser({ name: newUser.name, cpf: newUser.cpf });
    showHomePage();
    showToast('🎉 Cadastro realizado! Bem-vindo(a), ' + name.split(' ')[0] + '!');
}

// ============================================
// MENU MOBILE
// ============================================
const menuBtn = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenu');

function openMenu() {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

// ============================================
// MAPA
// ============================================
function toggleMap() {
    const m = document.getElementById('mapModal');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

// ============================================
// PESQUISA
// ============================================
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.getElementById('searchSuggestions');

function toggleSearch() {
    if (searchModal.style.display === 'block') {
        searchModal.style.display = 'none';
        searchSuggestions.style.display = 'flex';
        searchResults.style.display = 'none';
        searchInput.value = '';
    } else {
        searchModal.style.display = 'block';
        searchSuggestions.style.display = 'flex';
        searchResults.style.display = 'none';
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 100);
    }
}

function selectSuggestion(t) {
    toggleSearch();
    showToast('✨ ' + t + ' - Em breve no Conecta Xexéu');
}

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const q = this.value.toLowerCase();
        const f = servicesData.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
        if (q.length === 0) {
            searchSuggestions.style.display = 'flex';
            searchResults.style.display = 'none';
            return;
        }
        searchSuggestions.style.display = 'none';
        searchResults.style.display = 'block';
        if (f.length === 0) {
            searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:#6b7280;">Nenhum resultado encontrado</div>';
            return;
        }
        searchResults.innerHTML = f.map(s => {
            const isB = s.name === 'Biblioteca';
            const action = isB ? "window.open('https://2696244.playcode.io/', '_blank')" : "selectService('" + s.name + "')";
            return `<div class="search-result-item-full" onclick="${action}"><div class="search-result-icon"><i class="fas ${s.icon}"></i></div><div class="search-result-info"><div class="search-result-name">${s.name}</div><div class="search-result-category">${s.category} • ${s.desc}</div></div><i class="fas fa-chevron-right" style="color:#9ca3af;"></i></div>`;
        }).join('');
    });
}

function selectService(n) {
    toggleSearch();
    showToast('🔍 ' + n + ' - Em breve disponível');
}

// ============================================
// TECLAS
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (searchModal.style.display === 'block') toggleSearch();
        if (document.getElementById('mapModal').style.display === 'block') toggleMap();
        if (document.getElementById('weatherModal').style.display === 'flex') toggleWeatherModal();
    }
});

// ============================================
// TOAST
// ============================================
const toastEl = document.getElementById('toastMessage');
let toastTimeout = null;

function showToast(m) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastEl.textContent = m;
    toastEl.style.display = 'block';
    toastEl.style.animation = 'fadeInUp 0.3s ease';
    toastTimeout = setTimeout(function() { toastEl.style.display = 'none'; }, 3000);
}

// ============================================
// INTERATIVOS
// ============================================
document.querySelectorAll('.highlight-card:not([onclick]), .service-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
        if (!this.hasAttribute('onclick') && this.tagName !== 'A') {
            e.preventDefault();
            showToast((this.getAttribute('data-service') || '✨') + ' - Em breve no Conecta Xexéu');
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(15);
            closeMenu();
        }
    });
});

document.getElementById('searchFab').addEventListener('click', function(e) {
    e.preventDefault();
    toggleSearch();
});

document.getElementById('agendaNavBtn').addEventListener('click', function() {
    showAgendaPage();
});

document.getElementById('mobilePerfil').addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
    handleProfileClick();
});

document.getElementById('desktopNoticias').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('📰 Notícias - Em breve');
});

document.getElementById('mobileNoticias').addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
    showToast('📰 Notícias - Em breve');
});

document.getElementById('mobileConfig').addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
    showToast('⚙️ Configurações - Em breve');
});

// ============================================
// NAVEGAÇÃO
// ============================================
const navItems = document.querySelectorAll('#homePage .nav-item');

function setActiveTab(btn) {
    navItems.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
}

navItems.forEach(function(b) {
    b.addEventListener('click', function() {
        if (this.dataset.tab === 'profile') handleProfileClick();
        else if (this.dataset.tab === 'events') showAgendaPage();
        setActiveTab(this);
    });
});

// ============================================
// INIT
// ============================================
loadUser();
setActiveTab(document.querySelector('#homePage .nav-item[data-tab="home"]'));
updateWeatherVisibility();
console.log('🚀 Conecta Xexéu - Sistema inicializado com sucesso!');