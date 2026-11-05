// ==========================================================================
// NEXORA LAB - APLICACIÓN UNIFICADA (app.js)
// Combina interfaz moderna (styles2, index2, app2) con toda la lógica
// de simulación, física, química, biología y método científico (app, index, style)
// ==========================================================================

const $ = (id) => document.getElementById(id);

// Estado de usuario y persistencia
let student = localStorage.getItem("nexoraStudent") || "citlali";
let experiments = Number(localStorage.getItem("nexoraExperiments") || 3);
let correctAnswers = Number(localStorage.getItem("nexoraCorrect") || 2);
let missionsCompleted = Number(localStorage.getItem("nexoraMissions") || 1);
let history = JSON.parse(localStorage.getItem("nexoraHistory") || "[]");

if (history.length === 0) {
    history = [
        { description: "Inicio de sesión en Nexora LAB como " + student, date: new Date().toLocaleString("es-MX") },
        { description: "Exploración de laboratorio virtual", date: new Date(Date.now() - 300000).toLocaleString("es-MX") }
    ];
}

// Variables de Misiones Científicas Pro
let nivelActual = "Secundaria";
let materiaActual = "Fisica";
let expActual = null;
let pasoActual = 1;
let animId = null;
let simVars = { param1: 35, fuerza: 14, masa: 2.0, impulsoActivo: false, velocidadAcc: 0 };

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

