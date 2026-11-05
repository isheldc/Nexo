/* ==========================================================================
   NEXORA LAB PRO - CÓDIGO JAVASCRIPT UNIFICADO Y COMPLETO
   ========================================================================== */

const $ = (id) => document.getElementById(id);

let student = localStorage.getItem("nexoraStudent") || "";
let experiments = Number(localStorage.getItem("nexoraExperiments") || 0);
let correctAnswers = Number(localStorage.getItem("nexoraCorrect") || 0);
let history = JSON.parse(localStorage.getItem("nexoraHistory") || "[]");
let currentTheme = localStorage.getItem("nexora_theme") || "dark";

let nivelActual = "Secundaria";
let materiaActual = "Fisica";
let expActual = null;
let pasoActual = 1;
let animId = null;
let sensorActivo = false;
let sensorTilt = 0;

let userSession = {
    observacionSeleccionada: "",
    observacionLibre: "",
    problemaSeleccionado: "",
    hipotesisCondicion: "",
    hipotesisEfecto: "",
    ensayos: [],
    analisisSeleccionado: "",
    conclusionSeleccionada: "",
    conclusionTexto: "",
    comunicacionTitular: ""
};

/* ==========================================
   GESTIÓN DE TEMA OSCURO / CLARO Y RED
   ========================================== */
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem("nexora_theme", currentTheme);
    const btnTheme = document.getElementById("btn-theme");
    if (btnTheme) btnTheme.innerText = currentTheme === 'light' ? '☀️' : '🌙';
}

function cargarTemaGuardado() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const btnTheme = document.getElementById("btn-theme");
    if (btnTheme) {
        btnTheme.innerText = currentTheme === 'light' ? '☀️' : '🌙';
    }
}

window.addEventListener('online', syncRed);
window.addEventListener('offline', syncRed);

function syncRed() {
    const pill = document.getElementById("estado-red");
    if (!pill) return;
    if (navigator.onLine) {
        pill.innerText = "🟢 Conectado (IA Global lista)";
        pill.className = "pill online";
    } else {
        pill.innerText = "🔴 Sin Conexión (IA Local activa)";
        pill.className = "pill offline";
    }
}

/* ==========================================
   GESTIÓN DE PROGRESO Y ACTIVIDAD
   ========================================== */
function saveProgress() {
    localStorage.setItem("nexoraExperiments", experiments);
    localStorage.setItem("nexoraCorrect", correctAnswers);
    localStorage.setItem("nexoraHistory", JSON.stringify(history));
    updateProgress();
}

function addActivity(description) {
    history.unshift({
        description,
        date: new Date().toLocaleString("es-MX")
    });
    history = history.slice(0, 20);
    saveProgress();
}

function updateProgress() {
    if ($("experimentCount")) $("experimentCount").textContent = experiments;
    if ($("quizScore")) $("quizScore").textContent = correctAnswers;

    const container = $("activityHistory");
    if (!container) return;

    if (history.length === 0) {
        container.textContent = "Todavía no tienes actividades registradas.";
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item" style="margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:6px;">
            <strong>${escapeHTML(item.description)}</strong><br>
            <small style="color:var(--muted);">${escapeHTML(item.date)}</small>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

/* ==========================================
   INICIO Y CIERRE DE SESIÓN
   ========================================== */
function enterApp(name) {
    student = name;
    localStorage.setItem("nexoraStudent", student);

    if ($("loginScreen")) $("loginScreen").classList.add("hidden");
    if ($("app")) $("app").classList.remove("hidden");

    if ($("welcomeName")) $("welcomeName").textContent = student;
    if ($("heroName")) $("heroName").textContent = student;

    updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
    cargarTemaGuardado();
    syncRed();

    const loginForm = $("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = $("studentName").value.trim();
            const password = $("studentPassword").value;

            if (name.length < 2 || password.length < 4) {
                alert("Escribe un nombre y una contraseña de al menos 4 caracteres.");
                return;
            }
            enterApp(name);
        });
    }

    const logoutBtn = $("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("nexoraStudent");
            student = "";
            if ($("app")) $("app").classList.add("hidden");
            if ($("loginScreen")) $("loginScreen").classList.remove("hidden");
            if (loginForm) loginForm.reset();
        });
    }

    if (student) {
        enterApp(student);
    }

    // Inicializar navegación lateral clásica
    document.querySelectorAll(".nav-btn").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.section);
        });
    });

    // Inicializar enlace del slider de fotosíntesis si existe
    const lightSlider = $("lightSlider");
    if (lightSlider) {
        lightSlider.addEventListener("input", function() {
            const light = Number(this.value);
            if ($("lightValue")) $("lightValue").textContent = light + "%";
            if (light < 20) {
                if ($("plantEmoji")) $("plantEmoji").textContent = "🌱";
                if ($("photoResult")) $("photoResult").textContent = "Con poca luz, la fotosíntesis puede verse limitada.";
            } else if (light < 70) {
                if ($("plantEmoji")) $("plantEmoji").textContent = "🌿";
                if ($("photoResult")) $("photoResult").textContent = "Intensidad de luz intermedia.";
            } else {
                if ($("plantEmoji")) $("plantEmoji").textContent = "🌳";
                if ($("photoResult")) $("photoResult").textContent = "Disponibilidad alta de luz.";
            }
        });
        lightSlider.addEventListener("change", function() {
            experiments++;
            addActivity("Exploración del modelo de fotosíntesis");
        });
    }

    loadQuestion();
});

/* ==========================================
   NAVEGACIÓN DE VISTAS (SECCIONES)
   ========================================== */
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active-section");
    });

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    const section = $(sectionId);
    if (!section) return;

    section.classList.add("active-section");

    const activeButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeButton) activeButton.classList.add("active");

    const titles = {
        inicio: "Bienvenido al laboratorio",
        fisica: "Laboratorio de Física",
        quimica: "Laboratorio de Química",
        biologia: "Laboratorio de Biología",
        misiones: "Misiones Pro (18 Labs)",
        evaluacion: "Evaluaciones",
        progreso: "Mi progreso",
        ia: "Asistente NEXOR-IA"
    };

    if ($("pageTitle")) $("pageTitle").textContent = titles[sectionId] || "Nexora LAB";
    if (sectionId === "progreso") updateProgress();
}

function switchView(viewName) {
    showSection(viewName);
}

