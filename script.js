/* eslint-disable no-use-before-define */
const formPesquisa = document.forms.buscaTema;
const botaoPesquisar = formPesquisa.pesquisar;
const noticias = {};

const receberNoticias = async (event) => {
  event.preventDefault();
  noticias.tema = formPesquisa.tema.value;
  const promise = await fetch(
    `https://newsapi.org/v2/everything?q=${noticias.tema}&language=pt&apiKey=f24b9606e4bd436b8836c3b134e1da67`
  );
  noticias.json = await promise.json();
  criarMenu();
  exibirNoticias();
};

botaoPesquisar.addEventListener("click", receberNoticias);

const criarMenu = () => {
  const menuContainer = document.createElement("div");
  const menuDiv = document.querySelector(".menu-div");
  menuDiv.innerHTML = "";
  menuContainer.classList.add("menu-container");
  noticias.quantidadePorPagina = +formPesquisa.quantidade.value;
  noticias.quantidadePaginas = Math.ceil(
    noticias.json.articles.length / noticias.quantidadePorPagina
  );
  for (let i = 1; i <= noticias.quantidadePaginas; i += 1) {
    const spanMenu = document.createElement("span");
    spanMenu.classList.add("btn", "btn-primary");
    spanMenu.dataset.menu = i;
    spanMenu.innerText = i;
    menuContainer.appendChild(spanMenu);
  }
  menuDiv.appendChild(menuContainer);
  const listaMenu = document.querySelectorAll("[data-menu]");
  listaMenu[0].classList.add("ativo");
  listaMenu.forEach((menu) => {
    menu.addEventListener("click", (event) => {
      listaMenu.forEach((botaoMenu) => botaoMenu.classList.remove("ativo"));
      event.target.classList.add("ativo");
      exibirNoticias();
    });
  });
};

const exibirNoticias = () => {
  const divNoticias = document.querySelector(".noticias");
  const paginaSelecionada = document.querySelector(".ativo");
  const paginaExibida = +paginaSelecionada.innerText;
  const selectResultados = formPesquisa.quantidade;
  selectResultados.addEventListener("change", () => {
    noticias.quantidadePorPagina = +selectResultados.value;
    criarMenu();
    exibirNoticias();
  });
  divNoticias.innerHTML = "";
  for (
    let i =
      noticias.quantidadePorPagina * paginaExibida -
      noticias.quantidadePorPagina;
    i <= noticias.quantidadePorPagina * paginaExibida - 1;
    i += 1
  ) {
    if (i + 1 <= noticias.json.articles.length) {
      if ((i + 1) % 2 === 1) {
        const row = document.createElement("div");
        const col1 = document.createElement("div");
        const col2 = document.createElement("div");
        row.classList.add("row", "hidden");
        col1.classList.add("col-6", "first");
        col2.classList.add("col-6", "second");
        row.appendChild(col1);
        row.appendChild(col2);
        document.body.appendChild(row);
      }
      const noticia = noticias.json.articles[i];
      const divNoticia = document.createElement("div");
      const cardBody = document.createElement("div");
      const tituloNoticia = document.createElement("h5");
      const urlNoticia = document.createElement("a");
      const autorNoticia = document.createElement("h6");
      const conteudoNoticia = document.createElement("p");
      const imgNoticia = document.createElement("img");
      divNoticia.classList.add("noticia", "card", "mt-2");
      cardBody.classList.add("card-body");
      tituloNoticia.classList.add("titulo", "card-title");
      urlNoticia.setAttribute("href", noticia.url);
      autorNoticia.classList.add("autor", "card-subtitle");
      conteudoNoticia.classList.add("conteudo", "card-text");
      imgNoticia.classList.add("card-img-top");
      imgNoticia.setAttribute("src", noticia.urlToImage);
      urlNoticia.innerText = `${noticia.title}`;
      tituloNoticia.appendChild(urlNoticia);
      autorNoticia.innerText = noticia.author;
      conteudoNoticia.innerText = noticia.description;
      cardBody.appendChild(tituloNoticia);
      cardBody.appendChild(autorNoticia);
      cardBody.appendChild(conteudoNoticia);
      divNoticia.appendChild(imgNoticia);
      divNoticia.appendChild(cardBody);
      if ((i + 1) % 2 === 1) {
        const colunaEsquerda = document.querySelector(".first");
        colunaEsquerda.appendChild(divNoticia);
        colunaEsquerda.classList.remove("first");
        if (i + 1 === noticias.json.articles.length) {
          const row = document.querySelector(".row.hidden");
          row.querySelector(".second").remove();
          divNoticias.appendChild(row);
          row.classList.remove("hidden");
        }
      } else {
        const colunaDireita = document.querySelector(".second");
        const row = document.querySelector(".row.hidden");
        colunaDireita.appendChild(divNoticia);
        colunaDireita.classList.remove("second");
        row.classList.remove("hidden");
        divNoticias.appendChild(row);
      }
    }
  }
};