// ==========================================================================
// BASE DE DATOS DE LOS 18 EXPERIMENTOS (SECUNDARIA & PREPARATORIA)
// ==========================================================================
const dbExperimentos = {
    Secundaria: {
        Fisica: [
            {
                id: "s-fis-1",
                titulo: "Fuerza y Fricción (2ª Ley de Newton)",
                desc: "Descubre cómo un objeto acelera cuando empujas más fuerte o cuando el suelo resbala más.",
                simTipo: "fuerza",
                preguntasObs: [
                    "El carrito acelera rápido cuando se aplica fuerza, pero frena gradualmente por la fricción de la pista.",
                    "El carrito nunca se mueve sin importar cuánta fuerza apliquemos.",
                    "La fricción aumenta la velocidad del carrito hacia adelante espontáneamente."
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
                id: "s-fis-2",
                titulo: "Conservación de Energía en el Péndulo",
                desc: "¿Puede un péndulo ganar energía de la nada? Analiza energía cinética vs potencial.",
                simTipo: "pendulo",
                preguntasObs: [
                    "Al soltar la esfera desde lo alto, gana velocidad al caer y la pierde al subir.",
                    "La esfera sube más alto de la altura desde donde fue soltada.",
                    "El péndulo se queda quieto en el aire sin caer."
                ],
                preguntasProb: [
                    "¿Se conserva la energía mecánica total al oscilar un péndulo sin aire?",
                    "¿Por qué el hilo del péndulo cambia de color con el calor?",
                    "¿Cómo influye el día de la semana en las oscilaciones?"
                ],
                hipCondiciones: ["Soltamos la esfera desde una altura mayor", "Cambiamos el material de la esfera por madera", "Eliminamos toda resistencia del aire"],
                hipEfectos: ["alcanzará mayor velocidad máxima en el punto más bajo", "el péndulo flotará hacia el techo", "se detendrá instantáneamente"],
                analisisOpciones: [
                    "La energía potencial en lo alto se transforma en cinética al caer, sumando siempre un total constante.",
                    "La energía se destruye por completo cada vez que la esfera pasa por el centro.",
                    "El péndulo acumula energía infinita en cada oscilación."
                ],
                conclusionesOpciones: [
                    "Se valida: La energía mecánica se transforma continuamente pero no se crea ni se destruye.",
                    "Se refuta: La energía desaparece totalmente sin transformarse en nada.",
                    "Inconcluso: Se requiere medir con cronómetro manual."
                ],
                titularesCom: [
                    "⚖️ De potencial a cinética: La danza eterna de la energía del péndulo.",
                    "🔮 Bolas oscilantes desafían las leyes del universo.",
                    "🎯 Reporte escolar demuestra la conservación de la energía mecánica."
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
                    "Los electrones no fluyen cuando el circuito está debidamente cerrado."
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
                    "El pH siempre se mantiene en 7 sin importar qué reactivo agreguemos.",
                    "Los ácidos y las bases son exactamente la misma sustancia química."
                ],
                preguntasProb: [
                    "¿Qué ocurre con el pH de un ácido cuando agregamos una base en igual proporción?",
                    "¿Por qué los ácidos tienen sabor dulce en la simulación?",
                    "¿Cómo cambia el color del agua si no le agregamos ningún reactivo?"
                ],
                hipCondiciones: ["Añadimos gotas de base (NaOH) a un ácido fuerte", "Agregamos agua pura destilada al compuesto", "Mezclamos dos ácidos idénticos"],
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
            },
            {
                id: "s-qui-2",
                titulo: "Calor y Estados de la Materia",
                desc: "Aplica calor a cubos de hielo virtuales y observa cómo las moléculas se separan.",
                simTipo: "termico",
                preguntasObs: [
                    "Al calentar, las partículas vibran con mayor velocidad y se separan (sólido a líquido a gas).",
                    "Al aplicar calor las partículas se congelan y quedan inmóviles.",
                    "Las moléculas desaparecen del frasco cuando hierve el agua."
                ],
                preguntasProb: [
                    "¿Cómo influye la temperatura en la energía cinética de las moléculas de agua?",
                    "¿Por qué el fuego hace que los átomos pesen menos?",
                    "¿A qué temperatura el agua se convierte en oro?"
                ],
                hipCondiciones: ["Suministramos calor continuo al recipiente", "Enfriamos el sistema a cero absoluto", "Mantenemos la temperatura constante"],
                hipEfectos: ["las partículas pasarán de estado sólido a líquido y gas", "las partículas formarán un cristal gigante", "las partículas se destruirán"],
                analisisOpciones: [
                    "La temperatura es una medida de la energía cinética promedio de las moléculas.",
                    "El calor elimina el movimiento molecular por completo.",
                    "Los gases tienen partículas más juntas que los sólidos."
                ],
                conclusionesOpciones: [
                    "Se valida: Los cambios de estado físico dependen de la energía térmica suministrada.",
                    "Se rechaza: El hielo no cambió de forma con la temperatura.",
                    "Datos insuficientes sobre el punto de ebullición."
                ],
                titularesCom: [
                    "🔥 De hielo sólido a vapor furioso: Moléculas en movimiento microscópico.",
                    "❄️ El calor como motor de los estados de agregación de la materia.",
                    "🧊 Reporte: ¿Por qué el agua hierve al ganar energía cinética?"
                ]
            },
            {
                id: "s-qui-3",
                titulo: "Solubilidad: Mezclas Saturadas",
                desc: "¿Cuánta sal puedes disolver en agua antes de que se quede en el fondo?",
                simTipo: "soluto",
                preguntasObs: [
                    "Al inicio la sal se disuelve por completo, pero al agregar demasiado queda sedimento en el fondo.",
                    "El agua disuelve cualquier cantidad infinita de sal sin saturarse jamás.",
                    "La sal flota en el aire al caer en el vaso de agua."
                ],
                preguntasProb: [
                    "¿Existe un límite máximo (solubilidad) para disolver sal en 100 mL de agua?",
                    "¿Por qué el agua salada es de color verde brillante?",
                    "¿Cómo afecta el ruido del salón a la disolución de sales?"
                ],
                hipCondiciones: ["Superamos el límite de saturación de soluto", "Calentamos el agua antes de poner la sal", "Removemos la cuchara más rápido"],
                hipEfectos: ["se formará un precipitado sólido en el fondo", "el agua se convertirá en hielo seco", "la sal desaparecerá del universo"],
                analisisOpciones: [
                    "Cada solvente tiene un punto de saturación límite a determinada temperatura.",
                    "La sal se disuelve mágicamente en cualquier proporción.",
                    "Calentar el agua disminuye la solubilidad de los sólidos."
                ],
                conclusionesOpciones: [
                    "Hipótesis confirmada: Al superar el coeficiente de solubilidad se crea una mezcla sobresaturada.",
                    "Hipótesis refutada: El agua admitió toda la sal sin dejar residuos.",
                    "Sin datos para calcular gramos disueltos."
                ],
                titularesCom: [
                    "🧂 ¡Hasta el límite!: Estudiantes hallan el punto de saturación de la sal.",
                    "💧 Solutos y solventes: La ciencia detrás de una mezcla homogénea.",
                    "⚗️ ¿Cuántas cucharadas soporta el agua? Experimento de solubilidad."
                ]
            }
        ],
        Biologia: [
            {
                id: "s-bio-1",
                titulo: "Ósmosis: Células e Hidratación",
                desc: "Mira células vegetales hincharse o arrugarse según la sal del medio exterior.",
                simTipo: "osmosis",
                preguntasObs: [
                    "En agua dulce las células se hinchan de agua; en agua con mucha sal se deshidratan y arrugan.",
                    "Las células explotan siempre sin importar en qué líquido se encuentren.",
                    "Las membranas celulares son muros de cemento donde nada entra ni sale."
                ],
                preguntasProb: [
                    "¿Cómo afecta la concentración de sal externa al volumen de una célula vegetal?",
                    "¿Por qué las células cambian de especie al ponerles agua?",
                    "¿De qué manera la sal alimenta a los cloroplastos?"
                ],
                hipCondiciones: ["Colocamos las células en solución salina hipertónica", "Sumergimos la célula en agua pura destilada", "Mantenemos un medio isotónico equilibrado"],
                hipEfectos: ["el agua saldrá de la célula encogiéndola (plasmólisis)", "la célula mantendrá su tamaño constante", "la célula se dividirá en 10 partes"],
                analisisOpciones: [
                    "El agua viaja a través de la membrana hacia donde hay mayor concentración de soluto.",
                    "La sal entra a la célula y el agua se queda completamente inmóvil.",
                    "El volumen celular es independiente de la solución externa."
                ],
                conclusionesOpciones: [
                    "Se confirma: El fenómeno de ósmosis regula el balance hídrico celular.",
                    "Se refuta: Las células mantuvieron la misma forma en todos los medios.",
                    "No se pudo observar la membrana al microscopio."
                ],
                titularesCom: [
                    "🔬 Ósmosis en vivo: El drama celular de deshidratarse en agua salada.",
                    "🌱 ¿Por qué no regar plantas con agua de mar? La biología responde.",
                    "🧫 Células bajo presión: Turgencia y plasmólisis al descubierto."
                ]
            },
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
            },
            {
                id: "s-bio-3",
                titulo: "Frecuencia Cardíaca y Esfuerzo Físico",
                desc: "¿Qué pasa con tu corazón cuando trotas o haces sentadillas? Simula el ritmo cardíaco.",
                simTipo: "cardio",
                preguntasObs: [
                    "Al incrementar la intensidad del ejercicio virtual, los latidos por minuto (LPM) aumentan.",
                    "El corazón se detiene durante el esfuerzo físico para ahorrar sangre.",
                    "La frecuencia cardíaca es igual en reposo que corriendo a máxima velocidad."
                ],
                preguntasProb: [
                    "¿Por qué el corazón bombea más rápido durante el ejercicio físico?",
                    "¿De qué manera la respiración cambia el color de los huesos?",
                    "¿Por qué los músculos no necesitan oxígeno al correr?"
                ],
                hipCondiciones: ["Realizamos ejercicio aeróbico intenso", "Permanecemos en reposo total", "Bebemos agua helada"],
                hipEfectos: ["el corazón bombeará más rápido para oxigenar los músculos", "la frecuencia cardíaca bajará a cero", "los vasos sanguíneos se cerrarán"],
                analisisOpciones: [
                    "El esfuerzo muscular demanda mayor aporte de O2 y nutrientes, elevando el gasto cardíaco.",
                    "El corazón late por azar sin importar la actividad del organismo.",
                    "El reposo requiere más sangre bombeada que el deporte."
                ],
                conclusionesOpciones: [
                    "Hipótesis respaldada: La homeostasis corporal modula el ritmo cardíaco según la demanda metabólica.",
                    "Hipótesis refutada: Los latidos disminuyeron durante la actividad física.",
                    "Datos insuficientes sobre pulso arterial."
                ],
                titularesCom: [
                    "❤️ ¡A mil por hora!: La respuesta cardíaca al ejercicio intenso.",
                    "🏃 Oxígeno para tus músculos: Por qué tu pulso se acelera al entrenar.",
                    "🩺 Simulación cardiovascular: Midiendo el ritmo vital en tiempo real."
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
                    "El proyectil describe una trayectoria en parábola curva por la gravedad constante.",
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
            },
            {
                id: "p-fis-2",
                titulo: "Choques y Conservación del Momento",
                desc: "Haz colisionar dos carritos elásticos y calcula la cantidad de movimiento (p = m·v).",
                simTipo: "choque",
                preguntasObs: [
                    "Al chocar dos masas idénticas, se transfieren velocidad y momento lineal total.",
                    "Los carritos se fusionan y desaparecen tras el impacto.",
                    "La masa pesada sale despedida más rápido que la liviana."
                ],
                preguntasProb: [
                    "¿Se conserva la cantidad de movimiento total (p) en una colisión elástica cerrada?",
                    "¿Por qué los choques producen luz ultravioleta?",
                    "¿Cómo cambia la masa del carrito al chocar contra la pared?"
                ],
                hipCondiciones: ["Chocamos dos carritos de igual masa en colisión elástica", "Un carro muy pesado choca a uno liviano quieto", "Aumentamos la fricción a niveles máximos"],
                hipEfectos: ["el carro en movimiento se frenará transfiriendo su velocidad al otro", "ambos carritos rebotarán a velocidad infinita", "el momento lineal se duplicará de la nada"],
                analisisOpciones: [
                    "El momento total inicial antes del impacto equivale exactamente al momento final.",
                    "La energía cinética siempre se pierde por completo en choques elásticos.",
                    "Los carritos aumentan su masa tras la colisión."
                ],
                conclusionesOpciones: [
                    "Se valida: En ausencia de fuerzas externas, la cantidad de movimiento se conserva.",
                    "Se refuta: El momento después del choque no coincidió con el inicial.",
                    "Inconcluso por error en cálculo de velocidades."
                ],
                titularesCom: [
                    "💥 ¡Impacto total!: Comprobando la conservación del momento lineal.",
                    "🎱 Física de bolas de billar: Colisiones elásticas bajo la lupa.",
                    "🏎️ Choques en el laboratorio: Cantidad de movimiento explicada."
                ]
            },
            {
                id: "p-fis-3",
                titulo: "Refracción de la Luz (Ley de Snell)",
                desc: "¿Por qué un lápiz parece quebrado en un vaso de agua? Mide los ángulos de la luz.",
                simTipo: "snell",
                preguntasObs: [
                    "El rayo de luz cambia de ángulo cuando pasa del aire al agua o al vidrio.",
                    "La luz se apaga al tocar cualquier sustancia transparente.",
                    "El rayo no sufre ninguna desviación sin importar el material."
                ],
                preguntasProb: [
                    "¿Cuál es la relación matemática entre los índices de refracción y los ángulos de la luz?",
                    "¿Por qué los espejos reflejan solo cosas bonitas?",
                    "¿Cómo influye la temperatura del foco en la velocidad de la luz en el vacío?"
                ],
                hipCondiciones: ["El rayo pasa del aire a un medio de mayor índice (agua/vidrio)", "El rayo incide perpendicularmente a 0 grados", "Usamos un rayo láser rojo en vez de azul"],
                hipEfectos: ["el rayo se desviará acercándose a la normal de la superficie", "el rayo viajará hacia atrás por reflexión total", "el rayo continuará sin doblarse"],
                analisisOpciones: [
                    "La Ley de Snell (n1·sen θ1 = n2·sen θ2) describe fielmente el cambio de velocidad de la luz en medios ópticos.",
                    "La luz viaja más rápido en el diamante que en el aire libre.",
                    "El ángulo refractado siempre es igual al incidente."
                ],
                conclusionesOpciones: [
                    "Se confirma: La velocidad de la luz disminuye en medios más densos provocando la refracción.",
                    "Se refuta: La luz no se desvió en ningún ángulo.",
                    "Sin transportador para medir grados."
                ],
                titularesCom: [
                    "🌈 La ilusión del lápiz quebrado: Descifrando la Ley de Snell.",
                    "💎 Viajando a través del vidrio: Óptica y refracción lumínica.",
                    "🔦 La luz bajo control: Midiendo índices de refracción en laboratorio."
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
            },
            {
                id: "p-qui-2",
                titulo: "Reacciones Exotérmicas y Endotérmicas",
                desc: "¿Liberar o absorber calor? Mide la entalpía (ΔH) de diferentes mezclas reactivas.",
                simTipo: "termoquimica",
                preguntasObs: [
                    "Ciertas mezclas liberan tanto calor que suben el termómetro; otras enfrían el vaso.",
                    "Todas las reacciones químicas se congelan a 0 grados centígrados.",
                    "La temperatura del universo siempre sube sin reacción química."
                ],
                preguntasProb: [
                    "¿Cuál es la diferencia energética entre una reacción con entalpía negativa (exotérmica) y una positiva?",
                    "¿Por qué los fuegos artificiales absorben el calor del aire?",
                    "¿Cómo calcular el peso del fuego con una balanza digital?"
                ],
                hipCondiciones: ["Iniciamos una reacción exotérmica de combustión", "Disolvemos nitrato de amonio en agua (endotérmica)", "Colocamos un catalizador inerte"],
                hipEfectos: ["el termómetro subirá rápidamente liberando energía térmica", "la temperatura descenderá enfriando el entorno", "no habrá ningún intercambio calórico"],
                analisisOpciones: [
                    "Las reacciones exotérmicas tienen productos con menor entalpía que los reactivos (ΔH < 0).",
                    "El calor siempre se destruye durante las mezclas químicas.",
                    "Las reacciones endotérmicas queman todo a su alrededor."
                ],
                conclusionesOpciones: [
                    "Se respalda: La variación de entalpía determina si el sistema cede o absorbe energía del entorno.",
                    "Se rechaza: El termómetro no registró ningún cambio de temperatura.",
                    "Faltan lecturas de Joules para evaluar el calor."
                ],
                titularesCom: [
                    "🔥 Calor en los enlaces: Descubriendo las reacciones exotérmicas.",
                    "🧊 El misterio químico del frío instantáneo: Termoquímica en acción.",
                    "⚗️ Entalpía y energía: La termodinámica de las reacciones cotidianas."
                ]
            },
            {
                id: "p-qui-3",
                titulo: "Cinética Química y Catalizadores",
                desc: "¿Cómo acelerar una reacción lenta? Añade un catalizador o aumenta la temperatura.",
                simTipo: "cinetica",
                preguntasObs: [
                    "Al añadir un catalizador o subir la temperatura, la reacción concluye en segundos.",
                    "Los catalizadores se destruyen y consumen por completo durante la reacción.",
                    "Enfriar los reactivos hace que reaccionen a mayor velocidad."
                ],
                preguntasProb: [
                    "¿De qué manera un catalizador modifica la energía de activación de un proceso químico?",
                    "¿Por qué las sustancias calientes se vuelven transparentes?",
                    "¿Cómo influye la marca del cronómetro en la cinética química?"
                ],
                hipCondiciones: ["Añadimos un catalizador a la mezcla reactiva", "Aumentamos la concentración de los reactivos", "Enfriamos el vaso a temperatura de hielo"],
                hipEfectos: ["la reacción ocurrirá mucho más rápido al bajar la energía de activación", "la reacción se detendrá para siempre", "los reactivos cambiarán de peso atómico"],
                analisisOpciones: [
                    "Los catalizadores ofrecen una ruta alternativa con menor energía de activación sin consumirse.",
                    "La velocidad de reacción no tiene relación con la temperatura.",
                    "Menos colisiones entre moléculas aumentan la velocidad de reacción."
                ],
                conclusionesOpciones: [
                    "Se confirma: La cinética química depende de la frecuencia de choques eficaces y de la barrera energética.",
                    "Se refuta: El catalizador frenó por completo la transformación química.",
                    "Sin datos para estimar la constante de velocidad k."
                ],
                titularesCom: [
                    "⚡ Acelerar sin consumirse: El superpoder de los catalizadores químicos.",
                    "⏱️ Cinética al milisegundo: Cómo dominar la velocidad de las reacciones.",
                    "🔬 Moléculas en choque: La teoría de colisiones comprobada en el lab."
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
            },
            {
                id: "p-bio-2",
                titulo: "Actividad Enzimática y Desnaturalización",
                desc: "¿Qué le ocurre a una enzima digestiva si subes la temperatura a más de 60 °C?",
                simTipo: "enzimas",
                preguntasObs: [
                    "La enzima trabaja a máxima velocidad a 37 °C, pero muere o deja de funcionar al hervir.",
                    "A 100 °C las enzimas son 50 veces más potentes y resistentes.",
                    "Las enzimas son seres vivos que tienen ojos y nadan en el tubo."
                ],
                preguntasProb: [
                    "¿Cómo afecta la temperatura excesiva a la estructura tridimensional de una enzima proteica?",
                    "¿Por qué la saliva es capaz de quemar el metal de los cubiertos?",
                    "¿Cuánto tiempo vive una proteína en un horno microondas?"
                ],
                hipCondiciones: ["Sometemos la enzima a una temperatura extrema (>60 °C)", "Mantenemos la enzima a su temperatura óptima de 37 °C", "Congelamos la enzima a -20 °C"],
                hipEfectos: ["se desnaturalizará perdiendo su sitio activo y su función biológica", "la enzima duplicará su velocidad metabólica", "la enzima se convertirá en un lípido graso"],
                analisisOpciones: [
                    "El calor excesivo rompe los puentes de hidrógeno, desnaturalizando la estructura terciaria de la proteína.",
                    "Las enzimas son indestructibles sin importar el calor o el pH.",
                    "La velocidad enzimática siempre crece de forma lineal infinita con la temperatura."
                ],
                conclusionesOpciones: [
                    "Se confirma: La desnaturalización térmica destruye la actividad catalítica de las enzimas.",
                    "Se refuta: La enzima hervida continuó degradando el sustrato sin problemas.",
                    "Sin datos sobre la velocidad de reacción enzimática."
                ],
                titularesCom: [
                    "🍳 El efecto del calor en las proteínas: ¿Por qué la fiebre alta es peligrosa?",
                    "🧪 Enzimas al rescate: El sitio activo como llave y cerradura biológica.",
                    "🔬 Desnaturalización celular: Cuando las máquinas del cuerpo dejan de funcionar."
                ]
            },
            {
                id: "p-bio-3",
                titulo: "Dinámica de Ecosistemas: Depredador-Presa",
                desc: "Equilibra conejos y zorros en un bosque virtual sin que ninguno se extinga.",
                simTipo: "poblaciones",
                preguntasObs: [
                    "Si hay muchos conejos, los zorros crecen; al haber muchos zorros, los conejos mueren y luego los zorros mueren de hambre.",
                    "Los conejos y los zorros viven en paz sin comerse entre sí jamás.",
                    "El número de animales en el bosque nunca cambia con el tiempo."
                ],
                preguntasProb: [
                    "¿Cómo regula la relación depredador-presa el tamaño poblacional de ambas especies?",
                    "¿Por qué los zorros se alimentan de luz solar en invierno?",
                    "¿Cómo afecta el canto de los pájaros a la natalidad de los conejos?"
                ],
                hipCondiciones: ["Aumentamos la población inicial de depredadores", "Eliminamos a todos los depredadores del bosque", "Mantenemos un equilibrio ecológico de recursos"],
                hipEfectos: ["la población de presas descenderá bruscamente por sobrecaza", "las presas se reproducirán sin límite consumiendo toda la vegetación", "ambas poblaciones oscilarán en ciclos estables"],
                analisisOpciones: [
                    "El modelo de Lotka-Volterra demuestra ciclos acoplados periódicos de abundancia entre presa y depredador.",
                    "Los depredadores siempre extinguen a sus presas sin excepción.",
                    "Los ecosistemas no tienen capacidad de carga límite."
                ],
                conclusionesOpciones: [
                    "Se respalda: La depredación actúa como un factor denso-dependiente que estabiliza el ecosistema.",
                    "Se rechaza: Las poblaciones no mostraron ninguna relación numérica entre sí.",
                    "Faltan años ecológicos de registro simulado."
                ],
                titularesCom: [
                    "🦊 Zorros y Conejos: La montaña rusa demográfica del modelo Lotka-Volterra.",
                    "🌲 El balance de la naturaleza: Por qué los ecosistemas necesitan depredadores.",
                    "📊 Ecología matemática: Simulando la supervivencia de especies en el lab."
                ]
            }
        ]
    }
};

// ==========================================================================
// PREGUNTAS DEL CUESTIONARIO CIENTÍFICO (EVALUACIONES)
// ==========================================================================
const questions = [
    {
        question: "¿Qué fórmula permite calcular la velocidad media?",
        options: ["Distancia ÷ tiempo", "Tiempo ÷ distancia", "Distancia × masa"],
        answer: 0,
        explanation: "La velocidad media se calcula dividiendo la distancia recorrida entre el tiempo empleado (v = d / t)."
    },
    {
        question: "¿Qué establece la ley de Ohm en electrodinámica?",
        options: ["La relación entre masa y volumen", "La relación entre voltaje, corriente y resistencia (V = I · R)", "La relación entre luz y temperatura"],
        answer: 1,
        explanation: "La ley de Ohm establece que V = I · R (el voltaje es igual a la corriente multiplicada por la resistencia)."
    },
    {
        question: "¿Qué ocurre cuando la sal de mesa se disuelve en agua?",
        options: ["Se forma una mezcla homogénea (disolución)", "Se convierte en un metal alcalino sólido", "Desaparece la materia del recipiente"],
        answer: 0,
        explanation: "La sal se disocia en iones sodio y cloruro formando una mezcla homogénea de una sola fase."
    },
    {
        question: "¿Qué estructura contiene el material genético de una célula eucariota?",
        options: ["Membrana plasmática", "Núcleo celular", "Pared celular"],
        answer: 1,
        explanation: "El núcleo celular alberga el ADN en los cromosomas y coordina las funciones biológicas."
    },
    {
        question: "¿Qué elementos necesita una planta para realizar la fotosíntesis?",
        options: ["Luz solar, agua y dióxido de carbono (CO2)", "Arena, aceite y sal de mesa", "Únicamente gas oxígeno"],
        answer: 0,
        explanation: "La fotosíntesis utiliza fotones de luz, agua y CO2 para generar carbohidratos (glucosa) y liberar oxígeno."
    },
    {
        question: "¿Qué partícula subatómica tiene carga eléctrica negativa?",
        options: ["Protón", "Neutrón", "Electrón"],
        answer: 2,
        explanation: "El electrón tiene carga negativa (-1e); el protón tiene carga positiva y el neutrón carece de carga eléctrica neta."
    }
];

let currentQuestion = 0;
let questionAnswered = false;
let sessionScore = 0;

// ==========================================================================
// FUNCIONES DE PROGRESO Y ACTIVIDAD
// ==========================================================================
function saveProgress() {
    localStorage.setItem("nexoraExperiments", experiments);
    localStorage.setItem("nexoraCorrect", correctAnswers);
    localStorage.setItem("nexoraMissions", missionsCompleted);
    localStorage.setItem("nexoraHistory", JSON.stringify(history));
    updateProgressUI();
}

function addActivity(description) {
    history.unshift({
        description,
        date: new Date().toLocaleString("es-MX")
    });
    history = history.slice(0, 30);
    saveProgress();
}

function updateProgressUI() {
    if ($("experimentCount")) $("experimentCount").textContent = experiments;
    if ($("quizScore")) $("quizScore").textContent = correctAnswers;
    if ($("missionCount")) $("missionCount").textContent = missionsCompleted;

    const rankTitle = $("userRankTitle");
    if (rankTitle) {
        const total = experiments * 2 + correctAnswers * 3;
        if (total >= 35) {
            rankTitle.textContent = "🏆 Maestro del Cosmos";
            rankTitle.style.color = "#10b981";
        } else if (total >= 15) {
            rankTitle.textContent = "⚡ Investigador Cuántico";
            rankTitle.style.color = "#f59e0b";
        } else {
            rankTitle.textContent = "🌱 Explorador Novato";
            rankTitle.style.color = "#00e5ff";
        }
    }

    const container = $("activityHistory");
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--muted);">Todavía no tienes actividades registradas.</div>`;
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div>
                <strong>${escapeHTML(item.description)}</strong>
                <small>${escapeHTML(item.date)}</small>
            </div>
            <span class="pill-status" style="font-size:10px;">Registrado</span>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);
}

// ==========================================================================
// GESTIÓN DE TEMA Y RED
// ==========================================================================
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem("nexora_theme", next);
    const btn = $("btn-theme");
    if (btn) btn.innerText = next === "light" ? "☀️" : "🌙";
}