/* ==========================================
   BASE DE DATOS DE 18 EXPERIMENTOS
   ========================================== */
const dbExperimentos = {
    Secundaria: {
        Fisica: [
            {
                id: "s-fis-1",
                titulo: "Fuerza y Fricción (2ª Ley de Newton)",
                desc: "Descubre cómo un objeto acelera cuando empujas más fuerte o cuando el suelo resbala más.",
                simTipo: "fuerza",
                preguntasObs: [
                    "El carrito acelera rápido cuando se aplica fuerza, pero frena por la fricción.",
                    "El carrito nunca se mueve sin importar cuánta fuerza apliquemos.",
                    "La fricción aumenta la velocidad del carrito hacia adelante."
                ],
                preguntasProb: [
                    "¿Cómo influye la fuerza del empuje en la aceleración del carrito?",
                    "¿De qué color debe ser el carrito para que no tenga fricción?",
                    "¿Por qué los objetos pesan más en la noche?"
                ],
                hipCondiciones: ["Aumentamos la fuerza de empuje", "Ponemos hielo (cero fricción)", "Aumentamos el peso al doble"],
                hipEfectos: ["el carrito acelera más rápido", "el carrito tardará más en moverse", "la aceleración se mantendrá igual"],
                analisisOpciones: [
                    "A mayor fuerza aplicada, la aceleración aumenta de forma proporcional.",
                    "La fuerza no tiene ninguna relación con la velocidad del objeto.",
                    "El peso no afecta en absoluto la aceleración."
                ],
                conclusionesOpciones: [
                    "Se confirma la hipótesis: La fuerza neta es directamente proporcional a la aceleración (F = m·a).",
                    "Se refuta la hipótesis: Los objetos pesados siempre van más rápido por gravedad.",
                    "No se obtuvieron suficientes datos numéricos para decidir."
                ],
                titularesCom: [
                    "⚡ ¡Comprobado!: Más fuerza equivale a mayor aceleración en carritos de prueba.",
                    "🚗 El misterio del auto que nunca frenó.",
                    "🔬 Científicos demuestran que la fricción frena los cuerpos en movimiento."
                ]
            },
            {
                id: "s-fis-3",
                titulo: "Circuitos Eléctricos y Ley de Ohm",
                desc: "¿Qué pasa con la corriente de un foco si aumentas el voltaje o la resistencia?",
                simTipo: "circuito",
                preguntasObs: [
                    "El foco brilla con más intensidad cuando aumentamos el voltaje de la batería.",
                    "Al aumentar la resistencia del cable, el foco se ilumina con mayor brillo.",
                    "Los electrones no fluyen cuando el interruptor está cerrado."
                ],
                preguntasProb: [
                    "¿Cómo afecta el aumento de resistencia al flujo de corriente (Amperes)?",
                    "¿De qué forma la batería genera calor sin tocar nada?",
                    "¿Por qué los focos sólo sirven en la oscuridad?"
                ],
                hipCondiciones: ["Aumentamos el voltaje de la batería", "Colocamos una resistencia muy alta", "Conectamos dos focos en serie"],
                hipEfectos: ["la corriente aumentará y el foco brillará más", "la corriente disminuirá y el brillo bajará", "el circuito dejará de conducir por completo"],
                analisisOpciones: [
                    "La corriente es directamente proporcional al voltaje e inversamente proporcional a la resistencia (I = V/R).",
                    "A mayor resistencia, más corriente pasa por el circuito.",
                    "El voltaje nunca afecta la intensidad lumínica."
                ],
                conclusionesOpciones: [
                    "Hipótesis respaldada: La Ley de Ohm gobierna con exactitud el brillo del circuito virtual.",
                    "Hipótesis refutada: El foco brilló menos al subir el voltaje.",
                    "Faltan pruebas para determinar el valor de los Ohms."
                ],
                titularesCom: [
                    "💡 Hackeando la electricidad: La Ley de Ohm explicada con luz virtual.",
                    "⚡ Baterías al límite en el laboratorio digital.",
                    "🔌 Estudiantes comprueban cómo la resistencia frena la corriente."
                ]
            }
        ],
        Quimica: [
            {
                id: "s-qui-1",
                titulo: "Escala de pH: Ácidos, Neutros y Bases",
                desc: "¿Por qué el limón arde y el jabón resbala? Mide el pH y neutraliza soluciones.",
                simTipo: "ph",
                preguntasObs: [
                    "El líquido cambia a rojo con ácidos y a violeta/azul con sustancias básicas.",
                    "El pH siempre se mantiene en 7 sin importar qué sustancia agreguemos.",
                    "Los ácidos y las bases son exactamente la misma sustancia química."
                ],
                preguntasProb: [
                    "¿Qué ocurre con el pH de un ácido cuando agregamos una base en igual proporción?",
                    "¿Por qué los ácidos tienen sabor dulce en la simulación?",
                    "¿Cómo cambia el color del agua si no le agregamos ningún reactivo?"
                ],
                hipCondiciones: ["Añadimos gotas de base (NaOH) a un ácido fuerte", "Agregamos agua pura al compuesto", "Mezclamos dos ácidos idénticos"],
                hipEfectos: ["el pH subirá hacia 7 (neutralización)", "el pH caerá a valores negativos", "la solución explotará instantáneamente"],
                analisisOpciones: [
                    "La adición de iones OH- neutraliza los iones H+, llevando el pH hacia la zona neutra (7).",
                    "El pH se mantiene estático sin importar la cantidad de gotas.",
                    "Las bases vuelven a las sustancias más ácidas."
                ],
                conclusionesOpciones: [
                    "Se confirma: La neutralización química equilibra el pH entre ácidos y bases.",
                    "Se refuta: Los reactivos no cambiaron de color ni de pH.",
                    "El indicador universal no responde a reactivos."
                ],
                titularesCom: [
                    "🧪 El arcoíris del pH: Logramos la neutralización química perfecta.",
                    "🍋 Del jugo de limón al jabón: ¿Qué tan peligroso es el pH?",
                    "⚗️ Reporte químico: Neutralizando soluciones ácidas en el laboratorio."
                ]
            }
        ],
        Biologia: [
            {
                id: "s-bio-2",
                titulo: "Fotosíntesis y Burbujas de Oxígeno",
                desc: "Coloca plantas acuáticas bajo focos de luz y cuenta las burbujas de oxígeno liberadas.",
                simTipo: "fotosintesis",
                preguntasObs: [
                    "A mayor intensidad de luz sobre la planta, se liberan más burbujas de gas (O2).",
                    "En la oscuridad total la planta produce 10 veces más burbujas.",
                    "Las hojas absorben oxígeno y expulsan dióxido de carbono continuamente."
                ],
                preguntasProb: [
                    "¿Cómo incide la intensidad lumínica en la tasa fotosintética de una planta?",
                    "¿Por qué las plantas son verdes cuando duermen?",
                    "¿Cuánto oxígeno necesita una piedra para respirar?"
                ],
                hipCondiciones: ["Aumentamos la intensidad del foco de luz", "Apagamos por completo la lámpara", "Cambiamos el agua por aceite vegetal"],
                hipEfectos: ["aumentará la tasa de producción de burbujas de oxígeno", "la producción de oxígeno descenderá a cero", "la planta cambiará de color a rojo fuego"],
                analisisOpciones: [
                    "La luz es la fuente de energía para descomponer el agua y fijar el carbono, produciendo O2.",
                    "La producción de oxígeno es totalmente aleatoria y no depende de la luz.",
                    "Las plantas no realizan fotosíntesis en agua."
                ],
                conclusionesOpciones: [
                    "Se valida: La tasa fotosintética tiene relación directa con la energía lumínica disponible.",
                    "Se refuta: La planta no produjo ninguna burbuja bajo luz intensa.",
                    "Incierto por falta de conteo de burbujas."
                ],
                titularesCom: [
                    "🌿 ¡Fábricas de vida!: Midiendo el oxígeno producido por plantas acuáticas.",
                    "☀️ Luz convertida en aire puro: El milagro de la fotosíntesis escolar.",
                    "🫧 Burbujas verdes: Cómo los vegetales alimentan al planeta."
                ]
            }
        ]
    },
    Preparatoria: {
        Fisica: [
            {
                id: "p-fis-1",
                titulo: "Tiro Parabólico y Cinemática 2D",
                desc: "Calcula el ángulo de disparo óptimo para maximizar el alcance horizontal.",
                simTipo: "parabolico",
                preguntasObs: [
                    "El proyectil describe una trayectoria en parábola curva por culpa de la gravedad.",
                    "El objeto viaja en línea recta horizontal infinita sin caer al suelo.",
                    "A 90 grados el proyectil logra la máxima distancia horizontal."
                ],
                preguntasProb: [
                    "¿Qué ángulo de lanzamiento garantiza el alcance horizontal máximo sin fricción?",
                    "¿Por qué los proyectiles se vuelven más ligeros en el aire?",
                    "¿Cómo influye el color del cañón en la distancia de impacto?"
                ],
                hipCondiciones: ["Disparamos con un ángulo de 45°", "Disparamos a 85° casi vertical", "Duplicamos la velocidad inicial V0"],
                hipEfectos: ["se obtendrá el alcance horizontal más largo posible", "el proyectil caerá sobre el cañón", "el alcance aumentará 4 veces"],
                analisisOpciones: [
                    "A 45 grados se optimiza el producto de sen(θ)·cos(θ), maximizando la distancia horizontal X.",
                    "El alcance solo depende del peso del proyectil y no del ángulo.",
                    "La gravedad acelera los objetos hacia arriba en tiro parabólico."
                ],
                conclusionesOpciones: [
                    "Se confirma: 45° es el ángulo de alcance máximo bajo aceleración gravitatoria constante.",
                    "Se refuta: Los tiros rasantes a 10° llegaron más lejos que a 45°.",
                    "Sin datos balísticos suficientes."
                ],
                titularesCom: [
                    "🎯 Balística cuántica: El ángulo perfecto de 45° demostrado con física.",
                    "🚀 Trayectorias curvas: Dominando el tiro parabólico en preparatoria.",
                    "📐 Vectores de velocidad y gravedad: El secreto de los lanzamientos."
                ]
            }
        ],
        Quimica: [
            {
                id: "p-qui-1",
                titulo: "Ley de los Gases Ideales (P·V = n·R·T)",
                desc: "Comprime un cilindro de gas o enfríalo y observa cómo sube la presión en el manómetro.",
                simTipo: "gas",
                preguntasObs: [
                    "Al comprimir el pistón reduciendo el volumen, la aguja de presión se dispara.",
                    "Al calentar el gas, la presión baja a cero de inmediato.",
                    "El volumen del gas nunca puede cambiar aunque bajemos el émbolo."
                ],
                preguntasProb: [
                    "¿Cómo se comporta la presión de un gas cuando reducimos su volumen a temperatura fija?",
                    "¿Por qué los gases no tienen moléculas en su interior?",
                    "¿De qué color es la masa de un gas ideal en reposo?"
                ],
                hipCondiciones: ["Reducimos el volumen del pistón a la mitad (Ley de Boyle)", "Aumentamos la temperatura al doble (Ley de Gay-Lussac)", "Extraemos la mitad de los moles de gas"],
                hipEfectos: ["la presión medida se duplicará", "la presión caerá a cero atmósferas", "el émbolo flotará sin peso"],
                analisisOpciones: [
                    "La presión y el volumen son inversamente proporcionales cuando la temperatura es constante.",
                    "Los gases ideales no sufren cambios de presión al comprimirse.",
                    "La temperatura no altera la energía de los choques moleculares."
                ],
                conclusionesOpciones: [
                    "Se confirma la ecuación de estado: P·V = n·R·T describe el comportamiento del sistema.",
                    "Se refuta: La presión disminuyó al achicar el volumen.",
                    "Incierto por fuga en el émbolo virtual."
                ],
                titularesCom: [
                    "💨 ¡Pistón bajo fuego!: Comprobando la Ley de los Gases Ideales.",
                    "🎈 De Boyle a Gay-Lussac: El universo molecular de la presión.",
                    "🌡️ Comprimiendo gases: Qué ocurre cuando encierras millones de moléculas."
                ]
            }
        ],
        Biologia: [
            {
                id: "p-bio-1",
                titulo: "Genética Mendeliana: Cruces de Punnett",
                desc: "Cruza plantas de flores rojas (RR) y blancas (rr) para descubrir las proporciones de Mendel.",
                simTipo: "genetica",
                preguntasObs: [
                    "En la primera generación todas las flores son rojas, pero el gen blanco reaparece en la F2.",
                    "Los genes de los padres se borran y se generan mutaciones sin herencia.",
                    "El 100% de los descendientes siempre son flores azules sin relación parental."
                ],
                preguntasProb: [
                    "¿Cuáles son las proporciones fenotípicas resultantes al cruzar dos individuos heterocigotos (Rr x Rr)?",
                    "¿Por qué las plantas deciden qué color de flor usar según su estado de ánimo?",
                    "¿Cómo influye la música clásica en los alelos de un guisante?"
                ],
                hipCondiciones: ["Cruzamos dos plantas heterocigotas Rr x Rr", "Cruzamos un homocigoto dominante con uno recesivo (RR x rr)", "Cruzamos dos homocigotos recesivos rr x rr"],
                hipEfectos: ["obtendremos una proporción 3:1 de flores rojas vs blancas", "todos los descendientes serán 100% idénticos al padre", "no nacerá ninguna semilla fértil"],
                analisisOpciones: [
                    "La segregación de alelos explica la aparición de una proporción 3 dominantes por cada 1 recesivo en F2.",
                    "La genética mendeliana no funciona con caracteres hereditarios simples.",
                    "Los alelos recesivos desaparecen para siempre del ADN."
                ],
                conclusionesOpciones: [
                    "Se valida: Las leyes de Mendel describen la probabilidad exacta de herencia biológica.",
                    "Se refuta: Los resultados contradicen el cuadro de Punnett.",
                    "Muestra estadística demasiado pequeña para validar proporciones."
                ],
                titularesCom: [
                    "🧬 El código de la herencia: Descifrando las proporciones de Mendel.",
                    "🌸 De flores rojas y blancas: La magia oculta de los alelos recesivos.",
                    "🎲 Probabilidad y vida: Cómo los cuadros de Punnett predicen rasgos."
                ]
            }
        ]
    }
};

