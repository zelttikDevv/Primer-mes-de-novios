// ==========================================================================
// CONFIGURACIÓN INICIAL
// ==========================================================================
const NOMBRE_VALIDO = "cristal"; 
let planSeleccionadoGlobal = ""; // Variable para recordar qué plan salió

// TU LISTA DE MIÉRCOLES DE NOVIOS TOTALMENTE PERSONALIZADA
const opcionesRuleta = [
    "🏖️ Ir a la playa", 
    "🍿 Cine", 
    "🍷 Cena Romántica", 
    "🍦 Ir por un Helado", 
    "☕ Ir a una Cafetería", 
    "🧺 Picnic en la playa", 
    "🌳 Pasear juntos", 
    "🎬 Noche de películas", 
    "🐱 Ir al parque con Kira (si se deja pechera)", 
    "🎮 Nochecita de videojuegos", 
    "🎱 Ir a jugar billar", 
    "🎤 Ir al karaoke", 
    "💋 Unos besitos bien sabrosos"
];

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

document.getElementById('partner-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { checkName(); }
});

// ==========================================================================
// LÓGICA DE LA RULETA (100% ALEATORIA)
// ==========================================================================
const slotMachine = document.getElementById('slot-machine');

function initRoulette() {
    let htmlContent = "";
    // Creamos bucles repetidos de la lista para simular el scroll continuo al girar
    for (let loop = 0; loop < 15; loop++) {
        opcionesRuleta.forEach(opcion => {
            htmlContent += `<div class="slot-item">${opcion}</div>`;
        });
    }
    slotMachine.innerHTML = htmlContent;
}

function spinRoulette() {
    const btnSpin = document.getElementById('btn-spin');
    btnSpin.disabled = true;
    btnSpin.innerText = "Decidiendo...";

    const heightPerItem = 64; 
    const totalItemsInLoop = opcionesRuleta.length;
    
    // ELECCIÓN AL AZAR: Escoge un número totalmente random del catálogo
    const indiceDestinoRandom = Math.floor(Math.random() * totalItemsInLoop);
    planSeleccionadoGlobal = opcionesRuleta[indiceDestinoRandom];
    
    const vueltasCompletas = 4; 
    const itemFinalAbsoluto = (vueltasCompletas * totalItemsInLoop) + indiceDestinoRandom;
    const destinoPixeles = -(itemFinalAbsoluto * heightPerItem);

    let currentPos = 0;
    const totalDuration = 4000; // 4 segundos de rotación
    const startTime = performance.now();

    function animateSpin(timestamp) {
        const elapsed = timestamp - startTime;
        
        if (elapsed < totalDuration) {
            let progress = elapsed / totalDuration;
            let easeOutQuad = 1 - Math.pow(1 - progress, 3); // Freno progresivo suave
            currentPos = easeOutQuad * destinoPixeles;
            
            slotMachine.style.top = `${currentPos}px`;
            requestAnimationFrame(animateSpin);
        } else {
            slotMachine.style.top = `${destinoPixeles}px`;
            
            // Pasamos a la siguiente pantalla tras segundo y medio de suspenso
            setTimeout(() => { 
                switchScreen('screen-roulette', 'screen-time'); 
            }, 1500);
        }
    }
    requestAnimationFrame(animateSpin);
}

// ==========================================================================
// CONTROL DE HORARIOS Y PANTALLA GANADORA
// ==========================================================================
function confirmTime() {
    const selectedRadio = document.querySelector('input[name="time-option"]:checked');
    if (selectedRadio) {
        const horaElegida = selectedRadio.value;
        
        // Inyectamos el plan ganador y la hora de manera dinámica en la pantalla final
        const textFinal = document.querySelector('.romantic-text');
        textFinal.innerHTML = `¡Hoy toca: <strong>${planSeleccionadoGlobal}</strong>!<br>Ya eres hermosa, pero estate lista a las <span id="chosen-time">${horaElegida}</span>`;
        
        switchScreen('screen-time', 'screen-final');
    }
}
