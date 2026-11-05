// ==========================================
// NEXORA LAB - FUNCIONES PRINCIPALES Y SIMULADORES
// ==========================================

const $ = (id) => document.getElementById(id);

let student = localStorage.getItem("nexoraStudent") || "";
let experiments = Number(localStorage.getItem("nexoraExperiments") || 0);
let correctAnswers = Number(localStorage.getItem("nexoraCorrect") || 0);
let history = JSON.parse(localStorage.getItem("nexoraHistory") || "[]");

// ==========================================
// GESTIÓN DE TEMA (MODO OSCURO / CLARO)
// ==========================================

function initTheme() {
    const savedTheme = localStorage.getItem("nexora_theme") || "dark";
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("nexora_theme", "light");
        const btn = $("themeToggleBtn");
        if (btn) btn.textContent = "☀️";
    } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("nexora_theme", "dark");
        const btn = $("themeToggleBtn");
        if (btn) btn.textContent = "🌙";
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const nextTheme = current === "light" ? "dark" : "light";
    applyTheme(nextTheme);
}

// ==========================================
// PROGRESO Y ACTIVIDADES
// ==========================================

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

    history = history.slice(0, 25);
    saveProgress();
}

function updateProgress() {
    const expCountEl = $("experimentCount");
    const quizScoreEl = $("quizScore");
    if (expCountEl) expCountEl.textContent = experiments;
    if (quizScoreEl) quizScoreEl.textContent = correctAnswers;

    const container = $("activityHistory");
    if (!container) return;

    if (history.length === 0) {
        container.textContent = "Todavía no tienes actividades registradas.";
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <strong>${escapeHTML(item.description)}</strong>
            <small>${escapeHTML(item.date)}</small>
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

// ==========================================
// INICIO Y CIERRE DE SESIÓN
// ==========================================

function enterApp(name) {
    student = name;
    localStorage.setItem("nexoraStudent", student);

    const loginScreen = $("loginScreen");
    const appScreen = $("app");
    if (loginScreen) loginScreen.classList.add("hidden");
    if (appScreen) appScreen.classList.remove("hidden");

    const welcomeName = $("welcomeName");
    const heroName = $("heroName");
    if (welcomeName) welcomeName.textContent = student;
    if (heroName) heroName.textContent = student;

    updateProgress();
}

const loginForm = $("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nameInput = $("studentName");
        const passwordInput = $("studentPassword");
        const name = nameInput ? nameInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

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

        const appScreen = $("app");
        const loginScreen = $("loginScreen");
        if (appScreen) appScreen.classList.add("hidden");
        if (loginScreen) loginScreen.classList.remove("hidden");
        if (loginForm) loginForm.reset();
    });
}

// ==========================================
// NAVEGACIÓN ENTRE SECCIONES
// ==========================================

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
        evaluacion: "Evaluaciones",
        progreso: "Mi progreso",
        ia: "Asistente NEXOR-IA"
    };

    const subtitles = {
        inicio: "Explora, experimenta y descubre.",
        fisica: "Modifica los valores y observa cómo cambian los resultados.",
        quimica: "Explora mezclas virtuales y descubre sus propiedades.",
        biologia: "Descubre cómo funcionan los seres vivos.",
        evaluacion: "Responde las preguntas y comprueba lo que has aprendido.",
        progreso: "Consulta las actividades que has realizado en este navegador.",
        ia: "Tu compañero para explorar el mundo de la ciencia."
    };

    const pageTitle = $("pageTitle");
    const pageSubtitle = $("pageSubtitle");
    if (pageTitle) pageTitle.textContent = titles[sectionId] || "Nexora LAB";
    if (pageSubtitle) pageSubtitle.textContent = subtitles[sectionId] || "Explora, experimenta y descubre.";

    if (sectionId === "progreso") updateProgress();

    const mainContent = document.querySelector(".main-content");
    if (mainContent) mainContent.scrollTop = 0;
}

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });
});

// ==========================================
// FÍSICA: VELOCIDAD (EJERCICIO ORIGINAL)
// ==========================================

function calculateSpeed() {
    const distance = Number($("distance").value);
    const time = Number($("time").value);

    if (!Number.isFinite(distance) || !Number.isFinite(time) || distance < 0 || time <= 0) {
        $("speedResult").textContent = "Introduce una distancia válida y un tiempo mayor que cero.";
        return;
    }

    const speed = distance / time;

    $("speedResult").innerHTML = `
        <strong>Resultado: ${speed.toFixed(2)} m/s</strong><br>
        Fórmula: velocidad = distancia ÷ tiempo.<br>
        Operación: ${distance} ÷ ${time} = ${speed.toFixed(2)} m/s.
    `;

    experiments++;
    addActivity("Simulación de velocidad en Física");
}