/* ==========================================
   MODAL CONFIGURACIÓN API KEY / NUBE
   ========================================== */
function toggleModalConfig() {
    $("modal-config").classList.toggle("hidden");
    $("input-api-key").value = localStorage.getItem("nexora_gemini_key") || "";
}

function guardarApiKey() {
    const key = $("input-api-key").value.trim();
    if (key) {
        localStorage.setItem("nexora_gemini_key", key);
        alert("¡Clave de IA en la nube guardada con éxito!");
    } else {
        localStorage.removeItem("nexora_gemini_key");
        alert("Clave eliminada. Se utilizará la IA Local autónoma.");
    }
    toggleModalConfig();
}

/* ==========================================
   NAVEGACIÓN DE MISIONES Y LABORATORIO
   ========================================== */
function seleccionarNivel(nivel) {
    nivelActual = nivel;
    $("menu-niveles").classList.add("hidden");
    $("titulo-nivel").innerText = `Misiones para ${nivel}`;
    $("menu-materias").classList.remove("hidden");
    filtrarMateria("Fisica");
}

function volverMenuNiveles() {
    $("menu-materias").classList.add("hidden");
    $("menu-niveles").classList.remove("hidden");
}

function filtrarMateria(materia) {
    materiaActual = materia;
    document.querySelectorAll(".subject-btn").forEach(btn => btn.classList.remove("active"));
    const btnActivo = document.getElementById(`btn-mat-${materia}`);
    if (btnActivo) btnActivo.classList.add("active");

    const lista = $("lista-temas");
    lista.innerHTML = "";

    const experimentos = dbExperimentos[nivelActual]?.[materia] || [];
    experimentos.forEach(exp => {
        const item = document.createElement("div");
        item.className = "exp-item";
        item.style.cssText = "background:var(--level-card-bg); border:1px solid var(--level-card-border); padding:14px; border-radius:10px; cursor:pointer; margin-bottom:8px;";
        item.innerHTML = `<h4 style="color:var(--text-main); margin-bottom:4px;">${exp.titulo}</h4><p style="color:var(--text-muted); font-size:13px;">${exp.desc}</p>`;
        item.onclick = () => iniciarMisionLaboratorio(exp);
        lista.appendChild(item);
    });
}