function cargarTemaGuardado() {
    const saved = localStorage.getItem("nexora_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    const btn = $("btn-theme");
    if (btn) btn.innerText = saved === "light" ? "☀️" : "🌙";
}

function syncRed() {
    const pill = $("estado-red");
    if (!pill) return;
    if (navigator.onLine) {
        pill.innerText = "🟢 En línea";
        pill.className = "pill-status";
    } else {
        pill.innerText = "🔴 Sin conexión (IA Local)";
        pill.className = "pill-status";
        pill.style.borderColor = "#f97316";
        pill.style.color = "#f97316";
    }
}
window.addEventListener("online", syncRed);
window.addEventListener("offline", syncRed);

// ==========================================================================
// SESIÓN DE ESTUDIANTE (LOGIN & LOGOUT)
// ==========================================================================
function enterApp(name) {
    student = name;
    localStorage.setItem("nexoraStudent", student);

    $("loginScreen").classList.add("hidden");
    $("app").classList.remove("hidden");

    if ($("welcomeName")) $("welcomeName").textContent = student;
    if ($("heroName")) $("heroName").textContent = student;

    updateProgressUI();
}

$("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = $("studentName").value.trim();
    const password = $("studentPassword").value;

    if (name.length < 2 || password.length < 4) {
        alert("Escribe un nombre de al menos 2 caracteres y una contraseña de 4.");
        return;
    }
    enterApp(name);
});

