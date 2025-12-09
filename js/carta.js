// Script específico para a página da carta

document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");
  const btnOpen = document.getElementById("btnOpen");
  const btnClose = document.getElementById("btnClose");
  const heartsContainer = document.getElementById("hearts-container");
  const musicToggle = document.getElementById("musicToggle");
  const backgroundMusic = document.getElementById("backgroundMusic");
  const nightModeToggle = document.getElementById("nightModeToggle");
  const body = document.body;

  let isOpen = false;
  let isMusicPlaying = false;
  let isNightMode = false;
  let particleInterval = null;

  // Criar um coração
  function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";
    
    // Posição aleatória dentro do envelope (centro do envelope)
    const envelopeRect = document.querySelector(".envelope-wrapper").getBoundingClientRect();
    const randomX = (Math.random() - 0.5) * 200; // -100 a 100px do centro
    const startY = envelopeRect.top + envelopeRect.height * 0.6;
    
    heart.style.left = `calc(50% + ${randomX}px)`;
    heart.style.top = `${startY - envelopeRect.top}px`;
    
    heartsContainer.appendChild(heart);
    
    // Ativar animação
    requestAnimationFrame(() => {
      heart.classList.add("active");
    });

    // Remover após animação
    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove();
      }
    }, 2000);
  }

  // Criar múltiplos corações
  function createHearts(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createHeart();
      }, i * 150); // Delay entre cada coração
    }
  }

  // Criar partículas brilhantes (corações subindo continuamente)
  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle-heart";
    const hearts = ["❤️", "💖", "💕", "💗", "💝", "💞", "💓"];
    particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Posição aleatória na largura da tela
    const randomX = Math.random() * window.innerWidth;
    particle.style.left = `${randomX}px`;
    particle.style.bottom = "0px";
    
    // Tamanho aleatório
    const size = Math.random() * 0.5 + 0.8; // 0.8rem a 1.3rem
    particle.style.fontSize = `${size}rem`;
    
    // Velocidade aleatória
    const duration = Math.random() * 2 + 3; // 3s a 5s
    particle.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(particle);
    
    // Remover após animação
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, duration * 1000 + 100);
  }

  // Iniciar partículas contínuas
  function startParticles() {
    if (particleInterval) return;
    
    // Criar primeira partícula imediatamente
    createParticle();
    
    // Criar novas partículas a cada 800ms
    particleInterval = setInterval(() => {
      createParticle();
    }, 800);
  }

  // Parar partículas
  function stopParticles() {
    if (particleInterval) {
      clearInterval(particleInterval);
      particleInterval = null;
    }
  }

  // Controle de música
  function toggleMusic() {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      musicToggle.classList.remove("playing");
      musicToggle.querySelector(".music-text").textContent = "Música";
      isMusicPlaying = false;
    } else {
      // Tentar tocar música (pode falhar se não houver arquivo)
      backgroundMusic.play().then(() => {
        musicToggle.classList.add("playing");
        musicToggle.querySelector(".music-text").textContent = "Tocando...";
        isMusicPlaying = true;
      }).catch(() => {
        alert("Adicione um arquivo de áudio na tag <audio> para usar a música de fundo!");
      });
    }
  }

  // Modo noite
  function toggleNightMode() {
    isNightMode = !isNightMode;
    
    if (isNightMode) {
      body.classList.add("night-mode");
      nightModeToggle.classList.add("active");
      nightModeToggle.querySelector(".moon-icon").textContent = "⭐";
    } else {
      body.classList.remove("night-mode");
      nightModeToggle.classList.remove("active");
      nightModeToggle.querySelector(".moon-icon").textContent = "🌙";
    }
  }

  // Abrir carta
  function openEnvelope() {
    if (isOpen) return;

    isOpen = true;
    envelope.classList.add("open");
    letter.classList.add("open");
    
    // Criar corações após um pequeno delay
    setTimeout(() => {
      createHearts(8);
    }, 400);

    // Iniciar partículas brilhantes contínuas
    startParticles();

    // Tentar iniciar música automaticamente
    if (!isMusicPlaying) {
      backgroundMusic.play().then(() => {
        musicToggle.classList.add("playing");
        musicToggle.querySelector(".music-text").textContent = "Tocando...";
        isMusicPlaying = true;
      }).catch(() => {
        // Silenciosamente falha se não houver música
      });
    }

    // Desabilitar botão abrir e habilitar fechar
    btnOpen.disabled = true;
    btnClose.disabled = false;
  }

  // Fechar carta
  function closeEnvelope() {
    if (!isOpen) return;

    isOpen = false;
    letter.classList.remove("open");
    
    // Parar partículas
    stopParticles();
    
    // Aguardar o papel voltar antes de fechar o envelope
    setTimeout(() => {
      envelope.classList.remove("open");
    }, 400);

    // Desabilitar botão fechar e habilitar abrir
    btnClose.disabled = true;
    btnOpen.disabled = false;
  }

  // Event listeners
  btnOpen.addEventListener("click", openEnvelope);
  btnClose.addEventListener("click", closeEnvelope);
  musicToggle.addEventListener("click", toggleMusic);
  nightModeToggle.addEventListener("click", toggleNightMode);

  // Inicialmente, o botão fechar está desabilitado
  btnClose.disabled = true;
});

