// ==========================================================================
// CONFIGURACIÓN INICIAL
// ==========================================================================
const NOMBRE_VALIDO = "cristal"; 

// NUEVA LISTA AMPLIADA (Sin pickleball)
const opcionesRuleta = [
    "🎳 Ir a los Bolos", 
    "🍿 Cine", 
    "🍔 Cena Romántica", 
    "🍦 Por un Helado", 
    "☕ Ir a un Café", 
    "🧺 Hacer un Picnic",
    "🌳 Pasear juntos",
    "🖼 Visitar un Museo"
];

// Buscamos dinámicamente en qué posición quedó "🍿 Cine" para no errar el tiro
const indiceDestino = opcionesRuleta.findIndex(item => item.includes("Cine")); 

// ==========================================================================
// CONTROL DE PANTALLAS
// ==========================================================================
function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
}

function checkName() {
    const inputName = document.getElementById('partner-name').value.trim().toLowerCase();
    const errorMsg = document.getElementById('lock-error');
    
    if (inputName === NOMBRE_VALIDO) {
        errorMsg.style.display = 'none';
        switchScreen('screen-lock', 'screen-roulette');
        initRoulette();
    } else {
        errorMsg.style.display = 'block';
        const card = document.querySelector('.lock-card');
        card.style.transform = 'translateX(10px)';
        setTimeout(() => card.style.transform = 'translateX(-10px)', 100);
        setTimeout(() => card.style.transform = 'translateX(0)', 200);
    }
}

// Escuchar la tecla Enter
document.getElementById('partner-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkName();
    }
});


// ==========================================================================
// LOGICA DE LA RULETA (MÁQUINA TRAGAMONEDAS)
// ==========================================================================
const slotMachine = document.getElementById('slot-machine');

function initRoulette() {
    let htmlContent = "";
    // Duplicamos el set de datos para crear el scroll infinito visual
    for (let loop = 0; loop < 20; loop++) {
        opcionesRuleta.forEach(opcion => {
            htmlContent += `<div class="slot-item">${opcion}</div>`;
        });
    }
    slotMachine.innerHTML = htmlContent;
}

function spinRoulette() {
    const btnSpin = document.getElementById('btn-spin');
    btnSpin.disabled = true;
    btnSpin.innerText = "Girando...";

    const heightPerItem = 64; 
    const totalItemsInLoop = opcionesRuleta.length;
    
    const vueltasCompletas = 5; // Más vueltas para que se luzca la nueva lista larga
    const itemFinalAbsoluto = (vueltasCompletas * totalItemsInLoop) + indiceDestino;
    const destinoPixeles = -(itemFinalAbsoluto * heightPerItem);

    let currentPos = 0;
    const totalDuration = 4000; // 4 segundos girando
    const startTime = performance.now();

    function animateSpin(timestamp) {
        const elapsed = timestamp - startTime;
        
        if (elapsed < totalDuration) {
            let progress = elapsed / totalDuration;
            let easeOutQuad = 1 - Math.pow(1 - progress, 3);
            currentPos = easeOutQuad * destinoPixeles;
            
            slotMachine.style.top = `${currentPos}px`;
            requestAnimationFrame(animateSpin);
        } else {
            slotMachine.style.top = `${destinoPixeles}px`;
            
            // Avanzar a la siguiente pantalla tras una pequeña pausa de victoria
            setTimeout(() => {
                switchScreen('screen-roulette', 'screen-time');
            }, 1500);
        }
    }

    requestAnimationFrame(animateSpin);
}

// ==========================================================================
// CONTROL DE HORARIOS
// ==========================================================================
function confirmTime() {
    const selectedRadio = document.querySelector('input[name="time-option"]:checked');
    if (selectedRadio) {
        const horaElegida = selectedRadio.value;
        document.getElementById('chosen-time').innerText = horaElegida;
        switchScreen('screen-time', 'screen-final');
    }
}