$("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("nexoraStudent");
    student = "";
    $("app").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");
});

function loginAsCitlali() {
    $("studentName").value = "citlali";
    $("studentPassword").value = "1234";
    enterApp("citlali");
}

// ==========================================================================
// NAVEGACIÓN ENTRE SECCIONES
// ==========================================================================
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

    const sec = $(sectionId);
    if (!sec) return;
    sec.classList.add("active-section");

    const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    const titles = {
        inicio: { t: "Bienvenido al laboratorio", s: "Explora, experimenta y descubre." },
        fisica: { t: "Laboratorio de Física", s: "Movimiento, velocidad, electricidad y energía." },
        quimica: { t: "Laboratorio de Química", s: "Materia, mezclas, átomos y transformaciones." },
        biologia: { t: "Laboratorio de Biología", s: "Células, seres vivos y procesos naturales." },
        misiones: { t: "Misiones Científicas Pro", s: "El método científico en 7 pasos con 18 laboratorios guiados." },
        evaluacion: { t: "Evaluaciones Científicas", s: "Responde preguntas y comprueba lo que has aprendido." },
        progreso: { t: "Mi progreso", s: "Consulta las actividades y experimentos que has realizado." },
        ia: { t: "Asistente NEXOR-IA", s: "Tu tutor científico personal en tiempo real." }
    };

    const current = titles[sectionId] || { t: "Nexora LAB", s: "Laboratorio Virtual" };
    if ($("pageTitle")) $("pageTitle").textContent = current.t;
    if ($("pageSubtitle")) $("pageSubtitle").textContent = current.s;

    if (sectionId === "progreso") updateProgressUI();
    if (sectionId === "misiones" && !expActual) {
        renderListaMisiones();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
});

// ==========================================================================
// SIMULADORES RÁPIDOS: FÍSICA
// ==========================================================================
function calculateSpeed() {
    const distance = Number($("distance").value);
    const time = Number($("time").value);

    if (!Number.isFinite(distance) || !Number.isFinite(time) || distance < 0 || time <= 0) {
        $("speedResult").textContent = "Introduce una distancia válida (≥ 0) y un tiempo mayor que cero.";
        return;
    }

    const speed = distance / time;
    const kmh = speed * 3.6;

    $("speedResult").innerHTML = `
        <strong>Resultado: ${speed.toFixed(2)} m/s (${kmh.toFixed(2)} km/h)</strong><br>
        Fórmula: v = d ÷ t (velocidad = distancia ÷ tiempo)<br>
        Cálculo: ${distance} m ÷ ${time} s = ${speed.toFixed(2)} m/s.
    `;

    experiments++;
    addActivity(`Simulación de velocidad: ${distance}m / ${time}s = ${speed.toFixed(2)} m/s`);
}

function calculateOhm() {
    const voltage = Number($("voltage").value);
    const resistance = Number($("resistance").value);

    if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || voltage < 0 || resistance <= 0) {
        $("ohmResult").textContent = "Introduce valores válidos. La resistencia debe ser mayor que cero.";
        return;
    }

    const current = voltage / resistance;
    const power = voltage * current;

    $("ohmResult").innerHTML = `
        <strong>Corriente: ${current.toFixed(2)} Amperios (A)</strong><br>
        Potencia disipada: ${power.toFixed(2)} Vatios (W)<br>
        Fórmula: I = V ÷ R (Ley de Ohm)<br>
        Cálculo: ${voltage} V ÷ ${resistance} Ω = ${current.toFixed(2)} A.
    `;

    experiments++;
    addActivity(`Simulación Ley de Ohm: ${voltage}V / ${resistance}Ω = ${current.toFixed(2)} A`);
}

// ==========================================================================
// SIMULADORES RÁPIDOS: QUÍMICA (MEZCLAS & ÁTOMO & PH)
// ==========================================================================
const substanceNames = {
    agua: "Agua",
    aceite: "Aceite",
    sal: "Sal",
    azucar: "Azúcar",
    arena: "Arena"
};

function mixSubstances() {
    const first = $("substanceOne").value;
    const second = $("substanceTwo").value;
    let result = "";

    if (first === second) {
        result = `Has seleccionado dos muestras de ${substanceNames[first]}. Al ser la misma sustancia, no estás combinando materiales diferentes.`;
    } else if ((first === "agua" && second === "sal") || (first === "sal" && second === "agua")) {
        result = "¡Disolución homogénea! La sal (NaCl) se disocia en iones Na+ y Cl- en el agua, formando una mezcla homogénea cristalina de una sola fase visible.";
    } else if ((first === "agua" && second === "azucar") || (first === "azucar" && second === "agua")) {
        result = "¡Disolución homogénea! La sacarosa forma puentes de hidrógeno con las moléculas polares de agua, disolviéndose completamente.";
    } else if ((first === "agua" && second === "aceite") || (first === "aceite" && second === "agua")) {
        result = "¡Mezcla heterogénea inmiscible! El agua es polar y el aceite es apolar. No se unen y se observan dos fases nítidas con el aceite flotando por menor densidad.";
    } else if ((first === "agua" && second === "arena") || (first === "arena" && second === "agua")) {
        result = "¡Mezcla heterogénea (Suspensión y sedimentación)! Los granos de sílice de la arena no se disuelven y se precipitan en el fondo del recipiente.";
    } else if ((first === "aceite" && second === "sal") || (first === "sal" && second === "aceite")) {
        result = "La sal no se disuelve en aceite debido a que los triglicéridos no polares no interactúan con los enlaces iónicos de la sal.";
    } else if ((first === "aceite" && second === "azucar") || (first === "azucar" && second === "aceite")) {
        result = "El azúcar no se disuelve de forma apreciable en aceite. Se mantiene como una mezcla heterogénea sólida en líquido.";
    } else {
        result = "Combinación entre materiales sólidos: conservan su identidad física individual como mezcla heterogénea.";
    }

    $("mixResult").textContent = result;
    experiments++;
    addActivity(`Simulación de mezclas: ${substanceNames[first]} + ${substanceNames[second]}`);
}

let livePh = 7.0;
function adjustQuickPh(delta, name) {
    livePh = Math.min(14.0, Math.max(0.0, +(livePh + delta).toFixed(2)));
    const phTag = $("livePhVal");
    const phTagDesc = $("livePhDesc");
    if (phTag) {
        phTag.textContent = livePh.toFixed(2);
        phTag.style.color = livePh < 6 ? "var(--pink)" : livePh > 8 ? "var(--purple)" : "var(--green)";
    }
    if (phTagDesc) {
        phTagDesc.textContent = livePh < 6.5 ? "🔴 Ácido" : livePh > 7.5 ? "🟣 Alcalino (Base)" : "🟢 Neutro";
    }
    experiments++;
    addActivity(`Prueba rápida de pH: ajustado a ${livePh} con ${name}`);
}

const atomosData = {
    Carbono: { z: 6, p: 6, n: 6, e: 6, config: "1s² 2s² 2p²" },
    Hidrogeno: { z: 1, p: 1, n: 0, e: 1, config: "1s¹" },
    Helio: { z: 2, p: 2, n: 2, e: 2, config: "1s²" },
    Litio: { z: 3, p: 3, n: 4, e: 3, config: "1s² 2s¹" },
    Oxigeno: { z: 8, p: 8, n: 8, e: 8, config: "1s² 2s² 2p⁴" }
};

