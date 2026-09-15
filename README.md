# AniBusca - Demonstração da API jikan-edge

Projeto simples para demonstrar o consumo de uma API REST pública de animes usando apenas:

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

## API usada

O projeto usa a instância pública do **jikan-edge**:

```text
https://jikan.lucashdo.com/v1
```

Ela fornece dados públicos relacionados ao MyAnimeList, não exige chave e permite chamadas diretamente do navegador.

## Endpoints usados

```text
GET https://jikan.lucashdo.com/v1/top/anime?page=1
GET https://jikan.lucashdo.com/v1/anime?q=NOME
GET https://jikan.lucashdo.com/v1/random/anime
GET https://jikan.lucashdo.com/v1/anime/{id}/full
```

Todos são apenas para leitura.

## Uma diferença importante

O jikan-edge não aceita o parâmetro `limit` nesses endpoints. Por isso o site recebe a lista da API e usa JavaScript para mostrar apenas os 8 primeiros itens:

```javascript
var primeirosAnimes = json.data.slice(0, 8);
```

Os nomes de alguns campos também são diferentes. Exemplos:

```text
Jikan v4                    jikan-edge
mal_id                      malId
images.jpg.image_url        images.medium / images.large
title_english               titleEnglish
```

## Como executar

### Hospedado

O projeto pode ser publicado diretamente no GitHub Pages porque é um site estático e a API permite chamadas feitas pelo navegador.

### Localmente

Você pode abrir o `index.html` diretamente. Se preferir usar um servidor local, abra a pasta no VS Code com a extensão **Live Server**.

Também é possível usar Python:

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
jikan-edge responde dados em JSON
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
├── ROTEIRO_APRESENTACAO.txt
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Observação

O jikan-edge é um projeto independente que obtém dados públicos do MyAnimeList. O site usa somente requisições públicas de leitura e não possui login nem altera listas de usuários.
