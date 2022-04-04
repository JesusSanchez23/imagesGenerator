const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", () => {
  formulario.addEventListener("submit", validarFormulario);
});

function validarFormulario(e) {
  e.preventDefault();
  const termino = document.querySelector("#termino").value;

  if (termino === "") {
    imprimirAlerta("Sin termino de busqueda");
    return;
  }

  consultarAPI();
}

function imprimirAlerta(mensaje) {
  const error = document.querySelector(".error");
  const mensajeAlerta = document.createElement("p");
  mensajeAlerta.classList.add(
    "bg-red-100",
    "border-red-400",
    "text-red-700",
    "px-4",
    "py-3",
    "rounded",
    "max-w-lg",
    "mx-auto",
    "mt-6",
    "text-center",
    "error"
  );

  if (!error) {
    mensajeAlerta.textContent = mensaje;

    formulario.appendChild(mensajeAlerta);
  }

  setTimeout(() => {
    mensajeAlerta.remove();
  }, 2000);
}

function consultarAPI() {
  const termino = document.querySelector("#termino").value;

  const key = "26036066-faaab5ea9fc0466576286c6dd";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&image_type=photo&per_page=${registrosPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((resultado) => resultado.json())
    .then((data) => {
      // console.log(data);
      totalPaginas = calcularPaginas(data.totalHits);
      // console.log(totalPaginas);

      mostrarImagenes(data.hits);
    });
}

// generador que va aregistrarla cantidad de elementos segun las paginas

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  //iterar sobre el arreglo de imagene sy construir el HTML

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
    <div class="bg-white">
    <img class="w-full" src="${previewURL}">
    <div class="p-4">
    <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
    <p class="font-bold">${views} <span class="font-light">veces Vista</span></p>
    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>

    </div>
    </div>
    </div>
    `;
  });

  // limpiar el paginador previo
  while (paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild);
  }
  // generarel HTML
  imprimirPaginador();
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    // genera un boton por cada elemento en el generador
    const btn = document.createElement("a");
    btn.href = "#";
    btn.dataset.pagina = value;
    btn.textContent = value;
    btn.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-3",
      "rounded"
    );

    btn.onclick = () => {
      paginaActual = value;
      consultarAPI();
    };
    paginacion.appendChild(btn);
  }
}