// ==========================================
// FÍSICA: LEY DE OHM (EJERCICIO ORIGINAL)
// ==========================================

function calculateOhm() {
    const voltage = Number($("voltage").value);
    const resistance = Number($("resistance").value);

    if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || voltage < 0 || resistance <= 0) {
        $("ohmResult").textContent = "Introduce valores válidos. La resistencia debe ser mayor que cero.";
        return;
    }

    const current = voltage / resistance;

    $("ohmResult").innerHTML = `
        <strong>Corriente: ${current.toFixed(2)} amperios</strong><br>
        Fórmula: I = V ÷ R.<br>
        Operación: ${voltage} ÷ ${resistance} = ${current.toFixed(2)} A.
    `;

    experiments++;
    addActivity("Simulación de la ley de Ohm");
}

// ==========================================
// FÍSICA: CONSTRUCTOR DE FÓRMULAS DINÁMICAS (FEATURE DEL VIDEO)
// ==========================================

const formulasConfig = {
    velocidad: {
        title: "Velocidad",
        formulaStr: "v = Distancia / Tiempo",
        procedureStr: "Se sustituyeron los valores introducidos en la fórmula seleccionada.",
        unit: "m/s",
        fields: [
            { id: "dyn_distance", label: "Distancia (metros)", placeholder: "Introduce distancia", defaultVal: "12", min: "0", step: "any" },
            { id: "dyn_time", label: "Tiempo (segundos)", placeholder: "Introduce tiempo", defaultVal: "34", min: "0.0001", step: "any" }
        ],
        calculate: (vals) => {
            const d = parseFloat(vals.dyn_distance);
            const t = parseFloat(vals.dyn_time);
            if (isNaN(d) || isNaN(t) || t <= 0) return null;
            return d / t;
        }
    },
    fuerza: {
        title: "Fuerza (Segunda Ley de Newton)",
        formulaStr: "F = Masa × Aceleración",
        procedureStr: "Se sustituyeron los valores introducidos en la fórmula seleccionada.",
        unit: "N",
        fields: [
            { id: "dyn_mass", label: "Masa (kg)", placeholder: "Introduce masa", defaultVal: "10", min: "0", step: "any" },
            { id: "dyn_accel", label: "Aceleración (m/s²)", placeholder: "Introduce aceleración", defaultVal: "9.8", min: "0", step: "any" }
        ],
        calculate: (vals) => {
            const m = parseFloat(vals.dyn_mass);
            const a = parseFloat(vals.dyn_accel);
            if (isNaN(m) || isNaN(a)) return null;
            return m * a;
        }
    },
    densidad: {
        title: "Densidad",
        formulaStr: "d = Masa / Volumen",
        procedureStr: "Se sustituyeron los valores introducidos en la fórmula seleccionada.",
        unit: "kg/m³",
        fields: [
            { id: "dyn_mass", label: "Masa (kg)", placeholder: "Introduce masa", defaultVal: "50", min: "0", step: "any" },
            { id: "dyn_volume", label: "Volumen (m³)", placeholder: "Introduce volumen", defaultVal: "2", min: "0.0001", step: "any" }
        ],
        calculate: (vals) => {
            const m = parseFloat(vals.dyn_mass);
            const v = parseFloat(vals.dyn_volume);
            if (isNaN(m) || isNaN(v) || v <= 0) return null;
            return m / v;
        }
    },
    energia: {
        title: "Energía cinética",
        formulaStr: "Ec = 0.5 × Masa × (Velocidad)²",
        procedureStr: "Se sustituyeron los valores introducidos en la fórmula seleccionada.",
        unit: "J",
        fields: [
            { id: "dyn_mass", label: "Masa (kg)", placeholder: "Introduce masa", defaultVal: "15", min: "0", step: "any" },
            { id: "dyn_vel", label: "Velocidad (m/s)", placeholder: "Introduce velocidad", defaultVal: "4", min: "0", step: "any" }
        ],
        calculate: (vals) => {
            const m = parseFloat(vals.dyn_mass);
            const v = parseFloat(vals.dyn_vel);
            if (isNaN(m) || isNaN(v)) return null;
            return 0.5 * m * (v * v);
        }
    },
    ohm: {
        title: "Ley de Ohm",
        formulaStr: "I = Voltaje / Resistencia",
        procedureStr: "Se sustituyeron los valores introducidos en la fórmula seleccionada.",
        unit: "A",
        fields: [
            { id: "dyn_volt", label: "Voltaje (V)", placeholder: "Introduce voltaje", defaultVal: "12", min: "0", step: "any" },
            { id: "dyn_res", label: "Resistencia (Ω)", placeholder: "Introduce resistencia", defaultVal: "4", min: "0.0001", step: "any" }
        ],
        calculate: (vals) => {
            const v = parseFloat(vals.dyn_volt);
            const r = parseFloat(vals.dyn_res);
            if (isNaN(v) || isNaN(r) || r <= 0) return null;
            return v / r;
        }
    }
};

