// Endereço base da API pública jikan-edge.
// Ela não exige chave de API nem autenticação.
var API_BASE = "https://jikan.lucashdo.com/v1";

// Pegamos os elementos do HTML que serão usados no JavaScript.
var listaTop = document.getElementById("listaTop");
var listaBusca = document.getElementById("listaBusca");
var mensagemTop = document.getElementById("mensagemTop");
var mensagemBusca = document.getElementById("mensagemBusca");
var formBusca = document.getElementById("formBusca");
var campoBusca = document.getElementById("campoBusca");
var endpointBusca = document.getElementById("endpointBusca");
var botaoAtualizarTop = document.getElementById("botaoAtualizarTop");
var botaoAleatorio = document.getElementById("botaoAleatorio");
var modalDetalhes = document.getElementById("modalDetalhes");
var conteudoModal = document.getElementById("conteudoModal");
var fecharModal = document.getElementById("fecharModal");
var fecharModalFundo = document.getElementById("fecharModalFundo");

// Essa função pede para a API os animes mais bem avaliados.
async function carregarTopAnimes() {
    mensagemTop.className = "mensagem";
    mensagemTop.textContent = "Carregando animes da API...";
    listaTop.innerHTML = "";

    try {
        // No jikan-edge o parâmetro limit não é aceito neste endpoint.
        // Por isso buscamos a página e depois mostramos somente os 8 primeiros.
        var resposta = await fetch(API_BASE + "/top/anime?page=1");

        if (!resposta.ok) {
            throw new Error("A API respondeu com erro.");
        }

        var json = await resposta.json();
        var primeirosAnimes = json.data.slice(0, 8);

        mostrarAnimes(primeirosAnimes, listaTop);
        mensagemTop.textContent = "";
    } catch (erro) {
        mensagemTop.className = "mensagem erro";
        mensagemTop.textContent = "Não foi possível carregar o ranking agora. Tente novamente em alguns segundos.";
        console.error(erro);
    }
}

// Recebe uma lista de animes e cria os cards na tela.
function mostrarAnimes(animes, elementoDestino) {
    elementoDestino.innerHTML = "";

    for (var i = 0; i < animes.length; i++) {
        var anime = animes[i];

        var titulo = anime.titleEnglish || anime.title || "Título não informado";
        var imagem = anime.images && anime.images.large
            ? anime.images.large
            : anime.imageUrl;

        var nota = anime.score ? anime.score.toFixed(2) : "N/A";
        var episodios = anime.episodes ? anime.episodes : "?";
        var tipo = anime.type ? anime.type : "Anime";

        var card = document.createElement("article");
        card.className = "card-anime";

        card.innerHTML = `
            <img class="card-imagem" src="${imagem}" alt="Capa de ${escaparHtml(titulo)}">
            <div class="card-conteudo">
                <h3>${escaparHtml(titulo)}</h3>
                <div class="card-info">
                    <span class="nota">★ ${nota}</span>
                    <span>${escaparHtml(tipo)}</span>
                    <span>${episodios} ep.</span>
                </div>
                <button class="card-botao" onclick="abrirDetalhes(${anime.malId})">
                    Ver detalhes
                </button>
            </div>
        `;

        elementoDestino.appendChild(card);
    }
}

// Pesquisa um anime usando o texto digitado no campo de busca.
async function buscarAnime(nome) {
    var nomeLimpo = nome.trim();

    if (nomeLimpo === "") {
        mensagemBusca.className = "mensagem erro";
        mensagemBusca.textContent = "Digite algum nome antes de pesquisar.";
        return;
    }

    // O jikan-edge não aceita limit aqui. Buscamos normalmente e usamos os 8 primeiros resultados.
    var url = API_BASE + "/anime?q=" + encodeURIComponent(nomeLimpo);
    endpointBusca.textContent = url;

    mensagemBusca.className = "mensagem";
    mensagemBusca.textContent = "Buscando na API...";
    listaBusca.innerHTML = "";

    try {
        var resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro durante a pesquisa.");
        }

        var json = await resposta.json();

        if (json.data.length === 0) {
            mensagemBusca.textContent = "Nenhum anime encontrado com esse nome.";
            return;
        }

        var resultados = json.data.slice(0, 8);

        mostrarAnimes(resultados, listaBusca);
        mensagemBusca.textContent = resultados.length + " resultado(s) mostrado(s).";
    } catch (erro) {
        mensagemBusca.className = "mensagem erro";
        mensagemBusca.textContent = "A pesquisa falhou. Aguarde alguns segundos e tente novamente.";
        console.error(erro);
    }
}