function selectAtom(elem) {
    const data = atomosData[elem] || atomosData.Carbono;
    $("atomName").textContent = `${elem} (Z = ${data.z})`;
    $("atomP").textContent = data.p;
    $("atomN").textContent = data.n;
    $("atomE").textContent = data.e;
    $("atomConfig").textContent = data.config;
    document.querySelectorAll(".atom-btn").forEach(b => b.classList.remove("selected"));
    const active = $(`btn-atom-${elem}`);
    if (active) active.classList.add("selected");
}

// ==========================================
// SIMULADORES RÁPIDOS: BIOLOGÍA (FOTOSÍNTESIS & CÉLULA)
// ==========================================
if ($("lightSlider")) {
    $("lightSlider").addEventListener("input", function() {
        const light = Number(this.value);
        $("lightValue").textContent = light + "%";

        if (light < 20) {
            $("plantEmoji").textContent = "🌱";
            $("plantEmoji").style.transform = "scale(0.9)";
            $("photoResult").textContent =
                "Con poca luz, la fotosíntesis se ve severamente limitada. Los cloroplastos requieren fotones para hidrolizar agua en las membranas tilacoides.";
        } else if (light < 70) {
            $("plantEmoji").textContent = "🌿";
            $("plantEmoji").style.transform = "scale(1.15)";
            $("photoResult").textContent =
                "Intensidad de luz intermedia y equilibrada. La planta realiza el ciclo de Calvin fijando CO2 y desprendiendo oxígeno molecular.";
        } else {
            $("plantEmoji").textContent = "🌳";
            $("plantEmoji").style.transform = "scale(1.35)";
            $("photoResult").textContent =
                "¡Máxima iluminación solar! Alta tasa fotosintética con desprendimiento constante de O2 y síntesis óptima de glucosa.";
        }
    });

    $("lightSlider").addEventListener("change", function() {
        experiments++;
        addActivity(`Exploración de fotosíntesis al ${this.value}% de luz`);
    });
}

function selectCellType(type) {
    const vegNote = $("vegetalNote");
    if (type === "vegetal") {
        vegNote.classList.remove("hidden");
    } else {
        vegNote.classList.add("hidden");
    }
}

// ==========================================================================
// EVALUACIONES CIENTÍFICAS MEJORADAS (¡OTORGA 100/100 CON TODAS BIEN!)
// ==========================================================================
function loadQuestion() {
    const q = questions[currentQuestion];
    $("quizCounter").textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    $("quizQuestion").textContent = q.question;
    $("quizFeedback").classList.add("hidden");
    $("nextQuestion").classList.add("hidden");
    $("quizOptions").innerHTML = "";

    questionAnswered = false;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}`;
        btn.addEventListener("click", () => selectQuizAnswer(idx));
        $("quizOptions").appendChild(btn);
    });
}

function selectQuizAnswer(idx) {
    if (questionAnswered) return;
    questionAnswered = true;

    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll("#quizOptions .quiz-option");
    buttons.forEach(b => b.disabled = true);

    const isCorrect = idx === q.answer;
    if (isCorrect) {
        sessionScore++;
        correctAnswers++;
        $("quizFeedback").innerHTML = `
            <strong style="color:var(--green)">¡Correcto! ⭐ Explicación:</strong><br>${q.explanation}
        `;
        $("quizFeedback").style.borderColor = "var(--green)";
        buttons[idx].style.borderColor = "var(--green)";
        buttons[idx].style.background = "rgba(84, 230, 165, 0.15)";
    } else {
        $("quizFeedback").innerHTML = `
            <strong style="color:var(--pink)">Respuesta incorrecta. 💡 Aprende:</strong><br>${q.explanation}
        `;
        $("quizFeedback").style.borderColor = "var(--pink)";
        buttons[idx].style.borderColor = "var(--pink)";
        buttons[q.answer].style.borderColor = "var(--green)";
    }

    $("quizFeedback").classList.remove("hidden");
    $("nextQuestion").classList.remove("hidden");

    addActivity(isCorrect ? "Respuesta correcta en evaluación" : "Pregunta respondida en evaluación");
}

$("nextQuestion").addEventListener("click", function() {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        finishQuiz();
    } else {
        loadQuestion();
    }
});

function finishQuiz() {
    // CALIFICACIÓN MATEMÁTICA EXACTA: Si tienes 6 de 6 = 100 / 100 PTS!
    const finalScore = Math.round((sessionScore / questions.length) * 100);

    $("quizQuestion").textContent = "¡Evaluación finalizada! 🎉";
    $("quizOptions").innerHTML = `
        <div class="score-display-box">
            <span style="font-size:12px; text-transform:uppercase; font-weight:800; color:var(--muted); letter-spacing:1px;">
                Calificación Final Obtenida
            </span>
            <div class="score-number">${finalScore} / 100 PTS</div>
            <div class="rank-badge">
                ${finalScore === 100 ? "🏆 Maestro del Cosmos (¡Puntaje Perfecto 100%)" : finalScore >= 80 ? "⚡ Investigador Cuántico" : "🌱 Explorador Novato"}
            </div>
            <p style="margin-top:14px; font-size:14px; color:var(--text);">
                Has respondido <b>${sessionScore}</b> de <b>${questions.length}</b> preguntas correctamente.
            </p>
        </div>
    `;

    $("quizFeedback").classList.add("hidden");
    $("nextQuestion").classList.add("hidden");
    $("quizCounter").textContent = "Completado";
    $("restartQuiz").textContent = "Volver a intentar";

    missionsCompleted++;
    saveProgress();
    addActivity(`Completó evaluación científica con calificación de ${finalScore} / 100 PTS`);
}

function restartQuiz() {
    currentQuestion = 0;
    sessionScore = 0;
    $("restartQuiz").textContent = "Reiniciar evaluación";
    loadQuestion();
}
$("restartQuiz").addEventListener("click", restartQuiz);
loadQuestion();

// ==========================================================================
// MISIONES PRO: MÉTODO CIENTÍFICO EN 7 PASOS
// ==========================================================================
function seleccionarNivelMisiones(lvl) {
    nivelActual = lvl;
    document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
    const active = $(`btn-lvl-${lvl}`);
    if (active) active.classList.add("active");
    renderListaMisiones();
}

function seleccionarMateriaMisiones(mat) {
    materiaActual = mat;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    const active = $(`btn-mat-${mat}`);
    if (active) active.classList.add("active");
    renderListaMisiones();
}

function renderListaMisiones() {
    const container = $("listaMisionesHub");
    if (!container) return;

    const list = dbExperimentos[nivelActual][materiaActual] || [];
    container.innerHTML = list.map(exp => `
        <div class="mission-card" onclick="iniciarMision('${exp.id}')">
            <div>
                <span class="pill-status" style="font-size:10px; margin-bottom:10px; display:inline-block;">
                    ${nivelActual.toUpperCase()}
                </span>
                <h4>${exp.titulo}</h4>
                <p>${exp.desc}</p>
            </div>
            <div style="margin-top:15px; font-size:12px; font-weight:800; color:var(--cyan); display:flex; justify-content:space-between;">
                <span>Iniciar Método en 7 Pasos</span>
                <span>→</span>
            </div>
        </div>
    `).join("");
}

function iniciarMision(expId) {
    const list = [
        ...dbExperimentos[nivelActual].Fisica,
        ...dbExperimentos[nivelActual].Quimica,
        ...dbExperimentos[nivelActual].Biologia
    ];
    expActual = list.find(e => e.id === expId);
    if (!expActual) return;

    userSession = {
        observacionSeleccionada: "",
        observacionLibre: "",
        problemaSeleccionado: "",
        hipotesisCondicion: expActual.hipCondiciones[0],
        hipotesisEfecto: expActual.hipEfectos[0],
        ensayos: [],
        analisisSeleccionado: "",
        conclusionSeleccionada: "",
        conclusionTexto: "",
        comunicacionTitular: ""
    };

    // Auto-registro inicial de calibración para garantizar que el estudiante nunca pierda puntos de laboratorio
    userSession.ensayos.push({
        num: 1,
        control: "Condición Inicial Calibrada",
        resultado: "Línea base registrada",
        estado: "Normal"
    });

    $("misionesHub").classList.add("hidden");
    $("misionLabCard").classList.remove("hidden");
    $("dictamenCard").classList.add("hidden");

    $("labTitulo").textContent = expActual.titulo;
    $("labTag").textContent = `${materiaActual.toUpperCase()} · ${nivelActual.toUpperCase()}`;

    // Poblar opciones paso a paso
    poblarPaso1();
    poblarPaso2();
    poblarPaso3();
    configurarSimuladorPaso4();
    poblarPaso5();
    poblarPaso6();
    poblarPaso7();

    if (expActual.simTipo === "circuito") {
        abrirConstructorCircuito();
    } else {
        cambiarPaso(1);
    }

    addActivity(`Inició misión Pro: ${expActual.titulo}`);
}

function volverAListaMisiones() {
    detenerCanvas();
    expActual = null;
    $("misionLabCard").classList.add("hidden");
    $("dictamenCard").classList.add("hidden");
    $("misionesHub").classList.remove("hidden");
    renderListaMisiones();
}

function cambiarPaso(paso) {
    pasoActual = paso;
    document.querySelectorAll(".step-panel").forEach(p => p.classList.add("hidden"));
    const activePanel = $(`step-panel-${paso}`);
    if (activePanel) activePanel.classList.remove("hidden");

    const titulos = [
        "1. Observación", "2. Pregunta Problema", "3. Formulación de Hipótesis",
        "4. Experimentación Virtual", "5. Análisis de Mediciones", "6. Conclusión", "7. Divulgación"
    ];

    $("stepName").textContent = `Paso ${paso} de 7: ${titulos[paso - 1]}`;
    $("progressFill").style.width = `${(paso / 7) * 100}%`;

    detenerCanvas();

    if (paso === 1) {
        arrancarCanvas("canvasObs", expActual.simTipo, true);
    } else if (paso === 4) {
        arrancarCanvas("canvasExp", expActual.simTipo, false);
    } else if (paso === 6) {
        $("txtHipRecordatorio").textContent = `"Si ${userSession.hipotesisCondicion.toLowerCase()}, entonces ${userSession.hipotesisEfecto.toLowerCase()}."`;
    }
}

function avanzarPaso(pasoAct, pasoSig) {
    if (pasoAct === 1 && !userSession.observacionSeleccionada) {
        alert("Selecciona al menos una observación visual para continuar.");
        return;
    }
    if (pasoAct === 2 && !userSession.problemaSeleccionado) {
        const libre = $("inputProblemaLibre").value.trim();
        if (libre) {
            userSession.problemaSeleccionado = libre;
        } else {
            alert("Elige una pregunta de investigación o escribe la tuya.");
            return;
        }
    }
    if (pasoAct === 5 && !userSession.analisisSeleccionado) {
        alert("Selecciona la tendencia descubierta en tus mediciones.");
        return;
    }
    if (pasoAct === 6 && !userSession.conclusionSeleccionada) {
        alert("Elige la conclusión para validar o refutar tu hipótesis.");
        return;
    }
    cambiarPaso(pasoSig);
}

// Poblar pasos
function poblarPaso1() {
    const c = $("quizObsOptions");
    c.innerHTML = expActual.preguntasObs.map(obs => `
        <div class="quiz-option" onclick="seleccionarObs(this, '${escapeHTML(obs)}')">${obs}</div>
    `).join("");
}
function seleccionarObs(el, texto) {
    document.querySelectorAll("#quizObsOptions .quiz-option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    userSession.observacionSeleccionada = texto;
}

function poblarPaso2() {
    const c = $("quizProbOptions");
    c.innerHTML = expActual.preguntasProb.map(prob => `
        <div class="quiz-option" onclick="seleccionarProb(this, '${escapeHTML(prob)}')">${prob}</div>
    `).join("");
}
function seleccionarProb(el, texto) {
    document.querySelectorAll("#quizProbOptions .quiz-option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    userSession.problemaSeleccionado = texto;
}

function poblarPaso3() {
    const selCond = $("hbCondicion");
    const selEf = $("hbEfecto");
    selCond.innerHTML = expActual.hipCondiciones.map(c => `<option value="${c}">${c}</option>`).join("");
    selEf.innerHTML = expActual.hipEfectos.map(e => `<option value="${e}">${e}</option>`).join("");
    actualizarPreviewHipotesis();
}

function actualizarPreviewHipotesis() {
    const c = $("hbCondicion").value;
    const e = $("hbEfecto").value;
    userSession.hipotesisCondicion = c;
    userSession.hipotesisEfecto = e;
    $("hbPreviewText").textContent = `"Si ${c.toLowerCase()}, entonces ${e.toLowerCase()}."`;
}

function configurarSimuladorPaso4() {
    const c = $("simControlsContainer");
    simVars = { param1: 35, fuerza: 14, masa: 2.0, impulsoActivo: false, velocidadAcc: 0 };

    if (expActual.simTipo === "fuerza" || expActual.simTipo === "choque") {
        c.innerHTML = `
            <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:800; margin-bottom:4px;">
                    <span>Fuerza Aplicada: <b id="valCtrlFuerza" style="color:var(--cyan)">14 N</b></span>
                </div>
                <input type="range" min="5" max="80" value="14" oninput="actualizarFuerzaSim(this.value)">
            </div>
            <div style="margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:800; margin-bottom:4px;">
                    <span>Masa del Carro: <b id="valCtrlMasa" style="color:var(--purple)">2.0 kg</b></span>
                </div>
                <input type="range" min="0.5" max="5.0" step="0.5" value="2.0" oninput="actualizarMasaSim(this.value)">
            </div>
            <button class="primary-btn" style="width:100%;" onclick="lanzarPruebaNewton()">▶ Aplicar Impulso y Registrar Medición</button>
        `;
    } else if (expActual.simTipo === "circuito") {
        c.innerHTML = `
            <div style="margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:800; margin-bottom:4px;">
                    <span>Voltaje Batería: <b id="valCtrlVoltaje" style="color:var(--amber)">9 V</b></span>
                </div>
                <input type="range" min="1" max="24" value="9" oninput="actualizarVoltajeSim(this.value)">
            </div>
            <button class="primary-btn" style="width:100%;" onclick="registrarEnsayoCircuito()">💡 Registrar Corriente e Intensidad Lumínica</button>
        `;
    } else if (expActual.simTipo === "ph") {
        c.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:12px;">
                <button class="secondary-btn" style="flex:1;" onclick="agregarGotasPH('acido')">+ Ácido Clorhídrico (HCl)</button>
                <button class="secondary-btn" style="flex:1;" onclick="agregarGotasPH('base')">+ Hidróxido de Sodio (NaOH)</button>
            </div>
            <div style="text-align:center; font-size:14px; font-weight:800;">
                pH de la solución: <b id="valPhSim" style="color:var(--cyan); font-size:18px;">7.00</b>
            </div>
        `;
    } else {
        c.innerHTML = `
            <div style="margin-bottom:14px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:800; margin-bottom:4px;">
                    <span>Intensidad de Entrada: <b id="valCtrlGeneric" style="color:var(--cyan)">50%</b></span>
                </div>
                <input type="range" min="10" max="100" value="50" oninput="actualizarGenericSim(this.value)">
            </div>
            <button class="primary-btn" style="width:100%;" onclick="registrarEnsayoGenerico()">🚀 Registrar Lectura Experimental</button>
        `;
    }
}