function onFormulaChange() {
    const select = $("formulaSelect");
    const container = $("formulaInputs");
    const calcBtn = $("calculateFormulaBtn");
    const badge = $("formulaResultBadge");
    const details = $("formulaResultDetails");
    const placeholder = $("formulaPlaceholder");

    if (!select || !container) return;

    const key = select.value;
    const config = formulasConfig[key];

    if (!config) {
        container.innerHTML = "";
        if (calcBtn) calcBtn.classList.add("hidden");
        if (badge) badge.classList.add("hidden");
        if (details) details.classList.add("hidden");
        if (placeholder) {
            placeholder.classList.remove("hidden");
            placeholder.textContent = "Selecciona una fórmula para comenzar.";
        }
        return;
    }

    container.innerHTML = config.fields.map(field => `
        <div>
            <label for="${field.id}">${field.label}</label>
            <input type="number" id="${field.id}" placeholder="${field.placeholder}" value="${field.defaultVal}" min="${field.min}" step="${field.step}">
        </div>
    `).join("");

    if (calcBtn) calcBtn.classList.remove("hidden");
    if (badge) badge.classList.add("hidden");
    if (details) details.classList.add("hidden");
    if (placeholder) {
        placeholder.classList.remove("hidden");
        placeholder.textContent = "Modifica las variables para calcular.";
    }
}

function calculateDynamicFormula() {
    const select = $("formulaSelect");
    if (!select) return;

    const key = select.value;
    const config = formulasConfig[key];
    if (!config) return;

    const vals = {};
    config.fields.forEach(f => {
        const input = $(f.id);
        vals[f.id] = input ? input.value : "";
    });

    const result = config.calculate(vals);

    const badge = $("formulaResultBadge");
    const badgeVal = $("formulaResultValue");
    const details = $("formulaResultDetails");
    const formulaText = $("formulaFormulaText");
    const procText = $("formulaProcedureText");
    const detailRes = $("formulaDetailResult");
    const placeholder = $("formulaPlaceholder");

    if (result === null || !Number.isFinite(result)) {
        if (placeholder) {
            placeholder.classList.remove("hidden");
            placeholder.textContent = "Introduce valores válidos mayores a cero para realizar el cálculo.";
        }
        if (badge) badge.classList.add("hidden");
        if (details) details.classList.add("hidden");
        return;
    }

    const formatted = parseFloat(result.toFixed(4)) + " " + config.unit;

    if (badgeVal) badgeVal.textContent = formatted;
    if (badge) badge.classList.remove("hidden");

    if (formulaText) formulaText.textContent = config.formulaStr;
    if (procText) procText.textContent = config.procedureStr;
    if (detailRes) detailRes.textContent = formatted;
    if (details) details.classList.remove("hidden");
    if (placeholder) placeholder.classList.add("hidden");

    experiments++;
    addActivity(`Cálculo de fórmula dinámica: ${config.title}`);
}

const formulaSelectEl = $("formulaSelect");
if (formulaSelectEl) {
    formulaSelectEl.addEventListener("change", onFormulaChange);
}

const calculateFormulaBtnEl = $("calculateFormulaBtn");
if (calculateFormulaBtnEl) {
    calculateFormulaBtnEl.addEventListener("click", calculateDynamicFormula);
}

// ==========================================
// QUÍMICA: MEZCLAS CONCEPTUALES (EJERCICIO ORIGINAL)
// ==========================================

const substanceNames = {
    agua: "agua",
    aceite: "aceite",
    sal: "sal",
    azucar: "azúcar",
    arena: "arena"
};

