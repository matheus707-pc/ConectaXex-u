// script.js - Arquivo único e completo
let currentUser = null;
let weatherData = null;

// ==================== DADOS ====================
const servicesData = [
    {name:'Carteira Estudantil',category:'Destaques',icon:'fa-id-card',desc:'Solicite sua carteira'},
    {name:'Credpop Xexéu',category:'Destaques',icon:'fa-hand-holding-usd',desc:'Microcrédito'},
    {name:'Academia Xexéu',category:'Destaques',icon:'fa-dumbbell',desc:'Academia gratuita'},
    {name:'Saúde Xexéu',category:'Destaques',icon:'fa-laptop-medical',desc:'Saúde municipal'},
    {name:'Biblioteca',category:'Destaques',icon:'fa-book',desc:'Biblioteca Municipal'},
    {name:'IPTU Xexéu',category:'Serviços',icon:'fa-file-invoice-dollar',desc:'Imposto Predial'},
    {name:'Iluminação Pública',category:'Serviços',icon:'fa-lightbulb',desc:'Reparos'},
    {name:'Poda e Limpeza',category:'Serviços',icon:'fa-tree',desc:'Limpeza urbana'},
    {name:'Sinalização Urbana',category:'Serviços',icon:'fa-road',desc:'Sinalização'}
];

// Gerar eventos com datas futuras automaticamente
function gerarEventos() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dia = hoje.getDate();
    
    const formatar = (date) => date.toISOString().split('T')[0];
    const somarDias = (dias) => formatar(new Date(ano, mes, dia + dias));
    
    return [
        {title:'📚 Feira do Livro Municipal',date:somarDias(2),time:'09:00 - 17:00',location:'Biblioteca Pública de Xexéu',category:'cultural'},
        {title:'⚽ Campeonato Interbairros',date:somarDias(5),time:'08:00',location:'Estádio Municipal José Leão',category:'esportivo'},
        {title:'🎵 Festival de Música Xexéu',date:somarDias(8),time:'19:00',location:'Praça da Matriz',category:'cultural'},
        {title:'🙏 Missa do Vaqueiro',date:somarDias(12),time:'18:00',location:'Igreja Matriz de São Sebastião',category:'religioso'},
        {title:'🏃‍♂️ Corrida Rústica de Xexéu',date:somarDias(15),time:'07:00',location:'Avenida Principal',category:'esportivo'},
        {title:'🎨 Feira de Artesanato',date:somarDias(20),time:'14:00 - 21:00',location:'Centro de Convenções',category:'cultural'},
        {title:'🍽️ Festival Gastronômico',date:somarDias(25),time:'12:00 - 22:00',location:'Parque de Alimentação',category:'gastronomico'},
        {title:'🎭 Semana do Teatro',date:somarDias(30),time:'20:00',location:'Teatro Municipal',category:'cultural'},
        {title:'🚴‍♂️ Passeio Ciclístico',date:somarDias(35),time:'06:00',location:'Praça Central',category:'esportivo'},
        {title:'🌾 Festa do Agricultor',date:somarDias(42),time:'09:00',location:'Sindicato Rural',category:'cultural'},
        {title:'🕯️ Procissão de Nossa Senhora',date:somarDias(50),time:'17:00',location:'Igreja Matriz',category:'religioso'}
    ];
}

let eventsData = gerarEventos();