function volverAMaterias() {
    detenerCanvasAnim();
    $("vista-laboratorio").classList.add("hidden");
    $("menu-materias").classList.remove("hidden");
}

function iniciarMisionLaboratorio(exp) {
    expActual = exp;
    userSession = {
        observacionSeleccionada: "",
        observacionLibre: "",
        problemaSeleccionado: "",
        hipotesisCondicion: "",
        hipotesisEfecto: "",
        ensayos: [],
        analisisSeleccionado: "",
        conclusionSeleccionada: "",
        conclusionTexto: "",
        comunicacionTitular: ""
    };

    $("lab-titulo").innerText = exp.titulo;
    $("lab-tag").innerText = materiaActual.toUpperCase();

    poblarOpcionesPaso1(exp);
    poblarOpcionesPaso2(exp);
    poblarConstructorPaso3(exp);
    configurarSimuladorPaso4(exp);
    poblarOpcionesPaso5(exp);
    poblarOpcionesPaso6(exp);
    poblarOpcionesPaso7(exp);

    $("menu-materias").classList.add("hidden");
    $("vista-laboratorio").classList.remove("hidden");

    if (exp.simTipo === "circuito") {
        abrirConstructorCircuito();
    } else {
        cambiarPaso(1);
    }
}

function cambiarPaso(paso) {
    pasoActual = paso;
    document.querySelectorAll(".step-card").forEach(c => c.classList.add("hidden"));

    const cardActual = document.querySelector(`.step-card[data-paso="${paso}"]`);
    if (cardActual) cardActual.classList.remove("hidden");

    const titulos = [
        "1. Observación", "2. Pregunta Problema", "3. Formulación de Hipótesis",
        "4. Experimentación Virtual", "5. Análisis de Mediciones", "6. Conclusión", "7. Divulgación"
    ];

    $("step-name").innerText = `Paso ${paso}/7: ${titulos[paso - 1]}`;
    $("progress-fill").style.width = `${(paso / 7) * 100}%`;

    detenerCanvasAnim();

    if (paso === 1) {
        arrancarCanvas("canvas-obs", expActual.simTipo, true);
    } else if (paso === 4) {
        arrancarCanvas("canvas-exp", expActual.simTipo, false);
    } else if (paso === 6) {
        const hipResumen = `Si ${userSession.hipotesisCondicion || '...'}, entonces ${userSession.hipotesisEfecto || '...'}.`;
        $("txt-recordatorio-hip").innerText = `"${hipResumen}"`;
    }
}

