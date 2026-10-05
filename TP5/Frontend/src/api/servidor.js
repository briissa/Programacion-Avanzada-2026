// Funciones que se comunican con el backend (Node + Express + Postgres).
// Cada una corresponde a una ruta de la API.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Hace el fetch y, si la API responde con error, lanza un Error con su mensaje
async function pedir(ruta, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones)

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}))
    throw new Error(datos.error || 'Error al comunicarse con la API')
  }

  // DELETE responde 204 (sin contenido)
  if (respuesta.status === 204) {
    return null
  }

  return respuesta.json()
}

const conJson = (metodo, datos) => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
})

// GET /tasks
export const obtenerTareas = () => pedir('/tasks')

// POST /tasks
export const crearTarea = (tarea) => pedir('/tasks', conJson('POST', tarea))

// PUT /tasks/:id
export const editarTarea = (id, tarea) =>
  pedir(`/tasks/${id}`, conJson('PUT', tarea))

// PATCH /tasks/:id/finish
export const finalizarTarea = (id) =>
  pedir(`/tasks/${id}/finish`, { method: 'PATCH' })

// DELETE /tasks/:id
export const eliminarTarea = (id) => pedir(`/tasks/${id}`, { method: 'DELETE' })
