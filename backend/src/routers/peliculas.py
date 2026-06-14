from fastapi import APIRouter, HTTPException
from schemas.peli_schema import PeliculaSchema, PeliculaUpdateSchema, IdCorrecto, BoolActivo
from peliculas_database import peliculas

peliculas_routers = APIRouter()

NOT_FOUND = {
    404: {
        "description": "Response not found si no se encuentra el ID",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Película no encontrada",
                }
            }
        },
    },
}

@peliculas_routers.get("/", response_model=list[PeliculaSchema])    #--------------GET TODOS--------------
async def get_peliculas():
    return [pelicula for pelicula in peliculas if pelicula["activo"]]

@peliculas_routers.get("/hidden", response_model=list[PeliculaSchema])    #--------------GET BORRADOS LÓGICOS--------------
async def get_peliculas():
    return [pelicula for pelicula in peliculas if not pelicula["activo"]]

@peliculas_routers.get(                                            #---------------GET BY ID--------------
    "/{id}",
    responses=NOT_FOUND,
    response_model=PeliculaSchema,
)
async def get_pelicula_by_id(id: IdCorrecto):
    for pelicula in peliculas:
        if pelicula["id"] == id:
            return pelicula
    raise HTTPException(status_code=404, detail= "Película no encontrada")

@peliculas_routers.get("/generos")                                  #-------------- GET GENEROS----------------
async def get_genero():
    return sorted(
        {
            pelicula["genero"]
            for pelicula in peliculas
            if pelicula["activo"]
        }
    )

@peliculas_routers.post("/", response_model=list[PeliculaSchema])         #----------------------POST-------------
async def crear_pelicula(pelicula_nueva: PeliculaSchema):
    peliculas.append(pelicula_nueva.model_dump())
    return peliculas

@peliculas_routers.delete(                                                #-----------------------DELETE------------
    "/{id}",
    responses=NOT_FOUND,
    response_model=PeliculaSchema,
)
async def borrar_pelicula(
    id: IdCorrecto,
    borrado_logico: BoolActivo = True
):
    for pelicula in peliculas:
        if pelicula["id"] == id:
            if borrado_logico:
                pelicula["activo"] = False
            else:
                peliculas.remove(pelicula)
            return pelicula
    raise HTTPException(status_code=404, detail="Película no encontrada")

@peliculas_routers.put(                                                    #------------------PUT--------------
    "/{id}",
    responses=NOT_FOUND,
    response_model=PeliculaSchema
)
async def editar_pelicula(
    id: IdCorrecto,
    pelicula_editar: PeliculaUpdateSchema,
):
    for pelicula in peliculas:
        if pelicula["id"] == id:
            pelicula["nombre"] = pelicula_editar.nombre
            pelicula["precio"] = pelicula_editar.precio
            pelicula["activo"] = pelicula_editar.activo
            return pelicula
    raise HTTPException(status_code=404, detail="Película no encontrada")