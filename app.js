/**
 * Nexora LAB - Lógica unificada con evaluación 100/100 PTS
 */

// ESTADO GLOBAL
let currentStudent = 'citlali';
let currentTheme = 'dark';
let userApiKey = '';

// BASE DE DATOS DE LOS EXPERIMENTOS
const dbExperimentos = [
    { id: 1, materia: 'Física', titulo: '2da Ley de Newton: Fuerza y Aceleración', desc: 'Comprueba cómo la aceleración es directamente proporcional a la fuerza neta e inversamente proporcional a la masa del móvil.' },
    { id: 2, materia: 'Física', titulo: 'Péndulo Simple: Longitud y Periodo', desc: 'Investiga las variables que gobiernan el periodo de oscilación T y comprueba que la masa no influye en la frecuencia armónica.' },
    { id: 3, materia: 'Física', titulo: 'Ley de Ohm y Circuitos Eléctricos', desc: 'Calcula resistencia, caída de tensión y amperaje en un circuito interactivo en serie y paralelo.' },
    { id: 4, materia: 'Química', titulo: 'Escala de pH y Neutralización', desc: 'Determina el pH de ácidos y bases y calcula los volúmenes estequiométricos de amortiguamiento.' },
    { id: 5, materia: 'Química', titulo: 'Mezclas Homogéneas y Heterogéneas', desc: 'Identifica fases, solutos, solventes y selecciona el método de separación adecuado (decantación, filtración o destilación).' },
    { id: 6, materia: 'Biología', titulo: 'Fotosíntesis y Liberación de Oxígeno', desc: 'Analiza el desprendimiento de burbujas de O2 en plantas acuáticas al variar la radiación fotosintéticamente activa.' }
];

// BANCO DE EVALUACIONES (5 REACTIVOS x 20 PTS = 100 PTS)
const quizData = [
    {
        q: '1. ¿Cuál es la formulación matemática de la Segunda Ley de Newton?',
        opts: ['F = m · a', 'E = m · c²', 'V = I · R', 'p = m · v'],
        ans: 0
    },
    {
        q: '2. En un circuito óhmico con voltaje constante, si se duplica la resistencia:',
        opts: ['La corriente se reduce a la mitad', 'La corriente se duplica', 'El voltaje cae a cero', 'La potencia se cuadruplica'],
        ans: 0
    },
    {
        q: '3. Una disolución acuosa con una concentración alta de iones H⁺ y pH = 2 se clasifica como:',
        opts: ['Ácido fuerte', 'Solución neutra', 'Base concentrada', 'Solución buffer alcalina'],
        ans: 0
    },
    {
        q: '4. ¿Cuál de las siguientes combinaciones corresponde a una mezcla homogénea (solución)?',
        opts: ['Agua con cloruro de sodio totalmente disuelto', 'Agua con aceite vegetal', 'Granito pulverizado con agua', 'Arena de río en suspensión'],
        ans: 0
    },
    {
        q: '5. Durante la fase luminosa de la fotosíntesis en los tilacoides, ¿qué gas se libera como subproducto de la fotólisis del agua?',
        opts: ['Oxígeno molecular (O₂)', 'Dióxido de carbono (CO₂)', 'Gas metano (CH₄)', 'Nitrógeno gaseoso (N₂)'],
        ans: 0
    }
];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('studentName').value.trim() || 'citlali';
            iniciarSesion(name);
        });
    }

    renderizar18Misiones();
    renderizarQuiz();
});

// SESIÓN DE USUARIO
function iniciarSesion(nombre) {
    currentStudent = nombre;
    const nameLabels = ['currentStudentName', 'heroStudentName'];
    nameLabels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = nombre;
    });

    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

function loginAsCitlali() {
    iniciarSesion('citlali');
}

function cerrarSesion() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