function mixSubstances() {
    const first = $("substanceOne").value;
    const second = $("substanceTwo").value;

    const beaker = $("beakerEmoji");
    if (beaker) {
        beaker.classList.remove("mixing");
        void beaker.offsetWidth;
        beaker.classList.add("mixing");
    }

    let result = "";

    if (first === second) {
        result = `Has seleccionado dos muestras de ${substanceNames[first]}. Al ser la misma sustancia, no estás combinando materiales diferentes.`;
    } else if (
        (first === "agua" && second === "sal") ||
        (first === "sal" && second === "agua")
    ) {
        result = "En condiciones habituales, la sal puede disolverse en agua y formar una mezcla homogénea.";
    } else if (
        (first === "agua" && second === "azucar") ||
        (first === "azucar" && second === "agua")
    ) {
        result = "El azúcar puede disolverse en agua. Se obtiene una mezcla homogénea.";
    } else if (
        (first === "agua" && second === "aceite") ||
        (first === "aceite" && second === "agua")
    ) {
        result = "El agua y el aceite no se mezclan de manera uniforme. Se observan dos fases.";
    } else if (
        (first === "agua" && second === "arena") ||
        (first === "arena" && second === "agua")
    ) {
        result = "La arena no se disuelve en agua. Sus partículas pueden quedar suspendidas y después sedimentarse.";
    } else if (
        (first === "aceite" && second === "sal") ||
        (first === "sal" && second === "aceite")
    ) {
        result = "La sal no se disuelve de manera apreciable en aceite. Se mantiene como material separado.";
    } else if (
        (first === "aceite" && second === "azucar") ||
        (first === "azucar" && second === "aceite")
    ) {
        result = "El azúcar no se disuelve de manera apreciable en aceite. La mezcla no es uniforme.";
    } else {
        result = "Esta combinación no se representa con suficiente detalle en este modelo. Investiga las propiedades de cada material.";
    }

    const mixResultEl = $("mixResult");
    if (mixResultEl) mixResultEl.textContent = result;

    experiments++;
    addActivity("Simulación conceptual de mezclas en Química");
}

// ==========================================
// BIOLOGÍA: FOTOSÍNTESIS (EJERCICIO ORIGINAL)
// ==========================================

const lightSliderEl = $("lightSlider");
if (lightSliderEl) {
    lightSliderEl.addEventListener("input", function() {
        const light = Number(this.value);

        $("lightValue").textContent = light + "%";

        if (light < 20) {
            $("plantEmoji").textContent = "🌱";
            $("photoResult").textContent =
                "Con poca luz, la fotosíntesis puede verse limitada. La planta necesita luz para realizar este proceso.";
        } else if (light < 70) {
            $("plantEmoji").textContent = "🌿";
            $("photoResult").textContent =
                "La planta cuenta con una intensidad de luz intermedia. La luz es uno de los factores que intervienen en la fotosíntesis.";
        } else {
            $("plantEmoji").textContent = "🌳";
            $("photoResult").textContent =
                "El modelo representa una disponibilidad alta de luz. Recuerda que la fotosíntesis también depende del agua, el dióxido de carbono y otros factores.";
        }
    });

    lightSliderEl.addEventListener("change", function() {
        experiments++;
        addActivity("Exploración del modelo de fotosíntesis");
    });
}

// ==========================================
// EVALUACIÓN (EJERCICIO ORIGINAL INTACTO)
// ==========================================