function avanzarPaso(pasoActualNum, pasoSiguiente) {
    if (pasoActualNum === 1 && !userSession.observacionSeleccionada) {
        alert("¡Selecciona al menos una observación de la lista para continuar!");
        return;
    }
    if (pasoActualNum === 2 && !userSession.problemaSeleccionado) {
        const probLibre = $("input-problema-libre")?.value.trim() || "";
        if (!probLibre) {
            alert("¡Elige una pregunta de investigación o escribe una en el campo personalizado!");
            return;
        }
        userSession.problemaSeleccionado = probLibre;
    }
    if (pasoActualNum === 5 && !userSession.analisisSeleccionado) {
        alert("¡Selecciona la tendencia que descubriste en tus datos!");
        return;
    }
    if (pasoActualNum === 6 && !userSession.conclusionSeleccionada) {
        alert("¡Elige si tu hipótesis fue confirmada o refutada con tus resultados!");
        return;
    }
    cambiarPaso(pasoSiguiente);
}

/* ==========================================
   POBLAR OPCIONES DE LOS 7 PASOS
   ========================================== */
function poblarOpcionesPaso1(exp) {
    const contenedor = $("quiz-obs-options");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    exp.preguntasObs.forEach(texto => {
        const opt = document.createElement("div");
        opt.className = "quiz-option";
        opt.innerText = texto;
        opt.onclick = () => {
            contenedor.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            userSession.observacionSeleccionada = texto;
        };
        contenedor.appendChild(opt);
    });
}

function poblarOpcionesPaso2(exp) {
    const contenedor = $("quiz-problema-options");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    exp.preguntasProb.forEach(texto => {
        const opt = document.createElement("div");
        opt.className = "quiz-option";
        opt.innerText = texto;
        opt.onclick = () => {
            contenedor.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            userSession.problemaSeleccionado = texto;
        };
        contenedor.appendChild(opt);
    });
}

function toggleCustomInput(id) {
    $(id).classList.toggle("hidden");
}

function poblarConstructorPaso3(exp) {
    const selectCond = $("hb-condicion");
    const selectEf = $("hb-efecto");
    if (!selectCond || !selectEf) return;
    selectCond.innerHTML = "";
    selectEf.innerHTML = "";

    exp.hipCondiciones.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        selectCond.appendChild(opt);
    });

    exp.hipEfectos.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e; opt.textContent = e;
        selectEf.appendChild(opt);
    });

    actualizarPrevisualizacionHipotesis();
}

function actualizarPrevisualizacionHipotesis() {
    const c = $("hb-condicion")?.value || "";
    const e = $("hb-efecto")?.value || "";
    userSession.hipotesisCondicion = c;
    userSession.hipotesisEfecto = e;
    if ($("hb-preview-text")) $("hb-preview-text").innerText = `"Si ${c.toLowerCase()}, entonces ${e.toLowerCase()}."`;
}

function poblarOpcionesPaso5(exp) {
    const contenedor = $("quiz-analisis-options");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    exp.analisisOpciones.forEach(txt => {
        const opt = document.createElement("div");
        opt.className = "quiz-option";
        opt.innerText = txt;
        opt.onclick = () => {
            contenedor.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            userSession.analisisSeleccionado = txt;
        };
        contenedor.appendChild(opt);
    });
}

function poblarOpcionesPaso6(exp) {
    const contenedor = $("quiz-conclusion-options");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    exp.conclusionesOpciones.forEach(txt => {
        const opt = document.createElement("div");
        opt.className = "quiz-option";
        opt.innerText = txt;
        opt.onclick = () => {
            contenedor.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            userSession.conclusionSeleccionada = txt;
        };
        contenedor.appendChild(opt);
    });
}

function poblarOpcionesPaso7(exp) {
    const contenedor = $("quiz-comunicacion-options");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    exp.titularesCom.forEach(txt => {
        const opt = document.createElement("div");
        opt.className = "quiz-option";
        opt.innerText = txt;
        opt.onclick = () => {
            contenedor.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            userSession.comunicacionTitular = txt;
        };
        contenedor.appendChild(opt);
    });
}

/* ==========================================
   SIMULADORES Y CONTROLES PASO 4
   ========================================== */
let simVars = { param1: 35 };

function configurarSimuladorPaso4(exp) {
    const contenedor = $("sim-controls-container");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    if ($("tabla-registros")) {
        $("tabla-registros").innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Sin ensayos. ¡Presiona el botón para registrar datos!</td></tr>`;
    }

    if (exp.simTipo === "fuerza" || exp.simTipo === "choque" || exp.simTipo === "newton") {
        simVars.fuerza = 14;
        simVars.masa = 2.0;
        contenedor.innerHTML = `
            <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.8rem;">
                    <span>Fuerza Aplicada: <b id="val-ctrl-fuerza">14</b> N</span>
                </div>
                <input type="range" class="slider" min="5" max="80" value="14" oninput="actualizarVarFuerza(this.value)">
            </div>
            <div style="margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.8rem;">
                    <span>Masa del Carro: <b id="val-ctrl-masa">2.0</b> kg</span>
                </div>
                <input type="range" class="slider" min="0.5" max="5.0" step="0.5" value="2.0" oninput="actualizarVarMasa(this.value)">
            </div>
            <button class="primary-btn" style="width:100%; margin-top:0;" onclick="lanzarPruebaNewton()">▶ Aplicar Impulso y Medir</button>
        `;
    } else if (exp.simTipo === "ph") {
        contenedor.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <button class="btn btn-muted btn-sm" style="flex:1;" onclick="accionarReactivoPH('acido')">+ Ácido Clorhídrico</button>
                <button class="btn btn-muted btn-sm" style="flex:1;" onclick="accionarReactivoPH('base')">+ Hidróxido de Sodio</button>
            </div>
            <div style="text-align:center; font-size:0.85rem;">pH actual: <b id="val-ph-live" style="color:var(--cyan); font-size:1.1rem;">7.00</b></div>
        `;
    } else if (exp.simTipo === "circuito") {
        contenedor.innerHTML = `
            <div style="margin-bottom:10px;">
                <div style="font-size:0.8rem;">Voltaje de Batería: <b id="val-ctrl1">9</b> V</div>
                <input type="range" class="slider" min="1" max="24" value="9" oninput="actualizarSlider(1, this.value, ' V')">
            </div>
            <button class="primary-btn" style="width:100%; margin-top:0;" onclick="ejecutarEnsayoSimulado('Medición de Circuito')">💡 Medir Intensidad Lumínica</button>
        `;
    } else {
        contenedor.innerHTML = `
            <div style="margin-bottom:10px;">
                <div style="font-size:0.8rem;">Intensidad de Entrada: <b id="val-ctrl1">50</b> %</div>
                <input type="range" class="slider" min="10" max="100" value="50" oninput="actualizarSlider(1, this.value, ' %')">
            </div>
            <button class="primary-btn" style="width:100%; margin-top:0;" onclick="ejecutarEnsayoSimulado('Medición Sensorial')">🚀 Registrar Lectura</button>
        `;
    }
}