function actualizarFuerzaSim(v) {
    simVars.fuerza = parseFloat(v);
    $("valCtrlFuerza").textContent = v + " N";
}
function actualizarMasaSim(v) {
    simVars.masa = parseFloat(v);
    $("valCtrlMasa").textContent = parseFloat(v).toFixed(1) + " kg";
}
function lanzarPruebaNewton() {
    const acel = (simVars.fuerza / simVars.masa).toFixed(2);
    simVars.impulsoActivo = true;
    simVars.velocidadAcc = parseFloat(acel);
    registrarFilaTabla(`F = ${simVars.fuerza} N, m = ${simVars.masa} kg`, `Aceleración = ${acel} m/s²`, "Completado");
}

function actualizarVoltajeSim(v) {
    simVars.param1 = parseFloat(v);
    $("valCtrlVoltaje").textContent = v + " V";
}
function registrarEnsayoCircuito() {
    const v = simVars.param1 || 9;
    const a = (v / 10).toFixed(2);
    registrarFilaTabla(`Voltaje = ${v} V`, `Corriente = ${a} A`, Number(a) > 1.5 ? "Alta Intensidad" : "Normal");
}

function agregarGotasPH(tipo) {
    simVars.param1 = simVars.param1 || 7.0;
    if (tipo === "acido") simVars.param1 = Math.max(1.0, +(simVars.param1 - 1.2).toFixed(2));
    else simVars.param1 = Math.min(14.0, +(simVars.param1 + 1.2).toFixed(2));
    $("valPhSim").textContent = simVars.param1.toFixed(2);
    registrarFilaTabla(`Reactivo ${tipo.toUpperCase()}`, `pH = ${simVars.param1.toFixed(2)}`, simVars.param1 < 7 ? "Ácido" : simVars.param1 > 7 ? "Base" : "Neutro");
}

function actualizarGenericSim(v) {
    simVars.param1 = parseFloat(v);
    $("valCtrlGeneric").textContent = v + "%";
}
function registrarEnsayoGenerico() {
    const v = simVars.param1 || 50;
    registrarFilaTabla(`Parámetro Entrada (${v}%)`, `Lectura = ${(v * 1.34).toFixed(1)} u`, "Completado");
}

function registrarFilaTabla(control, resultado, estado) {
    const num = userSession.ensayos.length + 1;
    userSession.ensayos.push({ num, control, resultado, estado });
    actualizarTablaHTML();
    experiments++;
    saveProgress();
}

function actualizarTablaHTML() {
    const tbody = $("tablaRegistrosBody");
    if (!tbody) return;
    tbody.innerHTML = userSession.ensayos.map(e => `
        <tr>
            <td><b>#${e.num}</b></td>
            <td>${e.control}</td>
            <td style="color:var(--cyan); font-weight:800; font-family:'JetBrains Mono', monospace;">${e.resultado}</td>
            <td><span class="pill-status" style="font-size:10px;">${e.estado}</span></td>
        </tr>
    `).join("");
}

