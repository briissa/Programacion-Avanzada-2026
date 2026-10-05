-- Se ejecuta automaticamente UNA SOLA VEZ, cuando Postgres crea el volumen por primera vez
-- (carpeta especial docker-entrypoint-initdb.d). Si ya existe el volumen, este script
-- no se vuelve a correr aunque reinicies los contenedores.


/*
Creamos la tabla con los 12 campos:  
*/
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    tipo_actividad VARCHAR(30) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Por hacer',
    resumen VARCHAR(255) NOT NULL,
    descripcion TEXT DEFAULT '',
    prioridad VARCHAR(20) NOT NULL DEFAULT 'Media',
    informador VARCHAR(100) NOT NULL,
    persona_asignada VARCHAR(100),
    precondicion TEXT DEFAULT '',
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_cierre DATE,
    sprint VARCHAR(50)
);

-- Datos de ejemplo, para que al levantar el contenedor por primera vez ya haya tareas cargadas.

INSERT INTO tasks (nombre_proyecto, tipo_actividad, estado, resumen, descripcion,
                   prioridad, informador, persona_asignada, precondicion, sprint)
VALUES
    ('Sistema de Biblioteca', 'Bug', 'En curso',
     'El buscador no encuentra libros con tildes',
     'Al buscar "Garcia" no aparecen resultados de "García".',
     'Alta', 'Laura Pérez', 'Juan Gómez', 'Tener libros cargados en el catálogo', 'Sprint 3'),
    ('Sistema de Biblioteca', 'Historia', 'Por hacer',
     'Permitir reservar libros desde la web',
     'El socio puede reservar un libro prestado y recibir un aviso al devolverse.',
     'Media', 'Laura Pérez', 'Ana Torres', 'Usuario logueado', 'Sprint 4');
-- Explicacion --

/*
Qué hace: define la estructura de la base de datos. 
Crea la tabla tasks, que es donde se guardan las tareas, y le carga dos filas de ejemplo.

Cómo lo hace: Postgres ejecuta automáticamente cualquier .sql que encuentre en la carpeta especial docker-entrypoint-initdb.d.
Se hace una sola vez, cuando el volumen de datos se crea desde cero. Si el volumen ya existe, el script no se vuelve a correr.
*/