const policies = {
    privacy:{title:'Política de Privacidade',content:'<p><strong>Última atualização:</strong> ' + new Date().toLocaleDateString('pt-BR') + '</p><p>O Conecta Xexéu respeita a sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações.</p><p><strong>Dados coletados:</strong> Nome completo, CPF, e-mail e telefone.</p><p><strong>Uso dos dados:</strong> Seus dados são utilizados exclusivamente para identificação no sistema e acesso aos serviços municipais de Xexéu.</p><p><strong>Compartilhamento:</strong> Não compartilhamos seus dados com terceiros, exceto quando exigido por lei.</p><p><strong>Seus direitos:</strong> Você pode solicitar a exclusão dos seus dados a qualquer momento.</p>'},
    cookies:{title:'Política de Cookies',content:'<p>Cookies são pequenos arquivos armazenados no seu dispositivo que nos ajudam a melhorar sua experiência.</p><p><strong>Cookies essenciais:</strong> Utilizamos cookies estritamente necessários para o funcionamento do sistema.</p><p><strong>Cookies de preferência:</strong> Armazenam suas configurações de GPS e notificações.</p>'},
    terms:{title:'Termos de Uso',content:'<p>Ao utilizar o Conecta Xexéu, você concorda com os seguintes termos:</p><p><strong>1.</strong> O Conecta Xexéu é uma plataforma oficial da Prefeitura de Xexéu.</p><p><strong>2.</strong> É necessário fornecer informações verdadeiras durante o cadastro.</p><p><strong>3.</strong> Você é responsável por manter a confidencialidade da sua senha.</p>'},
    about:{title:'Sobre o Conecta Xexéu',content:'<p><strong>Conecta Xexéu</strong> é o aplicativo oficial da Prefeitura Municipal de Xexéu, Pernambuco.</p><p><strong>Versão:</strong> 1.0.0</p><p><strong>Objetivo:</strong> Facilitar o acesso dos cidadãos aos serviços públicos municipais.</p>'},
    contact:{title:'Contato',content:'<p><strong>Prefeitura Municipal de Xexéu</strong></p><p><i class="fas fa-map-marker-alt"></i> Praça Central, S/N - Centro, Xexéu - PE</p><p><i class="fas fa-phone"></i> (81) 9XXXX-XXXX</p><p><i class="fas fa-envelope"></i> contato@xexeu.pe.gov.br</p>'},
    data:{title:'Seus Dados',content:'<button onclick="exportData()" style="width:100%;padding:12px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;margin:8px 0;font-weight:600;"><i class="fas fa-download"></i> Exportar meus dados</button><button onclick="deleteData()" style="width:100%;padding:12px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;margin:8px 0;font-weight:600;"><i class="fas fa-trash"></i> Excluir minha conta</button><p style="font-size:12px;color:#6b7280;">A exclusão é permanente.</p>'}
};

// ==================== FUNÇÕES UI ====================
function hideAll() {
    const pages = ['homePage', 'authPage', 'agendaPage', 'settingsPage'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function showHomePage() {
    hideAll();
    const home = document.getElementById('homePage');
    const weather = document.getElementById('weatherFloating');
    if (home) home.style.display = 'block';
    if (weather) weather.style.display = 'block';
}

function showAuthPage() {
    hideAll();
    const auth = document.getElementById('authPage');
    if (auth) auth.style.display = 'flex';
}

function showAgendaPage() {
    hideAll();
    const agenda = document.getElementById('agendaPage');
    const weather = document.getElementById('weatherFloating');
    if (agenda) agenda.style.display = 'block';
    if (weather) weather.style.display = 'none';
    renderEvents('todos');
}

function showSettingsPage() {
    hideAll();
    const settings = document.getElementById('settingsPage');
    const weather = document.getElementById('weatherFloating');
    if (settings) settings.style.display = 'block';
    if (weather) weather.style.display = 'none';
    loadSettings();
}

// ==================== POLÍTICAS ====================
function showPolicy(type) {
    const modal = document.getElementById('policyModal');
    const content = document.getElementById('policyContent');
    const data = policies[type];
    if (modal && content && data) {
        content.innerHTML = '<h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">'+data.title+'</h2>'+data.content+'<button class="policy-close-btn" onclick="document.getElementById(\'policyModal\').style.display=\'none\'">Fechar</button>';
        modal.style.display = 'flex';
    }
}

// ==================== GPS E NOTIFICAÇÕES ====================
function ativarGPS() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const toggle = document.getElementById('gpsToggle');
                if (toggle) toggle.checked = true;
                localStorage.setItem('gpsEnabled', 'true');
                const status = document.getElementById('gpsStatus');
                if (status) status.textContent = 'GPS ativado - Localização compartilhada';
                showToast('📍 Localização ativada!');
            },
            (error) => {
                const toggle = document.getElementById('gpsToggle');
                if (toggle) toggle.checked = false;
                localStorage.setItem('gpsEnabled', 'false');
                const status = document.getElementById('gpsStatus');
                if (status) status.textContent = 'Permissão negada pelo navegador';
                showToast('❌ Permissão de GPS negada');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        showToast('❌ GPS não suportado');
    }
}