// NAVEGACIÓN ENTRE VISTAS
function switchView(viewName) {
    const views = ['viewHome', 'viewFisica', 'viewQuimica', 'viewBiologia', 'viewMisiones', 'viewEvaluaciones', 'viewProgreso', 'viewAsistente'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });

    const activeNav = document.querySelectorAll('.nav-item');
    activeNav.forEach(btn => btn.classList.remove('active'));

    const targetNav = document.querySelector(`[data-view="${viewName}"]`);
    if (targetNav) targetNav.classList.add('active');

    const targetViewId = 'view' + viewName.charAt(0).toUpperCase() + viewName.slice(1);
    const targetEl = document.getElementById(targetViewId);
    if (targetEl) targetEl.classList.remove('hidden');

    const titleMap = {
        home: ['Bienvenido al laboratorio', 'Explora, experimenta y descubre.'],
        fisica: ['Laboratorio de Física', 'Cinemática, Dinámica y Electromagnetismo.'],
        quimica: ['Laboratorio de Química', 'Estructura molecular, estequiometría y soluciones.'],
        biologia: ['Laboratorio de Biología', 'Procesos celulares, botánica y ecología.'],
        misiones: ['Misiones Pro (18 Labs)', 'Método experimental riguroso en 7 pasos.'],
        evaluaciones: ['Evaluación de Desempeño', 'Rúbricas de acreditación sobre 100 PTS.'],
        progreso: ['Historial Académico', 'Progreso, medallas y rango alcanzado.'],
        asistente: ['NEXOR-IA Asistente', 'Tutor virtual de ciencias 24/7.']
    };

    if (titleMap[viewName]) {
        document.getElementById('topbarTitle').textContent = titleMap[viewName][0];
        document.getElementById('topbarSubtitle').textContent = titleMap[viewName][1];
    }
}

// TEMA CLARO / OSCURO
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
}

// SIMULADOR: FÍSICA
function calcularVelocidad() {
    const d = parseFloat(document.getElementById('inputDistancia').value);
    const t = parseFloat(document.getElementById('inputTiempo').value);
    document.getElementById('distVal').textContent = d;
    document.getElementById('tiempoVal').textContent = t;

    const v = d / t;
    const vKm = v * 3.6;
    document.getElementById('resultadoVelocidad').textContent = `${v.toFixed(2)} m/s (${vKm.toFixed(2)} km/h)`;
}

// SIMULADOR: QUÍMICA
function simularMezcla(nombre, tipo, explicacion) {
    document.getElementById('resultadoQuimica').innerHTML = `
        <h4 style="color:var(--cyan); margin-bottom:6px;">🧪 ${nombre}</h4>
        <p><b>Clasificación:</b> Mezcla ${tipo}</p>
        <p style="margin-top:6px; font-size:13px; line-height:1.5;">${explicacion}</p>
    `;
}

// SIMULADOR: BIOLOGÍA
function calcularFotosintesis() {
    const luz = parseInt(document.getElementById('inputLuz').value);
    document.getElementById('luzVal').textContent = luz;
    const burbujas = Math.round(luz * 1.2);
    document.getElementById('resultadoFotosintesis').innerHTML = `
        Oxígeno producido estimado: <b style="color:var(--green);">${burbujas} burbujas/min</b> (${luz > 70 ? 'Tasa óptima de fotosíntesis 🌿' : 'Tasa moderada de fase fotoquímica'})
    `;
}

// RENDERIZADO DE MISIONES
function renderizar18Misiones() {
    const cont = document.getElementById('grid18Misiones');
    if (!cont) return;
    cont.innerHTML = dbExperimentos.map(exp => `
        <div style="background:var(--box-inner-bg); border:1px solid var(--border); border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <span style="font-size:11px; font-weight:800; color:var(--cyan); text-transform:uppercase; letter-spacing:0.5px;">${exp.materia}</span>
                <h4 style="font-size:16px; font-weight:800; margin:8px 0;">${exp.titulo}</h4>
                <p style="font-size:13px; color:var(--muted); line-height:1.4; margin-bottom:16px;">${exp.desc}</p>
            </div>
            <button class="primary-btn" style="width:100%; font-size:13px; padding:10px;" onclick="iniciarMision(${exp.id})">
                Iniciar Misión (100 PTS) →
            </button>
        </div>
    `).join('');
}

function iniciarMision(id) {
    const exp = dbExperimentos.find(e => e.id === id);
    alert(`Iniciando simulación interactiva: "${exp.titulo}". Al completar las fases experimentales obtendrás hasta 100/100 PTS.`);
}

