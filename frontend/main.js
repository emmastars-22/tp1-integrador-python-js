const API_URL = "http://127.0.0.1:8000/peliculas/";

const INICIO_BTN = document.getElementById("inicio-btn");
const FAVS_BTN = document.getElementById("favs-btn");

const SEARCH_SECTION = document.getElementById("search-section");
const SEARCH_INPUT = document.getElementById("search-input");
const SEARCH_BTN = document.getElementById("search-btn");

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
                class="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
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