function desativarGPS() {
    const toggle = document.getElementById('gpsToggle');
    if (toggle) toggle.checked = false;
    localStorage.setItem('gpsEnabled', 'false');
    const status = document.getElementById('gpsStatus');
    if (status) status.textContent = 'GPS desativado';
    showToast('📍 Localização desativada');
}

function toggleGPSSwitch() {
    const toggle = document.getElementById('gpsToggle');
    if (toggle && toggle.checked) {
        desativarGPS();
    } else {
        ativarGPS();
    }
}

function handleGPSToggle(el) {
    if (el.checked) ativarGPS();
    else desativarGPS();
}

function ativarNotif() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            const toggle = document.getElementById('notifToggle');
            const status = document.getElementById('notifStatus');
            if (permission === 'granted') {
                if (toggle) toggle.checked = true;
                localStorage.setItem('notifEnabled', 'true');
                if (status) status.textContent = 'Notificações ativadas';
                showToast('🔔 Notificações ativadas!');
            } else {
                if (toggle) toggle.checked = false;
                localStorage.setItem('notifEnabled', 'false');
                if (status) status.textContent = 'Permissão negada';
                showToast('❌ Notificações bloqueadas');
            }
        });
    } else {
        showToast('❌ Não suportado');
    }
}

function desativarNotif() {
    const toggle = document.getElementById('notifToggle');
    if (toggle) toggle.checked = false;
    localStorage.setItem('notifEnabled', 'false');
    const status = document.getElementById('notifStatus');
    if (status) status.textContent = 'Notificações desativadas';
    showToast('🔕 Notificações desativadas');
}

function toggleNotifSwitch() {
    const toggle = document.getElementById('notifToggle');
    if (toggle && toggle.checked) desativarNotif();
    else ativarNotif();
}

function handleNotifToggle(el) {
    if (el.checked) ativarNotif();
    else desativarNotif();
}

function loadSettings() {
    const gpsEnabled = localStorage.getItem('gpsEnabled') === 'true';
    const notifEnabled = localStorage.getItem('notifEnabled') === 'true';
    
    const gpsToggle = document.getElementById('gpsToggle');
    const gpsStatus = document.getElementById('gpsStatus');
    const notifToggle = document.getElementById('notifToggle');
    const notifStatus = document.getElementById('notifStatus');
    
    if (gpsToggle) gpsToggle.checked = gpsEnabled;
    if (gpsStatus) gpsStatus.textContent = gpsEnabled ? 'GPS ativado' : 'GPS desativado';
    if (notifToggle) notifToggle.checked = notifEnabled;
    if (notifStatus) notifStatus.textContent = notifEnabled ? 'Notificações ativadas' : 'Notificações desativadas';
}

// ==================== CLIMA ====================
function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1) return '🌤️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌧️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌡️';
}

function getWeatherDesc(code) {
    if (code === 0) return 'Céu limpo';
    if (code === 1) return 'Parcialmente limpo';
    if (code === 2) return 'Nublado';
    if (code === 3) return 'Nublado';
    if (code >= 45 && code <= 48) return 'Neblina';
    if (code >= 51 && code <= 55) return 'Garoa';
    if (code >= 61 && code <= 65) return 'Chuva';
    if (code >= 80 && code <= 82) return 'Pancadas';
    if (code >= 95) return 'Tempestade';
    return 'Indisponível';
}

async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-8.8083&longitude=-35.6258&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/Recife&forecast_days=7');
        weatherData = await response.json();
        updateWeatherFloating();
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
    }
}

