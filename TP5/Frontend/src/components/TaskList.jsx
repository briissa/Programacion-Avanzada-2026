const aFecha = (valor) => (valor ? valor.slice(0, 10) : '—')

function TaskList({ tareas, onEditar, onEliminar, onFinalizar }) {
  if (tareas.length === 0) {
    return <p>No hay tareas cargadas</p>
  }

  return (
    <ul className="tarea-lista">
      {tareas.map((tarea) => (
        <li key={tarea.id} className="tarea-item">
          <div className="tarea-encabezado">
            <strong>
              #{tarea.id} {tarea.resumen}
            </strong>
            <span className={`tarea-estado estado-${tarea.estado.replace(/\s/g, '-')}`}>
              {tarea.estado}
            </span>
          </div>

          <p className="tarea-detalle">
            {tarea.nombre_proyecto} · {tarea.tipo_actividad} · Prioridad {tarea.prioridad}
            {tarea.sprint && ` · ${tarea.sprint}`}
          </p>
          <p className="tarea-detalle">
            Informador: {tarea.informador} · Asignada a: {tarea.persona_asignada || 'sin asignar'}
          </p>
          <p className="tarea-detalle">
            Creada: {aFecha(tarea.fecha_creacion)} · Cierre: {aFecha(tarea.fecha_cierre)}
          </p>
          {tarea.descripcion && <p>{tarea.descripcion}</p>}
          {tarea.precondicion && (
            <p className="tarea-detalle">Precondición: {tarea.precondicion}</p>
          )}

          <div className="carrito-botones">
            <button className="Button_Agregar" type="button" onClick={() => onEditar(tarea)}>
              Editar
            </button>
            <button
              className="Button_Agregar"
              type="button"
              onClick={() => onFinalizar(tarea.id)}
              disabled={tarea.estado === 'Finalizada'}
            >
              Finalizar
            </button>
            <button
              className="Button_Eliminar"
              type="button"
              onClick={() => onEliminar(tarea.id)}
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
