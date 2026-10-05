import { useState } from 'react'

const TIPOS = ['Bug', 'Historia', 'Tarea', 'Épica']
const ESTADOS = ['Por hacer', 'En curso', 'En revisión', 'Finalizada']
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica']

// Fecha de hoy en formato AAAA-MM-DD (el que usan los input type="date")
const hoy = () => new Date().toLocaleDateString('en-CA')

const formVacio = () => ({
  nombre_proyecto: '',
  tipo_actividad: 'Tarea',
  estado: 'Por hacer',
  resumen: '',
  descripcion: '',
  prioridad: 'Media',
  informador: '',
  persona_asignada: '',
  precondicion: '',
  fecha_creacion: hoy(),
  fecha_cierre: '',
  sprint: '',
})

// La base devuelve null en los campos vacios y las fechas con hora: se normalizan
const aTexto = (valor) => valor ?? ''
const aFecha = (valor) => (valor ? valor.slice(0, 10) : '')

const desdeTarea = (tarea) => ({
  nombre_proyecto: tarea.nombre_proyecto,
  tipo_actividad: tarea.tipo_actividad,
  estado: tarea.estado,
  resumen: tarea.resumen,
  descripcion: aTexto(tarea.descripcion),
  prioridad: tarea.prioridad,
  informador: tarea.informador,
  persona_asignada: aTexto(tarea.persona_asignada),
  precondicion: aTexto(tarea.precondicion),
  fecha_creacion: aFecha(tarea.fecha_creacion),
  fecha_cierre: aFecha(tarea.fecha_cierre),
  sprint: aTexto(tarea.sprint),
})

function Campo({ etiqueta, children }) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      {children}
    </label>
  )
}

const opciones = (lista) =>
  lista.map((opcion) => (
    <option key={opcion} value={opcion}>
      {opcion}
    </option>
  ))

// Sirve para crear (tareaEditando = null) y para editar (tareaEditando = tarea)
function TaskForm({ tareaEditando, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    tareaEditando ? desdeTarea(tareaEditando) : formVacio(),
  )

  const cambiar = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const enviar = async (event) => {
    event.preventDefault()
    const guardada = await onGuardar(form)
    // Si se creo una tarea nueva, se limpia el formulario
    if (guardada && !tareaEditando) {
      setForm(formVacio())
    }
  }

  return (
    <form className="tarea-form" onSubmit={enviar}>
      <h2>{tareaEditando ? `Editar tarea #${tareaEditando.id}` : 'Nueva tarea'}</h2>

      <div className="tarea-form-grilla">
        <Campo etiqueta="Nombre del proyecto *">
          <input name="nombre_proyecto" value={form.nombre_proyecto} onChange={cambiar} required />
        </Campo>

        <Campo etiqueta="Tipo de actividad *">
          <select name="tipo_actividad" value={form.tipo_actividad} onChange={cambiar}>
            {opciones(TIPOS)}
          </select>
        </Campo>

        <Campo etiqueta="Estado">
          <select name="estado" value={form.estado} onChange={cambiar}>
            {opciones(ESTADOS)}
          </select>
        </Campo>

        <Campo etiqueta="Prioridad">
          <select name="prioridad" value={form.prioridad} onChange={cambiar}>
            {opciones(PRIORIDADES)}
          </select>
        </Campo>

        <Campo etiqueta="Informador *">
          <input name="informador" value={form.informador} onChange={cambiar} required />
        </Campo>

        <Campo etiqueta="Persona asignada">
          <input name="persona_asignada" value={form.persona_asignada} onChange={cambiar} />
        </Campo>

        <Campo etiqueta="Sprint">
          <input name="sprint" placeholder="Ej: Sprint 3" value={form.sprint} onChange={cambiar} />
        </Campo>

        <Campo etiqueta="Fecha de creación">
          <input type="date" name="fecha_creacion" value={form.fecha_creacion} onChange={cambiar} />
        </Campo>

        <Campo etiqueta="Fecha de cierre">
          <input type="date" name="fecha_cierre" value={form.fecha_cierre} onChange={cambiar} />
        </Campo>
      </div>

      <Campo etiqueta="Resumen *">
        <input name="resumen" value={form.resumen} onChange={cambiar} required />
      </Campo>

      <Campo etiqueta="Descripción">
        <textarea name="descripcion" rows="3" value={form.descripcion} onChange={cambiar} />
      </Campo>

      <Campo etiqueta="Precondición">
        <textarea name="precondicion" rows="2" value={form.precondicion} onChange={cambiar} />
      </Campo>

      <div className="carrito-botones">
        <button className="Button_Agregar" type="submit">
          {tareaEditando ? 'Guardar cambios' : 'Crear tarea'}
        </button>
        {tareaEditando && (
          <button className="Button_Vaciar" type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