function updateWeatherFloating() {
    if (!weatherData) return;
    const current = weatherData.current;
    const daily = weatherData.daily;
    
    const tempEl = document.getElementById('floatingTemp');
    const iconEl = document.getElementById('weatherIcon');
    const humidityEl = document.getElementById('expHumidity');
    const windEl = document.getElementById('expWind');
    const feelsEl = document.getElementById('expFeels');
    const hlEl = document.getElementById('expHL');
    const statusEl = document.getElementById('weatherStatus');
    
    if (tempEl) tempEl.textContent = Math.round(current.temperature_2m) + '°';
    if (iconEl) iconEl.textContent = getWeatherIcon(current.weather_code);
    if (humidityEl) humidityEl.textContent = current.relative_humidity_2m + '%';
    if (windEl) windEl.textContent = Math.round(current.wind_speed_10m) + ' km/h';
    if (feelsEl) feelsEl.textContent = Math.round(current.apparent_temperature) + '°';
    if (hlEl) hlEl.textContent = Math.round(daily.temperature_2m_max[0]) + '°/ ' + Math.round(daily.temperature_2m_min[0]) + '°';
    
    if (statusEl) {
        const temp = current.temperature_2m;
        statusEl.classList.remove('status-good', 'status-moderate', 'status-bad');
        if (temp >= 20 && temp <= 30) {
            statusEl.classList.add('status-good');
            statusEl.textContent = 'AGRADÁVEL';
        } else if (temp > 30 || temp < 15) {
            statusEl.classList.add('status-moderate');
            statusEl.textContent = 'MODERADO';
        } else {
            statusEl.classList.add('status-bad');
            statusEl.textContent = 'FRIO';
        }
    }
}

function toggleWeatherModal() {
    const modal = document.getElementById('weatherModal');
    if (modal) {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            updateWeatherModalContent();
            modal.style.display = 'flex';
        }
    }
}

function updateWeatherModalContent() {
    if (!weatherData) return;
    const current = weatherData.current;
    const daily = weatherData.daily;
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const now = new Date();
    let weekHtml = '';
    
    for (let i = 1; i < 7; i++) {
        const dt = new Date(now);
        dt.setDate(dt.getDate() + i);
        weekHtml += `<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e7eb;">
            <span style="font-weight:600;">${days[dt.getDay()]}</span>
            <div><span style="color:#9ca3af;">${Math.round(daily.temperature_2m_min[i])}°</span> <span style="font-weight:700;">${Math.round(daily.temperature_2m_max[i])}°</span></div>
        </div>`;
    }
    
    const content = document.getElementById('weatherModalContent');
    if (content) {
        content.innerHTML = `
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#eff6ff,#fef3c7);border-radius:20px;margin-bottom:20px;">
                <div style="font-size:48px;">${getWeatherIcon(current.weather_code)}</div>
                <div style="font-size:72px;font-weight:800;">${Math.round(current.temperature_2m)}°C</div>
                <div style="font-size:18px;color:#6b7280;">${getWeatherDesc(current.weather_code)}</div>
                <p>Xexéu, Pernambuco</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div style="background:#f9fafb;border-radius:16px;padding:16px;display:flex;align-items:center;gap:12px;">
                    <div style="width:44px;height:44px;border-radius:12px;background:#eff6ff;display:flex;align-items:center;justify-content:center;color:#2563eb;"><i class="fas fa-tint"></i></div>
                    <div><span style="font-size:11px;color:#9ca3af;">Umidade</span><div style="font-size:16px;font-weight:700;">${current.relative_humidity_2m}%</div></div>
                </div>
                <div style="background:#f9fafb;border-radius:16px;padding:16px;display:flex;align-items:center;gap:12px;">
                    <div style="width:44px;height:44px;border-radius:12px;background:#fef3c7;display:flex;align-items:center;justify-content:center;color:#d97706;"><i class="fas fa-wind"></i></div>
                    <div><span style="font-size:11px;color:#9ca3af;">Vento</span><div style="font-size:16px;font-weight:700;">${Math.round(current.wind_speed_10m)} km/h</div></div>
                </div>
            </div>
            <div style="margin-top:20px;">
                <h3 style="font-weight:700;margin-bottom:12px;">Próximos Dias</h3>
                ${weekHtml}
            </div>
        `;
    }
}