// SISTEMA DE EVALUACIÓN CALIBRADO A 100 PUNTOS
function renderizarQuiz() {
    const cont = document.getElementById('quizContainer');
    if (!cont) return;

    cont.innerHTML = `
        <form id="evalForm" onsubmit="evaluarQuiz(event)">
            ${quizData.map((item, idx) => `
                <div style="margin-bottom:20px; background:var(--box-inner-bg); border:1px solid var(--border); padding:18px; border-radius:14px;">
                    <p style="font-weight:800; margin-bottom:12px; font-size:15px;">${item.q}</p>
                    ${item.opts.map((opt, optIdx) => `
                        <label style="display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer; font-size:14px; padding:8px 12px; background:rgba(255,255,255,0.02); border-radius:8px;">
                            <input type="radio" name="p_${idx}" value="${optIdx}" required style="accent-color:var(--cyan);">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            `).join('')}
            <button type="submit" class="primary-btn" style="padding:14px 28px; font-size:15px;">Calificar Evaluación (Escala 100 PTS) 🚀</button>
        </form>
        <div id="quizResultado" style="margin-top:24px;"></div>
    `;
}

function evaluarQuiz(e) {
    e.preventDefault();
    let correctas = 0;

    quizData.forEach((item, idx) => {
        const val = document.querySelector(`input[name="p_${idx}"]:checked`);
        if (val && parseInt(val.value) === item.ans) {
            correctas++;
        }
    });

    // PUNTUACIÓN EXACTA: 5 reactivos = 20 pts cada uno -> 100 / 100 PTS
    const puntajeFinal = Math.round((correctas / quizData.length) * 100);

    let rango = '🏆 Maestro del Cosmos';
    let claseRango = 'excelente';
    if (puntajeFinal < 60) {
        rango = '🌱 Aprendiz Curioso';
        claseRango = 'regular';
    } else if (puntajeFinal < 85) {
        rango = '⚡ Científico Explorador';
        claseRango = 'bueno';
    }

    const res = document.getElementById('quizResultado');
    res.innerHTML = `
        <div style="background:rgba(36,217,242,0.1); border:1px solid var(--cyan); padding:24px; border-radius:18px; text-align:center; animation:fadeIn .3s ease;">
            <h3 style="font-size:36px; font-weight:900; color:var(--cyan); font-family:'JetBrains Mono', monospace;">${puntajeFinal} / 100 PTS</h3>
            <p style="margin:10px 0; font-weight:800; font-size:18px; color:var(--text);">${rango}</p>
            <p style="font-size:14px; color:var(--muted);">Has acertado <b>${correctas}</b> de <b>${quizData.length}</b> reactivos científicos.</p>
        </div>
    `;

    document.getElementById('progresoPuntaje').textContent = `${puntajeFinal} / 100 PTS`;
    document.getElementById('progresoRango').textContent = `Rango actual: ${rango}`;
}

// ASISTENTE DE IA LOCAL CON MOTOR AUTÓNOMO
function enviarMensajeChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chat = document.getElementById('chatMessages');
    chat.innerHTML += `
        <div style="margin-bottom:12px; text-align:right;">
            <span style="background:rgba(36, 217, 242, 0.15); color:var(--cyan); padding:8px 14px; border-radius:12px; display:inline-block; max-width:80%; font-weight:600;">${msg}</span>
        </div>
    `;
    input.value = '';

    setTimeout(() => {
        let resp = 'Excelente pregunta científica.';
        const lower = msg.toLowerCase();
        if (lower.includes('newton') || lower.includes('fuerza')) {
            resp = 'La 2da Ley de Newton (F = m·a) demuestra que la aceleración es proporcional a la fuerza e inversa a la masa.';
        } else if (lower.includes('ohm') || lower.includes('corriente') || lower.includes('voltaje')) {
            resp = 'La Ley de Ohm (V = I·R) postula que la intensidad de corriente disminuye proporcionalmente cuando la resistencia aumenta.';
        } else if (lower.includes('ph') || lower.includes('ácido') || lower.includes('base')) {
            resp = 'La escala de pH va de 0 a 14: de 0 a 6.9 es ácida, 7 es neutra (agua pura) y de 7.1 a 14 es básica o alcalina.';
        } else if (lower.includes('fotosíntesis') || lower.includes('planta')) {
            resp = 'En la fotosíntesis, los cloroplastos capturan luz solar para transformar H₂O y CO₂ en carbohidratos (glucosa) liberando O₂.';
        } else {
            resp = `He procesado tu duda sobre "${msg}". Recuerda que en el Método Científico primero formulas una hipótesis comprobable antes de recopilar datos en el laboratorio.`;
        }

        chat.innerHTML += `
            <div style="color:var(--text); background:var(--panel); border:1px solid var(--border); padding:12px 16px; border-radius:12px; margin-bottom:12px; max-width:85%;">
                <b style="color:var(--cyan); display:block; margin-bottom:4px;">🤖 NEXOR-IA:</b> ${resp}
            </div>
        `;
        chat.scrollTop = chat.scrollHeight;
    }, 350);
}

function toggleModalConfig() {
    alert("Configuración de IA: Nexora LAB opera con motor de IA local adaptativo autónomo. Puedes formular dudas o solicitar evaluaciones en cualquier momento.");
}