function poblarPaso5() {
    actualizarTablaHTML();
    const c = $("quizAnalisisOptions");
    c.innerHTML = expActual.analisisOpciones.map(opt => `
        <div class="quiz-option" onclick="seleccionarAnalisis(this, '${escapeHTML(opt)}')">${opt}</div>
    `).join("");
}
function seleccionarAnalisis(el, texto) {
    document.querySelectorAll("#quizAnalisisOptions .quiz-option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    userSession.analisisSeleccionado = texto;
}

function poblarPaso6() {
    const c = $("quizConclusionOptions");
    c.innerHTML = expActual.conclusionesOpciones.map(opt => `
        <div class="quiz-option" onclick="seleccionarConclusion(this, '${escapeHTML(opt)}')">${opt}</div>
    `).join("");
}
function seleccionarConclusion(el, texto) {
    document.querySelectorAll("#quizConclusionOptions .quiz-option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    userSession.conclusionSeleccionada = texto;
}

function poblarPaso7() {
    const c = $("quizComOptions");
    c.innerHTML = expActual.titularesCom.map(tit => `
        <div class="quiz-option" onclick="seleccionarCom(this, '${escapeHTML(tit)}')">${tit}</div>
    `).join("");
}
function seleccionarCom(el, texto) {
    document.querySelectorAll("#quizComOptions .quiz-option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    userSession.comunicacionTitular = texto;
}

// ==========================================================================
// EVALUACIÓN POR IA HÍBRIDA MEJORADA (CALIFICACIÓN COMPLETA 100/100)
// ==========================================================================
function ejecutarEvaluacionMisionFinal() {
    detenerCanvas();
    $("misionLabCard").classList.add("hidden");
    $("dictamenCard").classList.remove("hidden");

    userSession.observacionLibre = $("inputObsExtra").value.trim();
    userSession.conclusionTexto = $("inputConclusionTexto").value.trim();

    // RÚBRICA Y PUNTUACIÓN MEJORADA: Si el estudiante completó los pasos -> 100 / 100 PTS!
    let score = 0;
    const rubrica = [];

    // 1. Observación (15 pts)
    if (userSession.observacionSeleccionada) {
        score += 15;
        rubrica.push({ paso: "1. Observación", aprobado: true, mensaje: "Identificaste con precisión el fenómeno y variables observables." });
    } else {
        rubrica.push({ paso: "1. Observación", aprobado: false, mensaje: "No seleccionaste ninguna observación concreta." });
    }

    // 2. Planteamiento del Problema (15 pts)
    if (userSession.problemaSeleccionado) {
        score += 15;
        rubrica.push({ paso: "2. Planteamiento", aprobado: true, mensaje: "Formulaste una pregunta de investigación con clara relación causal." });
    } else {
        rubrica.push({ paso: "2. Planteamiento", aprobado: false, mensaje: "Falta definir el problema de investigación." });
    }

    // 3. Formulación de Hipótesis (15 pts)
    if (userSession.hipotesisCondicion && userSession.hipotesisEfecto) {
        score += 15;
        rubrica.push({ paso: "3. Hipótesis", aprobado: true, mensaje: `Construcción predictiva impecable: 'Si ${userSession.hipotesisCondicion}, entonces ${userSession.hipotesisEfecto}'.` });
    } else {
        rubrica.push({ paso: "3. Hipótesis", aprobado: false, mensaje: "Falta formular la predicción hipotética." });
    }

    // 4. Experimentación Cuantitativa (20 pts)
    if (userSession.ensayos.length >= 1) {
        score += 20;
        rubrica.push({ paso: "4. Experimentación", aprobado: true, mensaje: `Rigor experimental: ejecutaste ${userSession.ensayos.length} ensayos controlados con mediciones verificadas.` });
    } else {
        rubrica.push({ paso: "4. Experimentación", aprobado: false, mensaje: "Se requiere registrar al menos una medición empírica." });
    }

    // 5. Análisis de Mediciones (15 pts)
    if (userSession.analisisSeleccionado) {
        score += 15;
        rubrica.push({ paso: "5. Análisis de Datos", aprobado: true, mensaje: "Descubriste con acierto la tendencia matemática subyacente en la tabla." });
    } else {
        rubrica.push({ paso: "5. Análisis de Datos", aprobado: false, mensaje: "No seleccionaste la tendencia de los datos." });
    }

    // 6. Conclusión Reflexiva (10 pts)
    if (userSession.conclusionSeleccionada) {
        score += 10;
        rubrica.push({ paso: "6. Conclusión", aprobado: true, mensaje: "Contrastaste con honestidad científica las mediciones contra tu hipótesis." });
    } else {
        rubrica.push({ paso: "6. Conclusión", aprobado: false, mensaje: "Falta seleccionar la conclusión final." });
    }

    // 7. Divulgación y Titular (10 pts)
    if (userSession.comunicacionTitular) {
        score += 10;
        rubrica.push({ paso: "7. Divulgación", aprobado: true, mensaje: "Elegiste un titular atractivo, claro y riguroso para la comunidad científica." });
    } else {
        rubrica.push({ paso: "7. Divulgación", aprobado: false, mensaje: "Falta seleccionar el titular de comunicación." });
    }

    // Total máximo garantizado de 100 puntos si todo fue respondido
    $("dictamenScore").textContent = `${score} / 100 PTS`;
    $("dictamenRank").textContent = score >= 90 ? "🏆 Maestro del Cosmos (100% de Rigor)" : score >= 75 ? "⚡ Investigador Cuántico" : "🌱 Explorador Novato";
    $("dictamenMsg").textContent = score >= 90 
        ? "¡Trabajo científico perfecto! Demostraste un dominio sobresaliente del método experimental con hipótesis comprobables y análisis cuantitativo impecable."
        : "¡Buen intento! Aplicaste el método científico con dedicación; prueba repasar más ensayos para maximizar tu puntaje.";

    $("dictamenRubrica").innerHTML = rubrica.map(r => `
        <div class="eval-rubrica-item ${r.aprobado ? '' : 'warn'}">
            <b>${r.aprobado ? '✔ Logrado' : '⚠️ Atención'} - ${r.paso}:</b>
            <p style="color:var(--muted); margin-top:3px;">${r.mensaje}</p>
        </div>
    `).join("");

    missionsCompleted++;
    saveProgress();
    addActivity(`Completó la misión "${expActual.titulo}" con ${score}/100 PTS`);
}

// ==========================================================================
// RENDERIZADOR CANVAS INTERACTIVO (NEWTON, PÉNDULO, CIRCUITO, PH)
// ==========================================================================
function detenerCanvas() {
    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
    }
}

function arrancarCanvas(canvasId, tipo, esDemo) {
    detenerCanvas();
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let xPos = 40;
    let t = 0;
    let velocidadActual = 0;
    let isDragging = false;
    let anguloPendulo = (45 * Math.PI) / 180;
    let velAngular = 0;
    let isDraggingPendulo = false;

    // Responsive Canvas
    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0) {
            canvas.width = Math.min(600, Math.floor(rect.width));
            canvas.height = 240;
        }
    };
    resizeCanvas();

    // Eventos Mouse / Touch
    const onDown = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (clientX - rect.left) * (canvas.width / rect.width);
        const my = (clientY - rect.top) * (canvas.height / rect.height);

        if (tipo === "fuerza" || tipo === "choque") {
            if (mx >= xPos - 20 && mx <= xPos + 80 && my >= canvas.height - 75 && my <= canvas.height - 15) {
                isDragging = true;
            }
        } else if (tipo === "pendulo") {
            const cx = canvas.width / 2;
            const cy = 30;
            const xE = cx + 120 * Math.sin(anguloPendulo);
            const yE = cy + 120 * Math.cos(anguloPendulo);
            if (Math.hypot(mx - xE, my - yE) < 40) {
                isDraggingPendulo = true;
                velAngular = 0;
            }
        }
    };

    const onMove = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (clientX - rect.left) * (canvas.width / rect.width);
        const my = (clientY - rect.top) * (canvas.height / rect.height);

        if (isDragging) {
            xPos = Math.max(40, Math.min(mx - 30, canvas.width - 70));
            velocidadActual = 0;
        }
        if (isDraggingPendulo) {
            const cx = canvas.width / 2;
            const cy = 30;
            anguloPendulo = Math.max(-1.3, Math.min(1.3, Math.atan2(mx - cx, my - cy)));
            velAngular = 0;
        }
    };

    const onUp = () => {
        isDragging = false;
        isDraggingPendulo = false;
    };

    canvas.onmousedown = (e) => onDown(e.clientX, e.clientY);
    window.onmousemove = (e) => onMove(e.clientX, e.clientY);
    window.onmouseup = onUp;
    canvas.ontouchstart = (e) => { if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY); };
    window.ontouchmove = (e) => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); };
    window.ontouchend = onUp;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.04;

        if (tipo === "fuerza" || tipo === "choque") {
            // Pista
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 30);
            ctx.lineTo(canvas.width, canvas.height - 30);
            ctx.stroke();

            if (esDemo) {
                xPos = canvas.width / 2 - 30 + Math.sin(t * 2) * 80;
            } else {
                if (simVars.impulsoActivo) {
                    velocidadActual = (simVars.velocidadAcc || 2.0) * 0.45;
                    simVars.impulsoActivo = false;
                }
                if (!isDragging) {
                    if (velocidadActual > 0.05) {
                        xPos += velocidadActual;
                        velocidadActual *= 0.96;
                    } else {
                        velocidadActual = 0;
                    }
                }
                if (xPos >= canvas.width - 70) {
                    xPos = canvas.width - 70;
                    velocidadActual = 0;
                }
            }

            // Carro
            ctx.fillStyle = isDragging ? "#10b981" : "#24d9f2";
            ctx.shadowColor = isDragging ? "#10b981" : "#24d9f2";
            ctx.shadowBlur = 10;
            ctx.fillRect(xPos, canvas.height - 65, 60, 25);
            ctx.shadowBlur = 0;

            // Ruedas
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(xPos + 14, canvas.height - 38, 7, 0, Math.PI * 2);
            ctx.arc(xPos + 46, canvas.height - 38, 7, 0, Math.PI * 2);
            ctx.fill();

        } else if (tipo === "pendulo") {
            const cx = canvas.width / 2;
            const cy = 30;
            const len = 120;
            if (!isDraggingPendulo) {
                const acel = (-0.4 / len) * Math.sin(anguloPendulo);
                velAngular += acel;
                anguloPendulo += velAngular;
                velAngular *= 0.998;
            }
            const xE = cx + len * Math.sin(anguloPendulo);
            const yE = cy + len * Math.cos(anguloPendulo);

            // Cuerda
            ctx.strokeStyle = isDraggingPendulo ? "#54e6a5" : "#24d9f2";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(xE, yE);
            ctx.stroke();

            // Esfera
            ctx.fillStyle = isDraggingPendulo ? "#54e6a5" : "#9b7bff";
            ctx.shadowColor = "#9b7bff";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(xE, yE, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

        } else if (tipo === "circuito") {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const V = simVars.param1 || 9;

            ctx.strokeStyle = "#24d9f2";
            ctx.lineWidth = 4;
            ctx.strokeRect(cx - 150, cy - 65, 300, 130);

            // Batería
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(cx - 160, cy - 20, 20, 40);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(`${V}V`, cx - 190, cy + 5);

            // Foco
            const brillo = Math.min(1, V / 15);
            ctx.fillStyle = `rgba(255, 235, 59, ${0.25 + brillo * 0.75})`;
            ctx.shadowColor = "#ffee55";
            ctx.shadowBlur = brillo * 28;
            ctx.beginPath();
            ctx.arc(cx, cy + 65, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Electrones
            ctx.fillStyle = "#24d9f2";
            for (let i = 0; i < 8; i++) {
                const pos = (t * 70 + i * (600 / 8)) % 600;
                let ex = cx - 150, ey = cy - 65;
                if (pos < 300) ex += pos;
                else if (pos < 430) { ex += 300; ey += (pos - 300); }
                else if (pos < 600) { ex = cx + 150 - (pos - 430); ey = cy + 65; }
                ctx.beginPath();
                ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

        } else if (tipo === "ph") {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const ph = simVars.param1 || 7.0;
            const col = ph < 6 ? "#ff70b7" : ph > 8 ? "#9b7bff" : "#54e6a5";

            ctx.fillStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = 18;
            ctx.fillRect(cx - 50, cy - 20, 100, 95);
            ctx.shadowBlur = 0;

            ctx.strokeStyle = "#a9b8ce";
            ctx.lineWidth = 4;
            ctx.strokeRect(cx - 55, cy - 30, 110, 110);

        } else {
            // Onda interactiva armónica
            ctx.strokeStyle = "#24d9f2";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 15) {
                const y = canvas.height / 2 + Math.sin(t * 1.5 + i * 0.04) * 35;
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            }
            ctx.stroke();
        }

        animId = requestAnimationFrame(render);
    }
    render();
}

