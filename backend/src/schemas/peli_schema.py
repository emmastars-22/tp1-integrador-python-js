from fastapi import Path
from typing import Annotated
from pydantic import BaseModel, Field

IdCorrecto = Annotated[int, Path(gt=0, description="ID de la película debe ser mayor que 0")]
StrCorto = Annotated[str, Field(min_length=2, max_length=50)]
Precio = Annotated[float, Field(gt=0, le=99999)]
BoolActivo = Annotated[bool, Field(description="¿Sigue disponible?")]

class PeliculaSchema(BaseModel):
    id: IdCorrecto
    nombre: StrCorto
    precio: Precio
    activo: BoolActivo = True

class PeliculaUpdateSchema(BaseModel):
    nombre: StrCorto
    precio: Precio
    activo: BoolActivo