// ==================== AGENDA ====================
function renderEvents(filter = 'todos') {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    let filtered = filter === 'todos' ? eventsData : eventsData.filter(e => e.category === filter);
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    const listEl = document.getElementById('eventsList');
    
    if (!listEl) return;
    
    if (filtered.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;padding:60px;">Nenhum evento encontrado</div>';
        return;
    }
    
    const categoryMap = {
        'cultural': { label: '🎭 Cultural', color: '#fef3c7', textColor: '#d97706' },
        'esportivo': { label: '⚽ Esporte', color: '#dcfce7', textColor: '#16a34a' },
        'religioso': { label: '🙏 Religioso', color: '#f3e8ff', textColor: '#9333ea' },
        'gastronomico': { label: '🍽️ Gastro', color: '#fff0f0', textColor: '#dc2626' }
    };
    
    listEl.innerHTML = filtered.map(e => {
        const d = new Date(e.date + 'T00:00:00');
        const cat = categoryMap[e.category] || { label: e.category, color: '#f3f4f6', textColor: '#6b7280' };
        
        return `<div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;display:flex;gap:16px;border:1px solid #e5e7eb;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="width:70px;height:70px;background:linear-gradient(135deg,#2563eb,#1E3A8A);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;flex-shrink:0;">
                <span style="font-size:24px;font-weight:800;">${d.getDate()}</span>
                <span style="font-size:12px;">${months[d.getMonth()]}</span>
            </div>
            <div>
                <h3 style="font-size:18px;font-weight:700;margin-bottom:4px;">${e.title}</h3>
                <p style="font-size:13px;color:#6b7280;margin-bottom:4px;"><i class="fas fa-map-marker-alt" style="margin-right:4px;"></i>${e.location}</p>
                <p style="font-size:13px;color:#6b7280;margin-bottom:8px;"><i class="fas fa-clock" style="margin-right:4px;"></i>${e.time}</p>
                <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;background:${cat.color};color:${cat.textColor};">${cat.label}</span>
            </div>
        </div>`;
    }).join('');
}

function filterEvents(category) {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderEvents(category);
}

// ==================== AUTENTICAÇÃO ====================
function loadUser() {
    const user = localStorage.getItem('conectaXexeuUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForLoggedUser();
    }
}

function saveUser(user) {
    currentUser = user;
    localStorage.setItem('conectaXexeuUser', JSON.stringify(user));
    updateUIForLoggedUser();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('conectaXexeuUser');
    updateUIForLoggedUser();
    showToast('👋 Você saiu');
}

function updateUIForLoggedUser() {
    const profileBtn = document.getElementById('profileNavBtn');
    const mobileProfile = document.getElementById('mobilePerfil');
    
    if (currentUser) {
        if (profileBtn) profileBtn.innerHTML = `<i class="fas fa-user-check" style="font-size:20px;color:#10b981;"></i><span style="color:#10b981;">${currentUser.name.split(' ')[0]}</span>`;
        if (mobileProfile) mobileProfile.innerHTML = `<i class="fas fa-user-check" style="color:#10b981;"></i> ${currentUser.name.split(' ')[0]}`;
    } else {
        if (profileBtn) profileBtn.innerHTML = '<i class="far fa-user-circle"></i><span>Perfil</span>';
        if (mobileProfile) mobileProfile.innerHTML = '<i class="fas fa-user-circle"></i> Meu Perfil';
    }
}

function handleProfileClick() {
    if (currentUser) {
        if (confirm('Deseja sair da sua conta?')) logout();
    } else {
        showAuthPage();
    }
}