// Taller de circuitos
function abrirConstructorCircuito() {
    $("modalBuilderCircuito").classList.remove("hidden");
    $("builderStepTag").innerText = "Paso 1 de 3";
    $("builderInstruction").innerText = "1. Selecciona y coloca la Fuente de Voltaje (Batería):";
    $("btnCompBateria").classList.remove("hidden");
    $("btnCompCable").classList.add("hidden");
    $("btnCompFoco").classList.add("hidden");
    $("btnFinishCircuit").classList.add("hidden");
    $("builderPreview").innerHTML = "<i>Tablero de pruebas listo...</i>";
}

function agregarComponenteCircuito(tipo) {
    if (tipo === "bateria") {
        $("builderPreview").innerHTML = "🔋 <b>Batería de 9V colocada.</b> Falta conectar los cables.";
        $("btnCompBateria").classList.add("hidden");
        $("btnCompCable").classList.remove("hidden");
        $("builderStepTag").innerText = "Paso 2 de 3";
        $("builderInstruction").innerText = "2. Conecta los cables conductores de cobre:";
    } else if (tipo === "cable") {
        $("builderPreview").innerHTML = "🔋 Batería + ⚡ <b>Cables conectados.</b> Falta el receptor de luz.";
        $("btnCompCable").classList.add("hidden");
        $("btnCompFoco").classList.remove("hidden");
        $("builderStepTag").innerText = "Paso 3 de 3";
        $("builderInstruction").innerText = "3. Instala la bombilla / foco para cerrar el circuito:";
    } else if (tipo === "foco") {
        $("builderPreview").innerHTML = "✅ <b>¡Circuito Completo y Energizado!</b> 🔋 Batería + ⚡ Cables + 💡 Foco.";
        $("btnCompFoco").classList.add("hidden");
        $("builderStepTag").innerText = "Completado";
        $("builderInstruction").innerText = "¡Excelente trabajo! Todo está listo para la observación.";
        $("btnFinishCircuit").classList.remove("hidden");
    }
}

function completarConstruccionCircuito() {
    $("modalBuilderCircuito").classList.add("hidden");
    cambiarPaso(1);
}

// ==========================================================================
// ASISTENTE DE IA NEXOR-IA
// ==========================================================================
function getAIResponse(question) {
    const text = question.toLowerCase();

    if (text.includes("hola") || text.includes("buenos") || text.includes("saludos")) {
        return `¡Hola ${student}! Soy NEXOR-IA. Estoy listo para ayudarte con fórmulas, hipótesis, simuladores de física, química y biología. ¿Qué te gustaría aprender hoy?`;
    }
    if (text.includes("velocidad") || text.includes("movimiento")) {
        return "La velocidad media indica la distancia recorrida por unidad de tiempo: v = d / t. Por ejemplo, recorrer 100 metros en 10 segundos equivale a una velocidad media de 10 m/s (36 km/h).";
    }
    if (text.includes("ohm") || text.includes("electricidad") || text.includes("corriente") || text.includes("voltaje")) {
        return "La Ley de Ohm establece que V = I · R (Voltaje = Corriente × Resistencia). Si aumentas el voltaje manteniendo fija la resistencia, la corriente aumenta y el foco brilla con mayor intensidad.";
    }
    if (text.includes("atomo") || text.includes("átomo") || text.includes("proton") || text.includes("electron")) {
        return "El átomo está compuesto por un núcleo central con Protones (+1) y Neutrones (neutros), rodeado por orbitales donde se encuentran los Electrones (-1).";
    }
    if (text.includes("mezcla") || text.includes("disolver") || text.includes("quimica")) {
        return "Una mezcla homogénea presenta una sola fase (como sal disuelta en agua), mientras que una heterogénea presenta dos o más fases visibles (como agua con aceite o arena suspendida).";
    }
    if (text.includes("fotosintesis") || text.includes("fotosíntesis") || text.includes("planta")) {
        return "La fotosíntesis convierte energía luminosa, agua y CO2 en glucosa y oxígeno molecular (O2). En el simulador de Biología puedes mover el deslizador de luz para comprobar su efecto en la planta.";
    }
    if (text.includes("celula") || text.includes("célula")) {
        return "La célula es la unidad básica de la vida. Entre sus estructuras principales destacan el núcleo (que resguarda el ADN), la membrana plasmática (regula el paso de sustancias) y el citoplasma.";
    }
    if (text.includes("newton") || text.includes("fuerza") || text.includes("aceleracion")) {
        return "La 2ª Ley de Newton establece que la aceleración es directamente proporcional a la fuerza neta aplicada e inversamente proporcional a la masa del cuerpo (F = m · a).";
    }
    if (text.includes("hipotesis") || text.includes("hipótesis")) {
        return "Una buena hipótesis científica predice una relación causal comprobable: 'Si [condición experimental], entonces [resultado predicho]'. Lo importante es que pueda someterse a pruebas empíricas.";
    }
    return `Excelente pregunta científica sobre "${question}". Para investigarla con rigor, primero delimitamos las variables que intervienen, formulamos una hipótesis predictiva y ejecutamos mediciones en nuestros laboratorios interactivos.`;
}

$("chatForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = $("chatInput");
    const q = input.value.trim();
    if (!q) return;

    appendMessage(q, "user-message");
    input.value = "";
    addActivity(`Consulta a NEXOR-IA: "${q.substring(0, 35)}..."`);

    setTimeout(() => {
        const resp = getAIResponse(q);
        appendMessage(resp, "bot-message");
    }, 350);
});

function sendQuickChat(msg) {
    $("chatInput").value = msg;
    $("chatForm").dispatchEvent(new Event("submit"));
}

function appendMessage(text, className) {
    const box = $("chatMessages");
    const div = document.createElement("div");
    div.className = "message " + className;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// Config Modal
function toggleModalConfig() {
    $("modalConfig").classList.toggle("hidden");
    $("inputApiKey").value = localStorage.getItem("nexora_gemini_key") || "";
}

function guardarApiKey() {
    const k = $("inputApiKey").value.trim();
    if (k) {
        localStorage.setItem("nexora_gemini_key", k);
        alert("¡Clave de IA guardada!");
    } else {
        localStorage.removeItem("nexora_gemini_key");
        alert("Se utilizará la IA Local Autónoma de forma predeterminada.");
    }
    toggleModalConfig();
}

// Inicialización de la aplicación
window.onload = () => {
    cargarTemaGuardado();
    syncRed();
    updateProgressUI();
    if (student) {
        enterApp(student);
    }
};
