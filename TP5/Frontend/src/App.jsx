import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import {
  obtenerTareas,
  crearTarea,
  editarTarea,
  finalizarTarea,
  eliminarTarea,
} from './api/servidor'
import './App.css'
import './Tareas.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [tareaEditando, setTareaEditando] = useState(null)
  const [error, setError] = useState('')

  // Al abrir la pagina, se cargan las tareas desde la API
  useEffect(() => {
    obtenerTareas()
      .then(setTareas)
      .catch((err) => setError(err.message))
  }, [])

  // Crea o edita segun haya una tarea en edicion. Devuelve true si salio bien
  const guardarTarea = async (datos) => {
    try {
      if (tareaEditando) {
        const actualizada = await editarTarea(tareaEditando.id, datos)
        setTareas(tareas.map((t) => (t.id === actualizada.id ? actualizada : t)))
        setTareaEditando(null)
      } else {
        const nueva = await crearTarea(datos)
        setTareas([...tareas, nueva])
      }
      setError('')
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const finalizar = async (id) => {
    try {
      const finalizada = await finalizarTarea(id)
      setTareas(tareas.map((t) => (t.id === id ? finalizada : t)))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar la tarea?')) {
      return
    }
    try {
      await eliminarTarea(id)
      setTareas(tareas.filter((t) => t.id !== id))
      if (tareaEditando && tareaEditando.id === id) {
        setTareaEditando(null)
      }
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header />
      <main className="tareas">
        <h1>Gestor de Tareas</h1>

        {error && <p className="tarea-error">{error}</p>}

        {/* El key hace que el formulario se reinicie al pasar de crear a editar */}
        <TaskForm
          key={tareaEditando ? tareaEditando.id : 'nueva'}
          tareaEditando={tareaEditando}
          onGuardar={guardarTarea}
          onCancelar={() => setTareaEditando(null)}
        />

        <h2>Listado de Tareas</h2>
        <TaskList
          tareas={tareas}
          onEditar={setTareaEditando}
          onEliminar={eliminar}
          onFinalizar={finalizar}
        />
      </main>
      <Footer />
    </>
  )
}

export default App
