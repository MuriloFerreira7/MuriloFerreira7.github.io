# AniBusca - Demonstração da API Jikan

Projeto simples para demonstrar o consumo da API pública Jikan v4 usando apenas:

- HTML
- CSS
- JavaScript puro
- `fetch()`

Não usa framework, banco de dados, backend, chave de API ou autenticação.

## O que o site faz

1. Carrega os animes mais bem avaliados.
2. Pesquisa anime por nome.
3. Sorteia um anime aleatório.
4. Abre detalhes de um anime em um modal.

## Endpoints usados

```text
GET https://api.jikan.moe/v4/top/anime?limit=8
GET https://api.jikan.moe/v4/anime?q=NOME&limit=8
GET https://api.jikan.moe/v4/random/anime
GET https://api.jikan.moe/v4/anime/{id}/full
```

Todos são apenas para leitura.

## Como executar

### Jeito mais simples

Abra o arquivo `index.html` no navegador.

### Se o navegador bloquear requisições abertas por arquivo local

Abra a pasta no VS Code e use a extensão **Live Server**.

Também é possível usar um servidor local simples com Python:

```bash
python -m http.server 5500
```

Depois abra:

```text
http://localhost:5500
```

## Como explicar na apresentação

O fluxo principal é este:

```text
Usuário clica/pesquisa
        ↓
JavaScript chama fetch(URL)
        ↓
Jikan responde dados em JSON
        ↓
JavaScript lê json.data
        ↓
O site cria os cards no HTML
```

### Parte mais importante do JavaScript

```javascript
var resposta = await fetch(url);
var json = await resposta.json();
mostrarAnimes(json.data, listaBusca);
```

Em palavras simples:

1. `fetch(url)` chama a API.
2. `resposta.json()` transforma a resposta em um objeto JavaScript.
3. `json.data` contém os animes.
4. `mostrarAnimes()` coloca esses dados na tela.

## Estrutura de pastas

```text
jikan-anime-demo/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Observação sobre a Jikan

A Jikan é uma API não oficial que fornece acesso a dados públicos relacionados ao MyAnimeList. O projeto usa somente requisições públicas de leitura e não possui login ou alteração de listas.