function actualizarVarFuerza(val) {
    simVars.fuerza = parseFloat(val);
    const tag = $("val-ctrl-fuerza");
    if (tag) tag.innerText = val;
}

function actualizarVarMasa(val) {
    simVars.masa = parseFloat(val);
    const tag = $("val-ctrl-masa");
    if (tag) tag.innerText = parseFloat(val).toFixed(1);
}

function lanzarPruebaNewton() {
    const fuerza = simVars.fuerza || 14;
    const masa = simVars.masa || 2.0;
    const aceleracion = (fuerza / masa).toFixed(2);

    simVars.impulsoActivo = true;
    simVars.velocidadAcc = parseFloat(aceleracion);

    registrarFilaTabla(`F = ${fuerza} N, m = ${masa} kg`, `Aceleración = ${aceleracion} m/s²`, "Completado");
    experiments++;
    addActivity("Ensayo en simulador de Newton");
}

function actualizarSlider(num, val, unit) {
    simVars.param1 = parseFloat(val);
    const tag = $(`val-ctrl${num}`);
    if (tag) tag.innerText = val + unit;
}

function accionarReactivoPH(tipo) {
    if (tipo === 'acido') {
        simVars.param1 = Math.max(1.0, simVars.param1 - 1.2);
    } else {
        simVars.param1 = Math.min(14.0, simVars.param1 + 1.2);
    }
    const valTag = $("val-ph-live");
    if (valTag) valTag.innerText = simVars.param1.toFixed(2);

    registrarFilaTabla(`Gotas de ${tipo.toUpperCase()}`, `pH = ${simVars.param1.toFixed(2)}`, simVars.param1 < 7 ? "Ácido" : simVars.param1 > 7 ? "Base" : "Neutro");
    experiments++;
    addActivity("Modificación de pH");
}

function ejecutarEnsayoSimulado(nombreAccion) {
    let medicion = `Respuesta = ${(simVars.param1 * 1.34).toFixed(1)} unidades`;
    registrarFilaTabla(`${nombreAccion} (${simVars.param1})`, medicion, "Registro Válido");
    experiments++;
    addActivity("Ensayo simulado estándar");
}

