const API_URL = "http://127.0.0.1:8000/peliculas/";

const INICIO_BTN = document.getElementById("inicio-btn");
const FAVS_BTN = document.getElementById("favs-btn");
const AGREGAR_PELI_BTN = document.getElementById("agregar-peli-btn");

const SEARCH_SECTION = document.getElementById("search-section");
const SEARCH_INPUT = document.getElementById("search-input");
const SEARCH_BTN = document.getElementById("search-btn");
const FORM_SECTION = document.getElementById("form-section");

const DETALLE_SECTION = document.getElementById("detalle-section");
const DETALLE = document.getElementById("detalle");

const MY_FAVS_SECTION = document.getElementById("mis-favs-section");

const GALLERY = document.getElementById("gallery");

// ====================
// FUNCIONES AUXILIARES
// ====================

function ocultarTodo() {
  GALLERY.classList.add("hidden");
  DETALLE_SECTION.classList.add("hidden");
  FORM_SECTION.classList.add("hidden");
  MY_FAVS_SECTION.classList.add("hidden");
  SEARCH_SECTION.classList.add("hidden");
}

function mostrarFavs() {
  DETALLE_SECTION.classList.add("hidden");
  GALLERY.classList.add("hidden");

  MY_FAVS_SECTION.classList.remove("hidden");

  obtenerFavs();
}

function mostrarAgregarPeli() {
  DETALLE_SECTION.classList.add("hidden");
  GALLERY.classList.add("hidden");

  MY_FAVS_SECTION.classList.remove("hidden");

  crearPeli();
}

function mostrarInicio() {
  DETALLE_SECTION.classList.add("hidden");
  MY_FAVS_SECTION.classList.add("hidden");

  GALLERY.classList.remove("hidden");
  SEARCH_SECTION.classList.remove("hidden");
  FORM_SECTION.classList.add("hidden");

  obtenerPelis();
}

// ====================
// RENDER
// ====================

function crearCard(pelicula) {
  return `
  <article 
          class="relative border border-red-900 rounded-lg shadow p-4 bg-black overflow-hidden bg-cover bg-center"
          style="background-image:url('${pelicula.imagen}')"
        >
            <div class="absolute inset-0 bg-black/70"></div>

            <div class="relative z-10">
                <h2 class="text-xl font-bold mb-2">
                    ${pelicula.nombre}
                </h2>

                <p>
                    <strong>ID:</strong> ${pelicula.id}
                </p>

                <p class="mt-2">
                    <strong>Precio:</strong> $${pelicula.precio}
                </p>

                <button
                onclick="verDetallePeli(${pelicula.id})"
                class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500 transition-colors duration-300"
                >
                Ver detalle
                </button>

                <button
                    class="mt-4 bg-[#A6000E] text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                >
                    Agregar a favoritos
                </button>
            </div>
        </article>
    `;
}

function mostrarFormularioCrear() {
  ocultarTodo();

  FORM_SECTION.classList.remove("hidden");

  FORM_SECTION.innerHTML = `

<form
    id="form-crear"
    class="max-w-md mx-auto bg-black border border-red-900 rounded-lg shadow-lg p-6 flex flex-col gap-4"
>
    <h2 class="text-2xl font-bold text-white text-center mb-2">
        Nueva película
    </h2>

    <input
        id="id"
        type="text"
        placeholder="ID"
        class="bg-zinc-900 border border-red-900 text-white p-3 rounded focus:outline-none focus:border-orange-500 transition-colors"
    >

    <input
        id="nombre"
        type="text"
        placeholder="Nombre"
        class="bg-zinc-900 border border-red-900 text-white p-3 rounded focus:outline-none focus:border-orange-500 transition-colors"
    >

    <input
        id="precio"
        type="number"
        placeholder="Precio"
        class="bg-zinc-900 border border-red-900 text-white p-3 rounded focus:outline-none focus:border-orange-500 transition-colors"
    >

    <label
        for="activo"
        class="text-white">
        Activo
    </label>
      <input
          type="checkbox"
          id="activo"
          checked
          class="w-5 h-5"
      >
    <button
        type="submit"
        class="bg-orange-600 text-white font-semibold py-3 rounded hover:bg-orange-500 transition-colors duration-300"
    >
        Guardar película
    </button>
</form>    `;

  document
    .getElementById("form-crear")
    .addEventListener("submit", manejarCrearPeli);
}

