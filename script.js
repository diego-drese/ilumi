// Variáveis globais
let userEmail           = '';
let selectedLevel       = '';
let gameStarted         = false;
let gameTimer;
let movesCount          = 0;
let totalPairs          = 0;
let matchedPairs        = 0;
let gameArea            = document.getElementById('game-area');

let movesDisplay        = document.getElementById('moves');
let movesCountDisplay   = document.getElementById('moves-count');
let matchPairsDisplay   = document.getElementById('match-pairs');
let timerDisplay        = document.getElementById('timer');

// Array com os nomes dos produtos
const productList = [
    {
        name: 'Benjamin',
        image: '/carta_benjamin_ilumi.jpg'
    },{
        name: 'Flex',
        image: '/carta_flex_ilumi.jpg'
    },{
        name: 'Lançamentos',
        image: '/carta_lancamentos_ilumi.jpg'
    },{
        name: 'Mix',
        image: '/carta_mix_ilumi.jpg'
    },{
        name: 'Monobloco',
        image: '/carta_monobloco_ilumi.jpg'
    },{
        name: 'Pensou',
        image: '/carta_pensou_ilumi.jpg'
    },{
        name: 'Stylus',
        image: '/carta_stylus_ilumi.jpg'
    },{
        name: 'Vivaz',
        image: '/carta_vivaz_ilumi.jpg'
    }

];

// Função para embaralhar o array de produtos
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para criar as cartas do jogo
function createCards() {
    const cards = shuffleArray([...productList]).slice(0, totalPairs);
    const cardPairs = [...cards, ...cards];
    shuffleArray(cardPairs);

    const totalCards = cardPairs.length;
    const columns = Math.ceil(Math.sqrt(totalCards));
    const rows = Math.ceil(totalCards / columns);

    gameArea.innerHTML = '';
    gameArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gameArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;


    cardPairs.forEach((product, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        cardBack.appendChild(img);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', () => {
            if (gameStarted && !card.classList.contains('matched') && !card.classList.contains('selected') && document.querySelectorAll('.card.selected').length < 2) {
                card.classList.add('selected');
                cardInner.classList.add('flipped');
                const selectedCards = document.querySelectorAll('.card.selected');
                if (selectedCards.length === 2) {
                    const [card1, card2] = selectedCards;
                    if (card1.querySelector('.card-back img').alt === card2.querySelector('.card-back img').alt) {
                        setTimeout(() => {
                            selectedCards.forEach((card) => {
                                card.classList.add('matched');
                                card.classList.remove('selected');
                            });
                            matchedPairs++;
                            if (matchedPairs === totalPairs) {
                                endGame(true);
                            }
                        }, 500);
                    } else {
                        setTimeout(() => {
                            selectedCards.forEach((card) => {
                                card.classList.remove('selected');
                                card.querySelector('.card-inner').classList.remove('flipped');
                            });
                        }, 500);
                    }
                    movesCount++;
                    movesDisplay.textContent = movesCount;
                }
            }
        });
        gameArea.appendChild(card);
    });
    document.querySelectorAll('.card').forEach((card) => {
        card.querySelector('.card-inner').classList.add('flipped');
    });
    startCountdown();
}

