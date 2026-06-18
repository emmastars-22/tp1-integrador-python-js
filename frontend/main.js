const API_URL = "http://127.0.0.1:8000/peliculas/";

const INICIO_BTN = document.getElementById("inicio-btn");
const FAVS_BTN = document.getElementById("favs-btn");

const SEARCH_SECTION = document.getElementById("search-section");
const SEARCH_INPUT = document.getElementById("search-input");
const SEARCH_BTN = document.getElementById("search-btn");

const DETALLE_SECTION = document.getElementById("detalle-section");
const DETALLE = document.getElementById("detalle");

const MY_FAVS_SECTION = document.getElementById("mis-favs-section");

const GALLERY = document.getElementById("gallery");

function crearCard(pelicula) {
  return `
        <article class="border rounded-lg shadow p-4 bg-black">
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
            class="bg-blue-600 text-white px-4 py-2 rounded"
            >
            Ver detalle
            </button>

            <button
                class="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Agregar a favoritos
            </button>
        </article>
    `;
}

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

async function verDetallePeli(id) {
  try {
    const respuesta = await fetch(`${API_URL}${id}`);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la película");
    }

    const pelicula = await respuesta.json();

    // Ocultar la galería y mostrar el detalle
    GALLERY.classList.add("hidden");
    DETALLE_SECTION.classList.remove("hidden");

    DETALLE.innerHTML = `
      <article class="max-w-3xl mx-auto border rounded-lg shadow p-6 bg-black">
        <h1 class="text-4xl font-bold mb-4">${pelicula.nombre}</h1>

        <p><strong>ID:</strong> ${pelicula.id}</p>
        <p><strong>Precio:</strong> $${pelicula.precio}</p>
        <p><strong>Descripción:</strong> ${pelicula.descripcion}</p>

        <button
          onclick="mostrarInicio()"
          class="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Volver
        </button>
      </article>
    `;
  } catch (error) {
    console.error(error);
  }
}

function mostrarInicio() {
  DETALLE_SECTION.classList.add("hidden");
  MY_FAVS_SECTION.classList.add("hidden");

  GALLERY.classList.remove("hidden");
  SEARCH_SECTION.classList.remove("hidden");

  obtenerPelis();
}

INICIO_BTN.addEventListener("click", mostrarInicio);

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
