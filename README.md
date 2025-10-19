# Proyecto Prueba Técnica

Este proyecto es una prueba técnica fullstack que incluye un **backend** con Node.js y una **interfaz frontend** con React y Next.js. Permite administrar películas (crear, listar, editar y eliminar) mediante una API REST y un frontend sencillo.

## Tecnologías utilizadas
- **Backend:** Node.js, Express, TypeORM, MySQL  
- **Frontend:** React, Next.js (CSR)  
- **Herramientas:** Turbo (para correr front y back juntos), npm  

---

## Requisitos

- Node.js instalado  
- MySQL funcionando localmente

---

## Instalación y ejecución

1. Descargar comprimido del repositorio (o clonarlo):

2. En la carpeta backend, crear un archivo .env como en el ejemplo(.env.example) con las variables de entorno de su computadora.

3. Desde la carpeta raiz del proyecto "./proyecto_prueba_tecnica-main/" debe ejecutar el siguiente comando en una consola para **instalar las dependencias** del proyecto:
    npm install

4. Crear una base de datos (MySQL en este caso) e importar el archivo "peliculas_db.sql" para utilizar la estructura de tabla correspondiente para este backend.

5. Ejecutar el próximo comando para **levantar el sistema completo**, tanto frontend como backend.
    npx turbo run dev

**_(Esto levanta frontend en http://localhost:3000 y backend en http://localhost:3001.)_**

## Estructura del proyecto
/backend     -> API REST con Node.js, Express y TypeORM
/frontend    -> Frontend con Next.js
/.env       -> Variables de entorno (configuración local)

## Comandos útiles

- Para correr frontend solamente:
    cd frontend
    npm install
    npm run dev

- Para correr backend solamente:
    cd backend
    npm install
    npm run dev

## Funcionalidad detallada
- Crear, listar, editar y eliminar(física o logicamente) películas desde el frontend. La creación puede realizarse a partir de un formulario o de un archivo .csv teniendo ';' como separador predeterminado de campos y saltos de linea como separador de registros.
- API REST para manipulación de datos con todos los endpoints necesarios para este proyecto, incluyendo algunos extras por las dudas, como la búsqueda por estado o la baja lógica.
- Comunicación frontend-backend integrada usando Turbo.
- Frontend diseñado con NextJS, con un buen diseño, interfaz amigable e importantes ayudas visuales para cada acción(según mi criterio).
- Buscador y editor de registros son dinámicos, permitiendo ahorrar tiempo en dichas tareas.

## Pequeño feedback del autor/programador
  A pesar de haber conocido JavaScript y haberlo usado algunas veces en la secundaria, este proyecto fue completamente distinto a cualquier experiencia previa. Nunca antes había trabajado con React, Next.js ni Node.js, y sin duda representó un gran desafío que me mantuvo ocupado, motivado y, sobre todo, me confirmó que realmente quiero dedicarme a la programación.

  Aprender todos estos temas en una sola semana no es sencillo, sino más bien algo irreal. Admito que recurrí bastante a la inteligencia artificial —más de lo habitual—, pero eso no significa que no haya dedicado tiempo a leer, interpretar y comprender el código con las explicaciones que obtenía, además de apoyarme en tutoriales de YouTube y otras fuentes de aprendizaje.

  Espero que este proyecto cumpla al menos con las expectativas mínimas del trabajo solicitado, y agradecería mucho recibir una devolución o feedback para saber en qué aspectos puedo mejorar, qué cosas continuar implementando y cuáles sería mejor evitar.

  Nuevamente, muchas gracias por la oportunidad y la motivación.
  Estaré atento a su respuesta.
  Saludos cordiales.