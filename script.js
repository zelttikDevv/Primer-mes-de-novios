// ==========================================================================
// CONFIGURACIÓN INICIAL
// ==========================================================================
const NOMBRE_VALIDO = "cristal"; 

// Lista de opciones para la ruleta
const opcionesRuleta = ["🎨 Pintura", "🍿 Cine", "🍔 Cena", "✈ Viajar", "🎾 Pickleball"];
// Índice del elemento donde quieres que se detenga forzosamente (1 = Cine)
const indiceDestino = 1; 

// ==========================================================================
// LLUVIA ESTILO MATRIX (Efecto Visual de Fondo)
// ==========================================================================
function buildMatrixBg() {
    const matrixContainer = document.getElementById('matrix');
    if(!matrixContainer) return;
    
    let columns = Math.floor(window.innerWidth / 30);
    let content = "";
    for(let i=0; i<columns; i++) {
        let randomDelay = (Math.random() * 5).toFixed(1);
        let randomDuration = (Math.floor(Math.random() * 4) + 3);
        content += `<div style="display:inline-block; margin:5px; transform: translateY(-100px); animation: fall ${randomDuration}s linear ${randomDelay}s infinite; color: #40041d;">❤<br>0<br>1<br>❤<br>1<br>0</div>`;
    }
    matrixContainer.innerHTML = content;
}

// Agregar estilos CSS dinámicos de caída para el efecto Matrix
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fall {
    0% { transform: translateY(-100px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(${window.innerHeight}px); opacity: 0; }
}`;
document.head.appendChild(styleSheet);
window.addEventListener('load', buildMatrixBg);


// ==========================================================================
// LÓGICA DE CONTROL DE PANTALLAS
// ==========================================================================
function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
}

// Validación del nombre
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

// Permitir presionar "Enter" para ingresar
document.getElementById('partner-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkName();
    }
});


// ==========================================================================
// LÓGICA DE LA RULETA (MÁQUINA TRAGAMONEDAS)
// ==========================================================================
const slotMachine = document.getElementById('slot-machine');

function initRoulette() {
    let htmlContent = "";
    // Duplicamos las opciones bastantes veces para simular el desplazamiento infinito
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
    btnSpin.innerText = "Girando...";

    const heightPerItem = 64; // Alto de cada opción en px (sincronizado con CSS)
    const totalItemsInLoop = opcionesRuleta.length;
    
    const vueltasCompletas = 4;
    const itemFinalAbsoluto = (vueltasCompletas * totalItemsInLoop) + indiceDestino;
    const destinoPixeles = -(itemFinalAbsoluto * heightPerItem);

    let currentPos = 0;
    const totalDuration = 3500; // Tiempo total de giro (3.5 segundos)
    const startTime = performance.now();

    function animateSpin(timestamp) {
        const elapsed = timestamp - startTime;
        
        if (elapsed < totalDuration) {
            let progress = elapsed / totalDuration;
            // Easing Out cúbico para una desaceleración suave y natural
            let easeOutQuad = 1 - Math.pow(1 - progress, 3);
            currentPos = easeOutQuad * destinoPixeles;
            
            slotMachine.style.top = `${currentPos}px`;
            requestAnimationFrame(animateSpin);
        } else {
            slotMachine.style.top = `${destinoPixeles}px`;
            
            setTimeout(() => {
                switchScreen('screen-roulette', 'screen-time');
            }, 1200);
        }
    }

    requestAnimationFrame(animateSpin);
}


// ==========================================================================
// LÓGICA DE CONFIRMACIÓN DE HORARIO
// ==========================================================================
function confirmTime() {
    const selectedRadio = document.querySelector('input[name="time-option"]:checked');
    if (selectedRadio) {
        const horaElegida = selectedRadio.value;
        document.getElementById('chosen-time').innerText = horaElegida;
        switchScreen('screen-time', 'screen-final');
    }
}