// Abre um modal e faz outra requisição para buscar informações completas do anime.
async function abrirDetalhes(idAnime) {
    modalDetalhes.classList.remove("escondido");
    conteudoModal.innerHTML = '<p class="carregando-modal">Carregando detalhes pela API...</p>';

    try {
        var resposta = await fetch(API_BASE + "/anime/" + idAnime + "/full");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar detalhes.");
        }

        var json = await resposta.json();
        var anime = json.data;

        var titulo = anime.titleEnglish || anime.title || "Título não informado";
        var imagem = anime.images && anime.images.large
            ? anime.images.large
            : anime.imageUrl;
        var nota = anime.score ? anime.score.toFixed(2) : "N/A";
        var episodios = anime.episodes ? anime.episodes : "Não informado";
        var ano = anime.year ? anime.year : "Não informado";
        var status = anime.status ? anime.status : "Não informado";
        var sinopse = anime.synopsis ? anime.synopsis : "Sinopse não disponível.";
        var generos = "Não informado";

        if (anime.genres && anime.genres.length > 0) {
            var nomesGeneros = [];

            for (var i = 0; i < anime.genres.length; i++) {
                nomesGeneros.push(anime.genres[i].name);
            }

            generos = nomesGeneros.join(", ");
        }

        conteudoModal.innerHTML = `
            <div class="detalhes">
                <img src="${imagem}" alt="Capa de ${escaparHtml(titulo)}">
                <div>
                    <h2>${escaparHtml(titulo)}</h2>
                    <p class="detalhes-meta"><strong>Nota:</strong> ${nota}</p>
                    <p class="detalhes-meta"><strong>Episódios:</strong> ${episodios}</p>
                    <p class="detalhes-meta"><strong>Ano:</strong> ${ano}</p>
                    <p class="detalhes-meta"><strong>Status:</strong> ${escaparHtml(status)}</p>
                    <p class="detalhes-meta"><strong>Gêneros:</strong> ${escaparHtml(generos)}</p>
                    <p class="detalhes-sinopse">${escaparHtml(sinopse)}</p>
                    <a class="detalhes-link" href="${anime.url}" target="_blank" rel="noopener noreferrer">
                        Abrir página no MyAnimeList
                    </a>
                </div>
            </div>
        `;
    } catch (erro) {
        conteudoModal.innerHTML = '<p class="mensagem erro">Não foi possível carregar os detalhes.</p>';
        console.error(erro);
    }
}

// Pede um anime aleatório para a API e mostra seus detalhes.
async function carregarAnimeAleatorio() {
    botaoAleatorio.disabled = true;
    botaoAleatorio.textContent = "Sorteando...";

    try {
        var resposta = await fetch(API_BASE + "/random/anime");

        if (!resposta.ok) {
            throw new Error("Erro ao sortear anime.");
        }

        var json = await resposta.json();
        abrirDetalhes(json.data.malId);
    } catch (erro) {
        alert("Não foi possível buscar um anime aleatório agora.");
        console.error(erro);
    } finally {
        botaoAleatorio.disabled = false;
        botaoAleatorio.textContent = "Anime aleatório";
    }
}

// Impede que textos vindos da API sejam interpretados como HTML.
function escaparHtml(texto) {
    var div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Fecha o modal de detalhes.
function esconderModal() {
    modalDetalhes.classList.add("escondido");
}

// Eventos dos botões e formulário.
formBusca.addEventListener("submit", function(evento) {
    evento.preventDefault();
    buscarAnime(campoBusca.value);
});

botaoAtualizarTop.addEventListener("click", carregarTopAnimes);
botaoAleatorio.addEventListener("click", carregarAnimeAleatorio);
fecharModal.addEventListener("click", esconderModal);
fecharModalFundo.addEventListener("click", esconderModal);

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        esconderModal();
    }
});

// Quando a página abre, já carregamos o top de animes.
carregarTopAnimes();