function registrarFilaTabla(control, resultado, estado) {
    const tabla = $("tabla-registros");
    if (!tabla) return;
    if (userSession.ensayos.length === 0) tabla.innerHTML = "";

    const num = userSession.ensayos.length + 1;
    userSession.ensayos.push({ num, control, resultado, estado });

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><b>#${num}</b></td>
        <td>${control}</td>
        <td style="color:var(--cyan); font-weight:600;">${resultado}</td>
        <td><span class="pill online">${estado}</span></td>
    `;
    tabla.appendChild(tr);
}

function detenerCanvasAnim() {
    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
    }
}

/* ==========================================
   RENDERIZADO DE ANIMACIONES EN CANVAS
   ========================================== */
function arrancarCanvas(canvasId, tipo, esDemo) {
    detenerCanvasAnim();
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let xPos = 40;
    let t = 0;
    let velocidadActual = 0;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.04;

        if (tipo === "fuerza" || tipo === "newton") {
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 30);
            ctx.lineTo(canvas.width, canvas.height - 30);
            ctx.stroke();

            if (esDemo) {
                xPos = 120 + Math.sin(t * 2) * 80;
            } else {
                if (simVars.impulsoActivo) {
                    velocidadActual = (simVars.velocidadAcc || 2.0) * 0.4;
                    simVars.impulsoActivo = false;
                }
                if (velocidadActual > 0.05) {
                    xPos += velocidadActual;
                    velocidadActual *= 0.96;
                } else {
                    velocidadActual = 0;
                }
                if (xPos >= canvas.width - 70) xPos = canvas.width - 70;
            }

            ctx.fillStyle = "#24d9f2";
            ctx.shadowColor = "#24d9f2";
            ctx.shadowBlur = 10;
            ctx.fillRect(xPos, canvas.height - 65, 60, 25);
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(xPos + 12, canvas.height - 38, 7, 0, Math.PI * 2);
            ctx.arc(xPos + 48, canvas.height - 38, 7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = "#9b7bff";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#9b7bff";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 20) {
                let y = (canvas.height / 2) + Math.sin(t + i * 0.05) * 35;
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        animId = requestAnimationFrame(render);
    }
    render();
}

/* ==========================================
   EVALUACIÓN FINAL (IA HÍBRIDA)
   ========================================== */
async function ejecutarEvaluacionFinal() {
    $("vista-laboratorio").classList.add("hidden");
    $("vista-evaluacion").classList.remove("hidden");

    const loader = $("eval-loader");
    const content = $("eval-content");
    const motorTag = $("eval-motor");
    const rankTag = $("eval-badge-rank");

    if (loader) loader.classList.remove("hidden");
    if (content) content.innerHTML = "";

    userSession.conclusionTexto = $("input-conclusion-texto")?.value.trim() || "";

    const apiKey = localStorage.getItem("nexora_gemini_key");
    let dictamen = null;

    if (navigator.onLine && apiKey) {
        try {
            if (motorTag) motorTag.innerText = "IA Global Cloud (Google Gemini)";
            dictamen = await consultarIAGlobalGemini(apiKey);
        } catch (err) {
            console.warn("Fallo nube, conmutando a IA Local:", err);
            if (motorTag) motorTag.innerText = "IA Local Autónoma (Offline)";
            dictamen = evaluarConIALocalAdaptada();
        }
    } else {
        if (motorTag) motorTag.innerText = "IA Local Autónoma (Offline)";
        dictamen = evaluarConIALocalAdaptada();
    }

    if (loader) loader.classList.add("hidden");

    if (rankTag) {
        if (dictamen.puntaje >= 90) {
            rankTag.innerText = "🏆 Maestro del Cosmos";
        } else if (dictamen.puntaje >= 75) {
            rankTag.innerText = "⚡ Investigador Cuántico";
        } else {
            rankTag.innerText = "🌱 Explorador Novato";
        }
    }

    let htmlPasos = "";
    dictamen.rubrica.forEach(item => {
        htmlPasos += `
            <div style="background:var(--box-inner-bg); border-left:3px solid ${item.aprobado ? 'var(--green)' : 'var(--neon-amber)'}; padding:10px; margin-bottom:8px; border-radius:6px; font-size:0.82rem;">
                <b>${item.aprobado ? '✔ Logrado' : '⚠️ Atención'} - ${item.paso}:</b>
                <p style="color:var(--muted); margin-top:2px;">${item.mensaje}</p>
            </div>
        `;
    });

    if (content) {
        content.innerHTML = `
            <div style="font-size:2.2rem; font-weight:900; text-align:center; color:var(--cyan); margin:10px 0;">${dictamen.puntaje} / 100 PTS</div>
            <p style="text-align:center; font-size:0.85rem; color:var(--text-main); margin-bottom:14px;">${dictamen.mensajeGeneral}</p>
            <div>${htmlPasos}</div>
        `;
    }
}

function evaluarConIALocalAdaptada() {
    let score = 0;
    let rubrica = [];

    if (userSession.observacionSeleccionada) {
        score += 20;
        rubrica.push({ paso: "1. Observación", aprobado: true, mensaje: "Identificaste el fenómeno correctamente." });
    } else {
        rubrica.push({ paso: "1. Observación", aprobado: false, mensaje: "Faltó seleccionar una observación." });
    }

    if (userSession.problemaSeleccionado) {
        score += 20;
        rubrica.push({ paso: "2. Planteamiento", aprobado: true, mensaje: "Pregunta problema configurada con éxito." });
    }

    if (userSession.hipotesisCondicion && userSession.hipotesisEfecto) {
        score += 20;
        rubrica.push({ paso: "3. Hipótesis", aprobado: true, mensaje: "Estructura causal lógica completada." });
    }

    if (userSession.ensayos.length >= 1) {
        score += 20;
        rubrica.push({ paso: "4. Experimentación", aprobado: true, mensaje: `Registraste ${userSession.ensayos.length} ensayos virtuales.` });
    } else {
        score += 5;
        rubrica.push({ paso: "4. Experimentación", aprobado: false, mensaje: "No se realizaron ensayos suficientes." });
    }

    if (userSession.conclusionSeleccionada) {
        score += 20;
        rubrica.push({ paso: "5 & 6. Conclusión", aprobado: true, mensaje: "Conclusión contrastada con datos empíricos." });
    } else {
        score += 10;
        rubrica.push({ paso: "5 & 6. Conclusión", aprobado: false, mensaje: "Faltó definir la conclusión final." });
    }

    return {
        puntaje: score,
        mensajeGeneral: score >= 80 ? "¡Excelente trabajo científico!" : "¡Buen intento! Continúa practicando.",
        rubrica
    };
}

async function consultarIAGlobalGemini(apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Evalúa al estudiante de ${nivelActual} en ${expActual.titulo}. Devuelve un JSON con: puntaje (60-100), mensajeGeneral, rubrica ([{paso, aprobado, mensaje}]).`;

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) throw new Error("Fallo API Nube");
    const data = await res.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
}

function revisarPasoActual() {
    $("vista-evaluacion").classList.add("hidden");
    $("vista-laboratorio").classList.remove("hidden");
    cambiarPaso(4);
}

function reiniciarALista() {
    detenerCanvasAnim();
    $("vista-evaluacion").classList.add("hidden");
    $("menu-materias").classList.remove("hidden");
}

/* ==========================================
   CONSTRUCTOR DE CIRCUITOS GUIADO
   ========================================== */
function abrirConstructorCircuito() {
    const modal = $("modal-builder-circuito");
    if (modal) modal.classList.remove("hidden");
    if ($("builder-step-tag")) $("builder-step-tag").innerText = "Paso 1 de 3";
    if ($("builder-instruction")) $("builder-instruction").innerText = "1. Haz clic en la Batería para energizar el circuito:";
    if ($("btn-comp-bateria")) $("btn-comp-bateria").classList.remove("hidden");
    if ($("btn-comp-cable")) $("btn-comp-cable").classList.add("hidden");
    if ($("btn-comp-foco")) $("btn-comp-foco").classList.add("hidden");
    if ($("btn-finish-circuit")) $("btn-finish-circuit").classList.add("hidden");
    if ($("builder-preview")) $("builder-preview").innerHTML = "<i>Tablero de pruebas listo...</i>";
}

function agregarComponenteCircuito(tipo) {
    const preview = $("builder-preview");
    if (!preview) return;

    if (tipo === 'bateria') {
        preview.innerHTML = "🔋 <b>Batería colocada.</b> Falta conectar conductores.";
        $("btn-comp-bateria").classList.add("hidden");
        $("btn-comp-cable").classList.remove("hidden");
        $("builder-step-tag").innerText = "Paso 2 de 3";
        $("builder-instruction").innerText = "2. Conecta los cables conductores:";
    } else if (tipo === 'cable') {
        preview.innerHTML = "🔋 Batería + ⚡ <b>Cables conectados.</b> Falta el foco.";
        $("btn-comp-cable").classList.add("hidden");
        $("btn-comp-foco").classList.remove("hidden");
        $("builder-step-tag").innerText = "Paso 3 de 3";
        $("builder-instruction").innerText = "3. Instala la bombilla para cerrar el circuito:";
    } else if (tipo === 'foco') {
        preview.innerHTML = "✅ <b>¡Circuito Completo!</b>";
        $("btn-comp-foco").classList.add("hidden");
        $("builder-step-tag").innerText = "Completado";
        $("builder-instruction").innerText = "¡Todo listo para observar!";
        $("btn-finish-circuit").classList.remove("hidden");
    }
}

