/**
 * TP5 - Gestor de tareas de proyectos de software (API)
 *
 * Que hace: expone una API REST para crear, listar, editar, eliminar y
 * finalizar tareas. Los datos se guardan en Postgres (tabla "tasks").
 *
 * Con que se conecta:
 * - db.js: pool de conexiones a Postgres
 * - db/init.sql: define las columnas que se usan en las consultas de este archivo
 * - Frontend (React): consume estas rutas via fetch. Por eso se usa cors
 *
 * Rutas:
 *   GET    /tasks              listar (filtros opcionales ?estado= &prioridad= &sprint=)
 *   GET    /tasks/:id          ver una tarea
 *   POST   /tasks              crear
 *   PUT    /tasks/:id          editar
 *   PATCH  /tasks/:id/finish   finalizar (estado = Finalizada + fecha de cierre)
 *   DELETE /tasks/:id          eliminar
 */

import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Valores permitidos (se validan aca porque la tabla no tiene CHECK --> podria hacerlo directamente en la tabla de la base de datos. )
const TIPOS = ['Bug', 'Historia', 'Tarea', 'Épica']
const ESTADOS = ['Por hacer', 'En curso', 'En revisión', 'Finalizada']
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica']

// Convierte undefined y '' en null (los campos de fecha no aceptan texto vacio)
const vacioANull = (valor) => (valor === undefined || valor === '' ? null : valor)

// Devuelve un mensaje de error si algun valor no esta permitido, o null si todo esta bien
function validarValores({ tipo_actividad, estado, prioridad }) {
    if (tipo_actividad && !TIPOS.includes(tipo_actividad)) {
        return `tipo_actividad invalido. Valores permitidos: ${TIPOS.join(', ')}`
    }
    if (estado && !ESTADOS.includes(estado)) {
        return `estado invalido. Valores permitidos: ${ESTADOS.join(', ')}`
    }
    if (prioridad && !PRIORIDADES.includes(prioridad)) {
        return `prioridad invalida. Valores permitidos: ${PRIORIDADES.join(', ')}`
    }
    return null
}

// El id tiene que ser un numero entero (sino, Postgres da error)
const idValido = (id) => Number.isInteger(Number(id))

// GET /tasks - Listar todas las tareas (con filtros opcionales)
app.get('/tasks', async (req, res) => {
    try {
        const { estado, prioridad, sprint } = req.query
        const condiciones = []
        const valores = []

        if (estado) {
            valores.push(estado)
            condiciones.push(`estado = $${valores.length}`)
        }
        if (prioridad) {
            valores.push(prioridad)
            condiciones.push(`prioridad = $${valores.length}`)
        }
        if (sprint) {
            valores.push(sprint)
            condiciones.push(`sprint = $${valores.length}`)
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''
        const result = await pool.query(`SELECT * FROM tasks ${where} ORDER BY id`, valores)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /tasks/:id - Obtener una tarea por id
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!idValido(id)) {
            return res.status(400).json({ error: 'Id invalido' })
        }

        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /tasks - Crear una nueva tarea
app.post('/tasks', async (req, res) => {
    try {
        const {
            nombre_proyecto, tipo_actividad, estado, resumen, descripcion,
            prioridad, informador, persona_asignada, precondicion,
            fecha_creacion, fecha_cierre, sprint
        } = req.body

        // Campos obligatorios
        if (!nombre_proyecto || !tipo_actividad || !resumen || !informador) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios: nombre_proyecto, tipo_actividad, resumen, informador'
            })
        }

        const errorValores = validarValores({ tipo_actividad, estado, prioridad })
        if (errorValores) {
            return res.status(400).json({ error: errorValores })
        }

        const result = await pool.query(
            `INSERT INTO tasks (
                nombre_proyecto, tipo_actividad, estado, resumen, descripcion,
                prioridad, informador, persona_asignada, precondicion,
                fecha_creacion, fecha_cierre, sprint
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, CURRENT_DATE), $11, $12)
             RETURNING *`,
            [
                nombre_proyecto,
                tipo_actividad,
                estado || 'Por hacer',
                resumen,
                descripcion || '',
                prioridad || 'Media',
                informador,
                vacioANull(persona_asignada),
                precondicion || '',
                vacioANull(fecha_creacion),
                vacioANull(fecha_cierre),
                vacioANull(sprint)
            ]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /tasks/:id - Actualizar una tarea existente
// Con COALESCE: los campos que no vengan en el body se mantienen como estaban
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!idValido(id)) {
            return res.status(400).json({ error: 'Id invalido' })
        }

        const {
            nombre_proyecto, tipo_actividad, estado, resumen, descripcion,
            prioridad, informador, persona_asignada, precondicion,
            fecha_creacion, fecha_cierre, sprint
        } = req.body

        const errorValores = validarValores({ tipo_actividad, estado, prioridad })
        if (errorValores) {
            return res.status(400).json({ error: errorValores })
        }

        const result = await pool.query(
            `UPDATE tasks
             SET nombre_proyecto = COALESCE($1, nombre_proyecto),
                 tipo_actividad = COALESCE($2, tipo_actividad),
                 estado = COALESCE($3, estado),
                 resumen = COALESCE($4, resumen),
                 descripcion = COALESCE($5, descripcion),
                 prioridad = COALESCE($6, prioridad),
                 informador = COALESCE($7, informador),
                 persona_asignada = COALESCE($8, persona_asignada),
                 precondicion = COALESCE($9, precondicion),
                 fecha_creacion = COALESCE($10, fecha_creacion),
                 fecha_cierre = COALESCE($11, fecha_cierre),
                 sprint = COALESCE($12, sprint)
             WHERE id = $13
             RETURNING *`,
            [
                vacioANull(nombre_proyecto),
                vacioANull(tipo_actividad),
                vacioANull(estado),
                vacioANull(resumen),
                descripcion ?? null,
                vacioANull(prioridad),
                vacioANull(informador),
                vacioANull(persona_asignada),
                precondicion ?? null,
                vacioANull(fecha_creacion),
                vacioANull(fecha_cierre),
                vacioANull(sprint),
                id
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PATCH /tasks/:id/finish - Finalizar una tarea
// Pone el estado en "Finalizada" y la fecha de cierre en el dia de hoy
app.patch('/tasks/:id/finish', async (req, res) => {
    try {
        const { id } = req.params
        if (!idValido(id)) {
            return res.status(400).json({ error: 'Id invalido' })
        }

        const result = await pool.query(
            `UPDATE tasks
             SET estado = 'Finalizada',
                 fecha_cierre = CURRENT_DATE
             WHERE id = $1
             RETURNING *`,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE /tasks/:id - Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!idValido(id)) {
            return res.status(400).json({ error: 'Id invalido' })
        }

        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' })
        }

        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
    console.log(`📝 API endpoints available at /tasks`)
})