// Função para iniciar a contagem regressiva
function startCountdown() {
    document.getElementById('countdown').style.display = 'block';
    anime({
        targets: '.number',
        scale: [4, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: anime.stagger(1000),
        complete: () => {
            startTimer();
        },
    });
}

// Função para iniciar o jogo
function startGame() {
    userEmail       = null;
    totalPairs      = 8;
    gameStarted     = true;
    movesCount      = 0;
    matchedPairs    = 0;
    document.getElementById('start-modal').classList.add('hidden');
    document.getElementById('game-over-modal').classList.add('hidden');
    createCards();
}
// funcao para animar o timer e os movimentos
function infoAnimation(start){
    if(start){
        document.getElementById('timer').classList.add('info-animation');
        document.getElementById('moves').classList.add('info-animation');
    }else{
        document.getElementById('timer').classList.remove('info-animation');
        document.getElementById('moves').classList.remove('info-animation');
    }
}

// Função para iniciar o temporizador
function startTimer() {
    let seconds = 60;
    if (!timerDisplay) {
        console.error("Elemento 'timer' não encontrado no HTML.");
        return;
    }
    gameTimer = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${padZero(minutes)}:${padZero(remainingSeconds)}`;
        seconds--;
        if (seconds < 0) {
            clearInterval(gameTimer);
            endGame();
        }
    }, 1000);

    document.querySelectorAll('.card').forEach((card) => {
        card.querySelector('.card-inner').classList.remove('flipped');
    });
    gameStarted = true;
    infoAnimation(true);
    document.getElementById('countdown').style.display = 'none';
}

// Função auxiliar para adicionar um zero à esquerda dos números menores que 10
function padZero(number) {
    return number < 10 ? `0${number}` : number;
}

// Função para encerrar o jogo
function endGame(finished) {
    clearInterval(gameTimer);
    gameStarted = false;
    document.getElementById('game-over-modal').classList.remove('hidden');
    movesCountDisplay.textContent = `Número de movimentos: ${movesCount}`;
    matchPairsDisplay.textContent = `Pares encontrados: ${matchedPairs}`;
    if (finished) {
        document.getElementById('game-over-title').textContent = 'Parabéns!';
        window.confettiful.startConfetti();
    } else {
        document.getElementById('game-over-title').textContent = 'Fim de jogo!';
    }
    infoAnimation();
}

// Função para reiniciar o jogo
function restartGame() {
    document.getElementById('start-modal').classList.remove('hidden');
    document.getElementById('game-over-modal').classList.add('hidden');
    gameArea.innerHTML = '';

    // Resetar variáveis globais
    userEmail               = '';
    selectedLevel           = '';
    gameStarted             = false;
    movesCount              = 0;
    totalPairs              = 0;
    matchedPairs            = 0;
    timerDisplay.textContent= '00:00';
    movesDisplay.textContent= movesCount;
    window.confettiful.stopConfetti();
}

// Função para selecionar o nível na modal de início
function selectStartLevel(level) {
    document.querySelectorAll('.level-options button').forEach((btn) => {
        btn.classList.remove('selected');
    });
    level.classList.add('selected');
}

// Função para exibir a modal de início
function showStartModal() {
    document.getElementById('start-modal').classList.remove('hidden');
}

// Adicionar evento de clique nos botões de nível na modal de início
document.querySelectorAll('.level-options button').forEach((btn) => {
    btn.addEventListener('click', () => {
        selectStartLevel(btn);
        selectedLevel = btn.id;
    });
});

// Adicionar evento de envio do formulário na modal de início
document.getElementById('startGame').addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
});

// de reiniciar na modal de encerramento
document.getElementById('restart-btn').addEventListener('click', () => {
  restartGame();
});

// Chamar a função para exibir a modal de início
showStartModal();

/** Congratulations*/
const Confettiful = function(el) {
    this.el = el;
    this.containerEl = null;
    this.confettiFrequency = 3;
    this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
    this.confettiAnimations = ['slow', 'medium', 'fast'];

    this._setupElements();
    this._renderConfetti();
};

Confettiful.prototype._setupElements = function() {
    const containerEl = document.createElement('div');
    const elPosition = this.el.style.position;
    if (elPosition !== 'relative' || elPosition !== 'absolute') {
        this.el.style.position = 'relative';
    }
    containerEl.classList.add('confetti-container');
    this.el.appendChild(containerEl);
    this.containerEl = containerEl;
};

Confettiful.prototype._renderConfetti = function() {
    this.confettiInterval = setInterval(() => {
        const confettiEl = document.createElement('div');
        const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
        const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
        const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];

        confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
        confettiEl.style.left               = confettiLeft;
        confettiEl.style.width              = confettiSize;
        confettiEl.style.height             = confettiSize;
        confettiEl.style.backgroundColor    = confettiBackground;

        confettiEl.removeTimeout = setTimeout(function() {
            confettiEl.parentNode.removeChild(confettiEl);
        }, 3000);

        this.containerEl.appendChild(confettiEl);
    }, 25);
};

Confettiful.prototype.startConfetti = function() {
    this.containerEl.style.display= 'block';
    if (this.confettiInterval){
        return;
    }
    this._renderConfetti();
};

Confettiful.prototype.stopConfetti = function() {
    this.containerEl.style.display= 'none';
    if (!this.confettiInterval){
        return;
    }
    clearInterval(this.confettiInterval);
    this.confettiInterval = null;
    // Remove os confetes restantes
    const confettiElements = this.containerEl.querySelectorAll('.confetti');
    confettiElements.forEach((confettiEl) => {
        clearTimeout(confettiEl.removeTimeout);
        confettiEl.parentNode.removeChild(confettiEl);
    });
};
window.confettiful = new Confettiful(document.querySelector('#confetti'));
window.confettiful.stopConfetti();
