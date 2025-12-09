// Script específico para a página index

document.addEventListener("DOMContentLoaded", function () {
  console.log("Página index carregada");

  // Exemplo: Adicionar interatividade ao botão
  const btnCarta = document.querySelector(".btn-carta");

  if (btnCarta) {
    btnCarta.addEventListener("click", function (e) {
      // Adicionar lógica de navegação ou animação aqui
      console.log("Botão de carta clicado");
    });
  }

  // Sistema de palavras flutuantes com brilho
  const palavras = ["aboba1", "aboba2", "aboba3", "aboba4"];
  const palavrasAtivas = [];
  
  // Ajustar número máximo de palavras baseado no tamanho da tela
  function getMaxPalavras() {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 768) return 3;
    return 4;
  }
  
  let maxPalavras = getMaxPalavras();

  function criarPalavra(texto) {
    const palavra = document.createElement("div");
    palavra.className = "floating-word";
    palavra.textContent = texto;
    document.body.appendChild(palavra);
    return palavra;
  }

  function calcularDistancia(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  function posicaoForaDoContainer(x, y) {
    // Verificar se a posição está fora do container centralizado
    const container = document.querySelector(".hero-container");
    if (!container) return true;

    const rect = container.getBoundingClientRect();
    // Ajustar margem baseado no tamanho da tela
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    const margin = isMobile ? 30 : isTablet ? 40 : 50; // Margem de segurança ao redor do container

    // Verificar se a posição está dentro do container + margem
    if (
      x >= rect.left - margin &&
      x <= rect.right + margin &&
      y >= rect.top - margin &&
      y <= rect.bottom + margin
    ) {
      return false; // Posição está dentro do container
    }
    return true; // Posição está fora do container
  }

  function posicaoValida(x, y, distanciaMinima) {
    // Verificar se está fora do container
    if (!posicaoForaDoContainer(x, y)) {
      return false;
    }

    // Verificar se a posição está longe o suficiente de todas as palavras ativas
    for (const palavraAtiva of palavrasAtivas) {
      const xAtiva = parseFloat(palavraAtiva.style.left) || 0;
      const yAtiva = parseFloat(palavraAtiva.style.top) || 0;
      const distancia = calcularDistancia(x, y, xAtiva, yAtiva);

      if (distancia < distanciaMinima) {
        return false;
      }
    }
    return true;
  }

  function posicionarPalavra(palavra) {
    // Calcular altura do header
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    // Posicionar apenas na metade superior (do início até metade da altura da viewport)
    const metadeAltura = window.innerHeight / 2;

    // Ajustar margens e distâncias baseado no tamanho da tela
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    
    const marginHorizontal = isMobile ? 20 : isTablet ? 35 : 50;
    const distanciaMinima = isMobile ? 120 : isTablet ? 160 : 200; // Distância mínima entre palavras (em pixels)
    const maxTentativas = 100; // Máximo de tentativas para encontrar uma posição válida

    // Posição Y aleatória entre o header e a metade da tela
    const minY = headerHeight + (isMobile ? 15 : 20);
    const maxY = metadeAltura - (isMobile ? 15 : 20);
    const maxX = window.innerWidth - marginHorizontal * 2;

    let randomX, randomY;
    let tentativas = 0;

    // Tentar encontrar uma posição que não esteja muito próxima de outras palavras
    do {
      randomY = Math.random() * (maxY - minY) + minY;
      randomX = marginHorizontal + Math.random() * maxX;
      tentativas++;
    } while (!posicaoValida(randomX, randomY, distanciaMinima) && tentativas < maxTentativas);

    // Se não encontrou posição válida após muitas tentativas, usar a última tentativa mesmo assim
    // Aplicar posições
    palavra.style.left = randomX + "px";
    palavra.style.top = randomY + "px";
  }

  function mostrarPalavra(texto) {
    const palavra = criarPalavra(texto);

    // Aguardar o elemento ser adicionado ao DOM
    setTimeout(() => {
      posicionarPalavra(palavra);

      // Pequeno delay para garantir renderização
      setTimeout(() => {
        palavra.classList.add("visible");
        palavrasAtivas.push(palavra);
      }, 50);
    }, 10);

    // Tempo aleatório entre 6 e 9 segundos para esconder
    const tempoVisivel = Math.random() * 3000 + 6000;

    setTimeout(() => {
      palavra.classList.remove("visible");

      setTimeout(() => {
        const index = palavrasAtivas.indexOf(palavra);
        if (index > -1) {
          palavrasAtivas.splice(index, 1);
        }
        palavra.remove();
      }, 2500); // Tempo de fade out
    }, tempoVisivel);
  }

  function iniciarAnimacaoPalavras() {
    // Função recursiva que mantém o loop contínuo e suave
    function cicloContinuo() {
      // Atualizar maxPalavras baseado no tamanho atual da tela
      maxPalavras = getMaxPalavras();
      
      // Sempre verificar e adicionar palavras gradualmente
      if (palavrasAtivas.length < maxPalavras) {
        const textoAleatorio =
          palavras[Math.floor(Math.random() * palavras.length)];
        mostrarPalavra(textoAleatorio);
      }

      // Continuar o ciclo com intervalo aleatório suave (2.5-4.5 segundos)
      // Isso garante um fluxo constante sem resets bruscos
      const proximoIntervalo = Math.random() * 2000 + 2500;
      setTimeout(cicloContinuo, proximoIntervalo);
    }

    // Iniciar o loop de forma suave e gradual
    // Primeira palavra após 1.5 segundos
    setTimeout(() => {
      cicloContinuo();
    }, 1500);
  }

  // Iniciar animação
  iniciarAnimacaoPalavras();

  // Ajustar palavras ao redimensionar a janela
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Atualizar maxPalavras e remover palavras extras se necessário
      const novoMax = getMaxPalavras();
      if (novoMax < palavrasAtivas.length) {
        // Remover palavras extras se o limite diminuiu
        const palavrasParaRemover = palavrasAtivas.length - novoMax;
        for (let i = 0; i < palavrasParaRemover; i++) {
          if (palavrasAtivas.length > 0) {
            const palavra = palavrasAtivas.shift();
            palavra.classList.remove("visible");
            setTimeout(() => palavra.remove(), 500);
          }
        }
      }
      maxPalavras = novoMax;
    }, 250);
  });
});