function switchAuthPageTab(tab) {
    const loginForm = document.getElementById('loginPageForm');
    const registerForm = document.getElementById('registerPageForm');
    const tabs = document.querySelectorAll('.auth-page-tab');
    
    tabs.forEach(ta => ta.classList.remove('active'));
    
    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (tabs[0]) tabs[0].classList.add('active');
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (tabs[1]) tabs[1].classList.add('active');
    }
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    input.value = value;
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

function handleLoginPage(e) {
    e.preventDefault();
    const cpf = document.getElementById('loginPageCpf').value.replace(/\D/g, '');
    const users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
    const user = users.find(u => u.cpf === cpf);
    
    if (!user) {
        showToast('❌ CPF não cadastrado');
        return;
    }
    if (user.password !== document.getElementById('loginPagePassword').value) {
        showToast('❌ Senha incorreta');
        return;
    }
    
    saveUser({ name: user.name, cpf: user.cpf });
    showHomePage();
    showToast('✅ Bem-vindo(a), ' + user.name.split(' ')[0] + '!');
}

function handleRegisterPage(e) {
    e.preventDefault();
    const name = document.getElementById('registerPageName').value.trim();
    const cpf = document.getElementById('registerPageCpf').value.replace(/\D/g, '');
    const password = document.getElementById('registerPagePassword').value;
    const confirmPassword = document.getElementById('registerPageConfirmPassword').value;
    
    if (name.length < 3) {
        showToast('❌ Nome inválido (mínimo 3 caracteres)');
        return;
    }
    if (!validateCPF(cpf)) {
        showToast('❌ CPF inválido');
        return;
    }
    if (password.length < 6) {
        showToast('❌ Senha deve ter pelo menos 6 caracteres');
        return;
    }
    if (password !== confirmPassword) {
        showToast('❌ Senhas não conferem');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
    if (users.find(u => u.cpf === cpf)) {
        showToast('❌ CPF já cadastrado');
        return;
    }
    
    const newUser = { name, cpf, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('conectaXexeuUsers', JSON.stringify(users));
    saveUser({ name: newUser.name, cpf: newUser.cpf });
    showHomePage();
    showToast('🎉 Cadastro realizado com sucesso!');
}

function exportData() {
    const users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
    const user = currentUser ? users.find(u => u.cpf === currentUser.cpf) : null;
    
    if (user) {
        const data = { name: user.name, cpf: user.cpf, createdAt: user.createdAt };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meus-dados-xexeu.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('📥 Dados exportados com sucesso!');
    } else {
        showToast('❌ Faça login primeiro');
    }
}

function deleteData() {
    if (confirm('Tem certeza? Esta ação é irreversível e todos os seus dados serão excluídos permanentemente!')) {
        if (currentUser) {
            let users = JSON.parse(localStorage.getItem('conectaXexeuUsers') || '[]');
            users = users.filter(u => u.cpf !== currentUser.cpf);
            localStorage.setItem('conectaXexeuUsers', JSON.stringify(users));
            currentUser = null;
            localStorage.removeItem('conectaXexeuUser');
            updateUIForLoggedUser();
            const modal = document.getElementById('policyModal');
            if (modal) modal.style.display = 'none';
            showToast('🗑️ Conta excluída permanentemente');
            showHomePage();
        }
    }
}

// ==================== BUSCA ====================
function toggleSearch() {
    const modal = document.getElementById('searchModal');
    const suggestions = document.getElementById('searchSuggestions');
    const results = document.getElementById('searchResults');
    const input = document.getElementById('searchInput');
    
    if (modal) {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            if (suggestions) suggestions.style.display = 'flex';
            if (results) results.style.display = 'none';
            if (input) input.value = '';
        } else {
            modal.style.display = 'block';
            if (suggestions) suggestions.style.display = 'flex';
            if (results) results.style.display = 'none';
            if (input) {
                input.value = '';
                setTimeout(() => input.focus(), 100);
            }
        }
    }
}

function selectService(name) {
    toggleSearch();
    showToast('🔍 ' + name + ' - Em breve');
}

// ==================== MENU ====================
function openMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ==================== MAPA ====================
function toggleMap() {
    const map = document.getElementById('mapModal');
    if (map) {
        map.style.display = map.style.display === 'block' ? 'none' : 'block';
    }
}

// ==================== TOAST ====================
let toastTimeout = null;
function showToast(message) {
    const toast = document.getElementById('toastMessage');
    if (toastTimeout) clearTimeout(toastTimeout);
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        toastTimeout = setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    // Menu
    const menuBtn = document.getElementById('menuButton');
    const closeMenuBtn = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    
    // Busca
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filtered = servicesData.filter(s => s.name.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query));
            
            if (query.length === 0) {
                if (searchSuggestions) searchSuggestions.style.display = 'flex';
                if (searchResults) searchResults.style.display = 'none';
                return;
            }
            
            if (searchSuggestions) searchSuggestions.style.display = 'none';
            if (searchResults) searchResults.style.display = 'block';
            
            if (filtered.length === 0) {
                searchResults.innerHTML = '<div style="padding:20px;text-align:center;">Nenhum resultado encontrado</div>';
                return;
            }
            
            searchResults.innerHTML = filtered.map(s => {
                const isLibrary = s.name === 'Biblioteca';
                return `<div style="padding:12px;border-bottom:1px solid #e5e7eb;cursor:pointer;transition:background 0.2s;" onmouseenter="this.style.background='#f3f4f6'" onmouseleave="this.style.background='white'" onclick="${isLibrary ? 'window.open(\'https://2696244.playcode.io/\',\'_blank\')' : 'selectService(\'' + s.name + '\')'}">
                    <strong style="font-size:16px;">${s.name}</strong><br>
                    <small style="color:#6b7280;">${s.desc}</small>
                </div>`;
            }).join('');
        });
    }
    
    // Cards de serviços
    document.querySelectorAll('.highlight-card:not([onclick]), [data-service]').forEach(el => {
        el.addEventListener('click', function(e) {
            if (!this.hasAttribute('onclick') && this.tagName !== 'A') {
                e.preventDefault();
                showToast((this.getAttribute('data-service') || '✨') + ' - Em breve');
                closeMenu();
            }
        });
    });
    
    // Botões de navegação
    const searchFab = document.getElementById('searchFab');
    const agendaNavBtn = document.getElementById('agendaNavBtn');
    const mobilePerfil = document.getElementById('mobilePerfil');
    const mobileConfig = document.getElementById('mobileConfig');
    const desktopNoticias = document.getElementById('desktopNoticias');
    const mobileNoticias = document.getElementById('mobileNoticias');
    
    if (searchFab) searchFab.addEventListener('click', (e) => { e.preventDefault(); toggleSearch(); });
    if (agendaNavBtn) agendaNavBtn.addEventListener('click', () => showAgendaPage());
    if (mobilePerfil) mobilePerfil.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); handleProfileClick(); });
    if (mobileConfig) mobileConfig.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); showSettingsPage(); });
    if (desktopNoticias) desktopNoticias.addEventListener('click', (e) => { e.preventDefault(); showToast('📰 Notícias - Em breve'); });
    if (mobileNoticias) mobileNoticias.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); showToast('📰 Notícias - Em breve'); });
    
    // Modal de políticas
    const policyModal = document.getElementById('policyModal');
    if (policyModal) {
        policyModal.addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });
    }
    
    // Navegação inferior
    const navItems = document.querySelectorAll('#homePage .nav-item');
    function setActiveTab(btn) {
        navItems.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    navItems.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.tab === 'profile') handleProfileClick();
            else if (this.dataset.tab === 'events') showAgendaPage();
            setActiveTab(this);
        });
    });
    
    // Inicializar
    loadUser();
    fetchWeather();
    setInterval(fetchWeather, 20 * 60 * 1000);
    
    const activeHome = document.querySelector('#homePage .nav-item[data-tab="home"]');
    if (activeHome) setActiveTab(activeHome);
    
    console.log('🚀 Conecta Xexéu - Sistema iniciado com sucesso!');
});