const questions = [
    {
        question: "¿Qué fórmula permite calcular la velocidad media?",
        options: [
            "Distancia ÷ tiempo",
            "Tiempo ÷ distancia",
            "Distancia × masa"
        ],
        answer: 0,
        explanation: "La velocidad media se calcula dividiendo la distancia recorrida entre el tiempo empleado."
    },
    {
        question: "¿Qué establece la ley de Ohm?",
        options: [
            "La relación entre masa y volumen",
            "La relación entre voltaje, corriente y resistencia",
            "La relación entre luz y temperatura"
        ],
        answer: 1,
        explanation: "La ley de Ohm se expresa como V = I × R."
    },
    {
        question: "¿Qué ocurre cuando la sal se disuelve en agua?",
        options: [
            "Se forma una mezcla homogénea",
            "Se convierte en un metal",
            "Desaparece la materia"
        ],
        answer: 0,
        explanation: "La sal se dispersa en el agua formando una disolución homogénea."
    },
    {
        question: "¿Qué estructura contiene el material genético de una célula eucariota?",
        options: [
            "Membrana",
            "Núcleo",
            "Pared celular"
        ],
        answer: 1,
        explanation: "El núcleo de las células eucariotas contiene la mayor parte del material genético."
    },
    {
        question: "¿Qué necesita una planta para realizar la fotosíntesis?",
        options: [
            "Luz, agua y dióxido de carbono",
            "Arena, aceite y sal",
            "Únicamente oxígeno"
        ],
        answer: 0,
        explanation: "La fotosíntesis utiliza energía luminosa, agua y dióxido de carbono para producir azúcares y liberar oxígeno."
    },
    {
        question: "¿Qué partícula tiene carga eléctrica negativa?",
        options: [
            "Protón",
            "Neutrón",
            "Electrón"
        ],
        answer: 2,
        explanation: "El electrón tiene carga negativa; el protón tiene carga positiva y el neutrón no tiene carga."
    }
];

let currentQuestion = 0;
let questionAnswered = false;
let sessionScore = 0;

function loadQuestion() {
    const question = questions[currentQuestion];
    if (!question) return;

    $("quizCounter").textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    $("quizQuestion").textContent = question.question;

    const feedback = $("quizFeedback");
    const nextBtn = $("nextQuestion");
    if (feedback) feedback.classList.add("hidden");
    if (nextBtn) nextBtn.classList.add("hidden");

    const container = $("quizOptions");
    if (!container) return;
    container.innerHTML = "";

    questionAnswered = false;

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.textContent = option;
        button.addEventListener("click", () => selectAnswer(index));
        container.appendChild(button);
    });
}

function selectAnswer(index) {
    if (questionAnswered) return;
    questionAnswered = true;

    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll(".quiz-option");

    buttons.forEach(button => button.disabled = true);

    const isCorrect = index === question.answer;

    if (isCorrect) {
        sessionScore++;
        correctAnswers++;
        $("quizFeedback").textContent = "¡Correcto! ⭐ " + question.explanation;
    } else {
        $("quizFeedback").textContent = "Todavía puedes aprender. " + question.explanation;
    }

    $("quizFeedback").classList.remove("hidden");
    $("nextQuestion").classList.remove("hidden");

    if (buttons[question.answer]) {
        buttons[question.answer].style.borderColor = "#54e6a5";
    }

    if (!isCorrect && buttons[index]) {
        buttons[index].style.borderColor = "#ff70b7";
    }

    addActivity(isCorrect
        ? "Respuesta correcta en evaluación"
        : "Pregunta revisada en evaluación"
    );
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
    $("quizQuestion").textContent = "¡Evaluación terminada! 🎉";
    $("quizOptions").innerHTML = "";

    const feedback = $("quizFeedback");
    feedback.classList.remove("hidden");
    feedback.textContent = `Obtuviste ${sessionScore} respuestas correctas de ${questions.length}.`;

    $("nextQuestion").classList.add("hidden");
    $("quizCounter").textContent = "Finalizado";

    $("restartQuiz").textContent = "Volver a intentar";
}

function restartQuiz() {
    currentQuestion = 0;
    sessionScore = 0;
    $("restartQuiz").textContent = "Reiniciar evaluación";
    loadQuestion();
}

const restartQuizBtn = $("restartQuiz");
if (restartQuizBtn) {
    restartQuizBtn.addEventListener("click", restartQuiz);
}

// ==========================================
// NEXOR-IA: ASISTENTE EDUCATIVO
// ==========================================