async function mostrarFormularioModificar(id) {
  ocultarTodo();
  const pelicula = await obtenerPeliPorId(id);

  FORM_SECTION.classList.remove("hidden");

  FORM_SECTION.innerHTML = `

<form
    id="form-modificar"
    class="max-w-md mx-auto bg-black border border-red-900 rounded-lg shadow-lg p-6 flex flex-col gap-4 "
>
    <h2 class="text-2xl font-bold text-white text-center mb-2">
        Modificar película
    </h2>

    <input
        id="nombre"
        type="text"
        placeholder="Nombre"
        class="bg-zinc-900 border border-red-900 text-white p-3 rounded focus:outline-none focus:border-orange-500 transition-colors"
        value="${pelicula.nombre}"
    >

    <input
        id="precio"
        type="number"
        placeholder="Precio"
        class="bg-zinc-900 border border-red-900 text-white p-3 rounded focus:outline-none focus:border-orange-500 transition-colors"
        value="${pelicula.precio}"
    >

    <label
        for="activo"
        class="text-white">
        Activo
    </label>
      <input
          type="checkbox"
          id="activo"
          class="w-5 h-5"
          ${pelicula.activo ? "checked" : ""}
      >
    <button
        type="submit"
        class="bg-orange-600 text-white font-semibold py-3 rounded hover:bg-orange-500 transition-colors duration-300"
    >
        Modificar película
    </button>
</form>    `;

  document
    .getElementById("form-modificar")
    .addEventListener("submit", (e) => manejarEditarPeli(e, id));
}
// ====================
// API
// ====================

async function obtenerPelis() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las películas");
    }

    const peliculas = await respuesta.json();

    GALLERY.innerHTML = "";

    peliculas.forEach((pelicula) => {
      GALLERY.innerHTML += crearCard(pelicula);
    });
  } catch (error) {
    console.error("Error al obtener películas:", error);
  }
}
obtenerPelis();

async function obtenerPeliPorId(id) {
  try {
    const respuesta = await fetch(`${API_URL}${id}`);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la película");
    }

    const pelicula = await respuesta.json();

    return pelicula;
  } catch (error) {
    console.error("Error al obtener película:", error);
    return null;
  }
}

async function verDetallePeli(id) {
  try {
    const pelicula = await obtenerPeliPorId(id);

    // Ocultar la galería y mostrar el detalle
    GALLERY.classList.add("hidden");
    DETALLE_SECTION.classList.remove("hidden");

    DETALLE.innerHTML = `
      <article class="max-w-3xl mx-auto border rounded-lg shadow p-6 bg-black">
        <h1 class="text-4xl font-bold mb-4">${pelicula.nombre}</h1>

        <p><strong>ID:</strong> ${pelicula.id}</p>
        <p><strong>Precio:</strong> $${pelicula.precio}</p>
        <p><strong>Activo:</strong> ${pelicula.activo}</p>

        <button
          onclick="mostrarInicio()"
          class="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Volver
        </button>

        <button
          onclick="mostrarFormularioModificar(${pelicula.id})"
          class="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Modificar Peli
        </button>

        <button
          onclick="borrarPeli(${pelicula.id})"
          class="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Borrar Peli
        </button>


      </article>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function crearPeli(nuevaPeli) {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPeli),
    });

    const datos = await respuesta.json();
    console.log("respuesta POST: ", datos);

    obtenerPelis();
  } catch (error) {
    console.error("Error al obtener películas:", error);
  }
}

async function borrarPeli(id) {
  try {
    const respuesta = await fetch(`${API_URL}${id}`, {
      method: "DELETE",
    });

    const pelicula = await respuesta.json();
    console.log("respuesta DELETE: ", pelicula);

    alert(`Película ${id} borrada con éxito`);
    mostrarInicio();
  } catch (error) {
    console.error("Error al obtener películas:", error);
  }
}

async function modificarPeli(peliModificada, id) {
  try {
    const respuesta = await fetch(`${API_URL}${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peliModificada),
    });

    const datos = await respuesta.json();
    console.log("respuesta PUT: ", datos);

    mostrarInicio();
  } catch (error) {
    console.error("Error al editar película: ", error);
  }
}

// ====================
// FORMULARIOS
// ====================

async function manejarCrearPeli(e) {
  e.preventDefault();

  const nuevaPeli = {
    id: document.getElementById("id").value,

    nombre: document.getElementById("nombre").value,

    precio: document.getElementById("precio").value,

    activo: document.getElementById("activo").checked,
  };

  await crearPeli(nuevaPeli);

  mostrarInicio();
}

async function manejarEditarPeli(e, id) {
  e.preventDefault();

  const peliModificada = {
    nombre: document.getElementById("nombre").value,

    precio: document.getElementById("precio").value,

    activo: document.getElementById("activo").checked,
  };

  await modificarPeli(peliModificada, id);

  mostrarInicio();
}

// ====================
// EVENTOS
// ====================

FAVS_BTN.addEventListener("click", mostrarFavs);
AGREGAR_PELI_BTN.addEventListener("click", mostrarFormularioCrear);
INICIO_BTN.addEventListener("click", mostrarInicio);