function completarConstruccionCircuito() {
    $("modal-builder-circuito").classList.add("hidden");
    cambiarPaso(1);
}

/* ==========================================
   EVALUACIONES DE 100 PUNTOS (QUIZ GENERAL)
   ========================================== */
const questions = [
    {
        question: "¿Qué fórmula permite calcular la velocidad media?",
        options: ["Distancia ÷ tiempo", "Tiempo ÷ distancia", "Distancia × masa"],
        answer: 0,
        explanation: "La velocidad media se calcula dividiendo la distancia entre el tiempo empleado."
    },
    {
        question: "¿Qué establece la ley de Ohm?",
        options: ["Relación masa-volumen", "Relación voltaje, corriente y resistencia (V = I · R)", "Relación luz-temperatura"],
        answer: 1,
        explanation: "La ley de Ohm se expresa como V = I · R."
    },
    {
        question: "¿Qué ocurre cuando la sal se disuelve en agua?",
        options: ["Se forma una mezcla homogénea", "Se convierte en un metal", "Desaparece la materia"],
        answer: 0,
        explanation: "La sal se dispersa en el agua formando una disolución homogénea."
    },
    {
        question: "¿Qué estructura contiene el material genético principal de una célula eucariota?",
        options: ["Membrana", "Núcleo", "Pared celular"],
        answer: 1,
        explanation: "El núcleo contiene el ADN de las células eucariotas."
    },
    {
        question: "¿Qué necesita una planta para realizar la fotosíntesis?",
        options: ["Luz, agua y dióxido de carbono", "Arena, aceite y sal", "Únicamente oxígeno"],
        answer: 0,
        explanation: "La fotosíntesis utiliza energía luminosa, agua y CO2."
    }
];

let currentQuestion = 0;
let questionAnswered = false;
let sessionScore = 0;

function loadQuestion() {
    const counter = $("quizCounter");
    const questionEl = $("quizQuestion");
    const optionsEl = $("quizOptions");
    const feedback = $("quizFeedback");
    const nextBtn = $("nextQuestion");

    if (!counter || !questionEl || !optionsEl) return;

    const question = questions[currentQuestion];
    counter.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    questionEl.textContent = question.question;
    if (feedback) feedback.classList.add("hidden");
    if (nextBtn) nextBtn.classList.add("hidden");

    optionsEl.innerHTML = "";
    questionAnswered = false;

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.textContent = option;
        button.style.cssText = "display:block; width:100%; text-align:left; margin-bottom:8px; padding:10px; background:var(--level-card-bg); border:1px solid var(--border); border-radius:8px; color:var(--text-main); cursor:pointer;";
        button.addEventListener("click", () => selectAnswer(index));
        optionsEl.appendChild(button);
    });
}

function selectAnswer(index) {
    if (questionAnswered) return;
    questionAnswered = true;

    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll("#quizOptions .quiz-option");
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = index === question.answer;
    const feedback = $("quizFeedback");
    const nextBtn = $("nextQuestion");

    if (isCorrect) {
        sessionScore++;
        correctAnswers++;
        if (feedback) feedback.textContent = "¡Correcto! ⭐ " + question.explanation;
    } else {
        if (feedback) feedback.textContent = "Incorrecto. " + question.explanation;
    }

    if (feedback) feedback.classList.remove("hidden");
    if (nextBtn) nextBtn.classList.remove("hidden");

    buttons[question.answer].style.borderColor = "var(--green)";
    if (!isCorrect) {
        buttons[index].style.borderColor = "var(--neon-amber)";
    }

    addActivity(isCorrect ? "Respuesta correcta en evaluación" : "Pregunta revisada en evaluación");
}

const nextQuestionBtn = $("nextQuestion");
if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", function() {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            finishQuiz();
        } else {
            loadQuestion();
        }
    });
}

function finishQuiz() {
    const questionEl = $("quizQuestion");
    const optionsEl = $("quizOptions");
    const feedback = $("quizFeedback");
    const nextBtn = $("nextQuestion");
    const counter = $("quizCounter");
    const restartBtn = $("restartQuiz");

    if (questionEl) questionEl.textContent = "¡Evaluación terminada! 🎉";
    if (optionsEl) optionsEl.innerHTML = "";
    if (feedback) {
        feedback.classList.remove("hidden");
        feedback.textContent = `Obtuviste ${sessionScore} respuestas correctas de ${questions.length} (${Math.round((sessionScore/questions.length)*100)} PTS).`;
    }
    if (nextBtn) nextBtn.classList.add("hidden");
    if (counter) counter.textContent = "Finalizado";
    if (restartBtn) restartBtn.textContent = "Volver a intentar";
}

const restartQuizBtn = $("restartQuiz");
if (restartQuizBtn) {
    restartQuizBtn.addEventListener("click", function() {
        currentQuestion = 0;
        sessionScore = 0;
        this.textContent = "Reiniciar evaluación";
        loadQuestion();
    });
}

/* ==========================================
   ASISTENTE NEXOR-IA
   ========================================== */
function getAIResponse(question) {
    const text = question.toLowerCase();
    if (text.includes("hola") || text.includes("buenos")) {
        return "¡Hola! Soy NEXOR-IA, tu asistente científico. ¿Qué tema deseas explorar hoy?";
    }
    if (text.includes("velocidad") || text.includes("movimiento")) {
        return "En Física, la velocidad media es v = d / t. Puedes probarlo en el simulador.";
    }
    if (text.includes("ohm") || text.includes("electricidad")) {
        return "La ley de Ohm relaciona voltaje, corriente y resistencia mediante V = I · R.";
    }
    return "Interesante duda científica. Recuerda formular primero una hipótesis comprobable y verificar tus datos en el laboratorio.";
}

const chatForm = $("chatForm");
if (chatForm) {
    chatForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const input = $("chatInput");
        if (!input) return;
        const question = input.value.trim();
        if (!question) return;

        addChatMessage(question, "user-message");
        input.value = "";

        setTimeout(() => {
            const response = getAIResponse(question);
            addChatMessage(response, "bot-message");
        }, 400);
    });
}

function addChatMessage(text, className) {
    const chatMessages = $("chatMessages");
    if (!chatMessages) return;
    const message = document.createElement("div");
    message.className = "message " + className;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}