function getAIResponse(question) {
    const text = question.toLowerCase();

    if (text.includes("hola") || text.includes("buenos") || text.includes("saludos")) {
        return "¡Hola! Soy NEXOR-IA, tu asistente científico. Estoy aquí para ayudarte a comprender conceptos de Física, Química y Biología, y a resolver las fórmulas de tus experimentos.";
    }

    if (text.includes("formula") || text.includes("fórmula") || text.includes("calcular")) {
        return "En la pestaña de Física tienes el 'Constructor de fórmulas dinámicas'. Puedes seleccionar Velocidad (v=d/t), Fuerza (F=m·a), Densidad (d=m/V), Energía cinética (Ec=0.5·m·v²) o Ley de Ohm (I=V/R) para calcularlas con cualquier dato.";
    }

    if (text.includes("velocidad") || text.includes("movimiento") || text.includes("cinematica")) {
        return "En Física, la velocidad media indica qué distancia se recorre durante cierto tiempo. Su fórmula es v = d / t. Por ejemplo, si un auto recorre 100 metros en 10 segundos, su velocidad media es de 10 m/s.";
    }

    if (text.includes("fuerza") || text.includes("newton") || text.includes("aceleracion") || text.includes("aceleración")) {
        return "La Segunda Ley de Newton nos dice que la Fuerza neta aplicada a un objeto es igual a su masa multiplicada por su aceleración (F = m · a). Su unidad de medida es el Newton (N).";
    }

    if (text.includes("densidad") || text.includes("volumen") || text.includes("masa")) {
        return "La densidad (d o ρ) es la relación entre la masa de un cuerpo y el volumen que ocupa: d = m / V. Nos indica qué tan concentrada está la materia en un espacio determinado.";
    }

    if (text.includes("energia") || text.includes("energía") || text.includes("cinetica") || text.includes("cinética")) {
        return "La energía cinética es la energía que posee un cuerpo debido a su movimiento: Ec = 1/2 · m · v². Si duplicas la velocidad, ¡su energía cinética se cuadruplica!";
    }

    if (text.includes("ohm") || text.includes("electricidad") || text.includes("corriente") || text.includes("voltaje") || text.includes("resistencia")) {
        return "La ley de Ohm relaciona tres magnitudes eléctricas: voltaje (V), corriente (I) y resistencia (R). Su fórmula es V = I × R, o despejando la corriente: I = V / R. Puedes probarla en el laboratorio de Física.";
    }

    if (text.includes("atomo") || text.includes("átomo") || text.includes("proton") || text.includes("protón") || text.includes("electron") || text.includes("electrón") || text.includes("neutron") || text.includes("neutrón")) {
        return "Un átomo está formado por protones (carga positiva) y neutrones (sin carga) en su núcleo central, y electrones (carga negativa) orbitando a su alrededor.";
    }

    if (text.includes("mezcla") || text.includes("quimica") || text.includes("química") || text.includes("disolver") || text.includes("soluto") || text.includes("solvente")) {
        return "En Química, una mezcla es la combinación de dos o más sustancias. Es homogénea si forma una sola fase uniforme (como sal disuelta en agua), o heterogénea si se distinguen fases separadas (como agua y aceite).";
    }

    if (text.includes("fotosintesis") || text.includes("fotosíntesis") || text.includes("planta") || text.includes("clorofila")) {
        return "La fotosíntesis es el proceso mediante el cual las plantas absorben luz solar, agua y dióxido de carbono para sintetizar glucosa y liberar oxígeno vital para la biosfera.";
    }

    if (text.includes("celula") || text.includes("célula") || text.includes("adn") || text.includes("organulo")) {
        return "La célula es la unidad básica y funcional de todo ser vivo. Entre sus estructuras principales destacan el núcleo (que alberga el ADN), la membrana celular y el citoplasma.";
    }

    if (text.includes("ayuda") || text.includes("laboratorio") || text.includes("experimento")) {
        return "¡Con gusto! Explora los tres laboratorios: Física (velocidad, Ohm y fórmulas dinámicas), Química (mezclas de sustancias y átomos) y Biología (fotosíntesis con slider y organelos celulares). Al terminar, ponte a prueba en la sección de Evaluaciones.";
    }

    return `¡Excelente inquietud científica! En relación a "${escapeHTML(question)}": en ciencia primero observamos el fenómeno, planteamos una hipótesis y medimos variables con experimentos controlados. ¿Te gustaría profundizar en Física, Química o Biología?`;
}

const chatFormEl = $("chatForm");
if (chatFormEl) {
    chatFormEl.addEventListener("submit", function(event) {
        event.preventDefault();

        const input = $("chatInput");
        const question = input ? input.value.trim() : "";

        if (!question) return;

        addMessage(question, "user-message");
        input.value = "";

        setTimeout(() => {
            const response = getAIResponse(question);
            addMessage(response, "bot-message");
        }, 350);
    });
}

function addMessage(text, className) {
    const container = $("chatMessages");
    if (!container) return;

    const message = document.createElement("div");
    message.className = "message " + className;
    message.textContent = text;

    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
}

// ==========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const themeToggleBtn = $("themeToggleBtn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme);
    }

    loadQuestion();

    if (student) {
        enterApp(student);
    }
});