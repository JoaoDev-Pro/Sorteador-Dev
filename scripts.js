// 1. Inicia o áudio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 2. Função universal de som 
function tocarSom(frequencia, tipo, duracao) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = tipo;
    oscillator.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duracao);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duracao);
}

// 3. Função para adicionar as Bolinhas ao Histórico com Animação
function adicionarAoHistorico(numero) {
    const lista = document.getElementById('lista-historico');
    if (!lista) return;

    const novoItem = document.createElement('li');
    novoItem.textContent = numero.toString().padStart(2, '0');
    
    // Efeito de entrada animado 
    novoItem.style.opacity = "0";
    novoItem.style.transform = "scale(0.5)";
    
    lista.prepend(novoItem);

    setTimeout(() => {
        novoItem.style.transition = "all 0.3s ease";
        novoItem.style.opacity = "1";
        novoItem.style.transform = "scale(1)";
    }, 10);

    // Mantém apenas os últimos 5 números no histórico 
    if (lista.children.length > 5) {
        lista.removeChild(lista.lastChild);
    }
}

// 4. Evento do Botão Sortear
document.getElementById('btn-sortear').addEventListener('click', function() {
    const minInput = document.getElementById('numero-minimo');
    const maxInput = document.getElementById('numero-maximo');
    const display = document.getElementById('numero-sorteado');

    const min = Math.ceil(parseInt(minInput.value));
    const max = Math.floor(parseInt(maxInput.value));

    // Validação do intervalo válido 
    if (isNaN(min) || isNaN(max) || min >= max) {
        alert("Por favor, insira um intervalo válido!");
        return;
    }

    let contador = 0;
    const totalGiros = 30;

    // Desativa o botão temporariamente para evitar cliques múltiplos do usuário 
    this.disabled = true;
    this.style.opacity = "0.7";

    const intervalo = setInterval(() => {
        const numAleatorioTemporario = Math.floor(Math.random() * (max - min + 1)) + min;
        display.textContent = numAleatorioTemporario.toString().padStart(2, '0');
        
        tocarSom(800, 'sine', 0.1);
        contador++;

        if (contador > totalGiros) {
            clearInterval(intervalo);
            
            const resultado = Math.floor(Math.random() * (max - min + 1)) + min;
            display.textContent = resultado.toString().padStart(2, '0');

            tocarSom(1200, 'square', 0.3);
            adicionarAoHistorico(resultado);

            // Reativa o botão Sortear 
            this.disabled = false;
            this.style.opacity = "1";
        }
    }, 60); 
});