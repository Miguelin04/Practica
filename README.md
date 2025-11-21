# PokéAPI Explorer ⚡

Esta es una aplicación web moderna construida con React y TypeScript que interactúa con la [PokéAPI](https://pokeapi.co/). El propósito principal de este proyecto es demostrar conceptos fundamentales de desarrollo web como el consumo de APIs RESTful, manejo de estado asíncrono y diferencias entre protocolos web.

## 🚀 Características

1. **Explorador de Pokémon**: Muestra una lista inicial de 20 Pokémon con sus imágenes y tipos.
2. **Búsqueda Inteligente**: Permite buscar Pokémon específicos por nombre o ID numérico.
3. **Visor Dual de Datos**:
   - **Modo Tarjeta**: Una interfaz gráfica amigable para usuarios finales.
   - **Modo JSON**: Una vista de desarrollador que muestra la respuesta cruda del servidor.
4. **Educativo**: Incluye explicaciones integradas sobre el funcionamiento técnico.

## 🛠 Tecnologías

- React
- TypeScript
- Tailwind CSS (clases en los componentes)
- Vite (build/dev)
- Lucide React (iconos)

---

## 📦 Cómo ejecutar esta aplicación (Windows — PowerShell)

A continuación están los pasos mínimos para ejecutar y probar la aplicación localmente en Windows PowerShell.

### Requisitos

- Node.js (recomendado v16+). Verifica con `node -v`.
- Conexión a Internet (la app consulta la PokéAPI en tiempo real).

### 1) Instalar dependencias
Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install
```

### 2) Levantar el servidor de desarrollo
Usa el script definido en `package.json`:

```powershell
npm run dev
```

Si recibes un error como `"vite" no se reconoce como un comando`, ejecuta directamente con `npx`:

```powershell
npx vite
```

Después de arrancar, abre el navegador en la URL que muestra Vite (por ejemplo `http://localhost:5173`).

### 3) Construir para producción (opcional)
Generar la carpeta `dist`:

```powershell
npm run build
```

Para servir localmente el contenido de `dist` puedes usar un servidor estático:

```powershell
# con http-server
npx http-server ./dist -p 5000
# o con serve
npx serve ./dist
```

### 4) Probar la app y revisar la consola (DevTools)

- Abrir DevTools en el navegador: `F12` o `Ctrl+Shift+I`.
- Revisar la pestaña `Console` para errores/avisos de JavaScript.
- Revisar la pestaña `Network` para las peticiones a `https://pokeapi.co/`:
  - Filtra por `fetch` o por `pokeapi.co`.
  - Comprueba códigos 200/404 y la respuesta JSON.

Pruebas rápidas:

- Al abrir la app debería cargarse una lista inicial de ~20 Pokémon.
- Buscar por nombre (ej. `pikachu`) o por ID (ej. `25`) desde el input.
- Cambiar a la vista `JSON` para ver la respuesta cruda.

### 5) Solución de problemas comunes

- `vite no se reconoce`: asegúrate de haber ejecutado `npm install`. Si el problema persiste usa `npx vite`.
- Errores de CORS en la consola: esos provienen del navegador bloqueando respuestas; confirma que la URL de la API use `https` y que la petición no incluya cabeceras extra que desencadenen CORS.
- `node -v` muestra una versión muy antigua: actualiza Node.js a v16+.
- Si `npm run dev` falla con módulos faltantes: elimina `node_modules` y reinstala con `npm ci` o `npm install`.

### 6) Qué compartir si necesitas ayuda

Cuando algo falle, copia y pega (o toma un screenshot) de:

- La salida completa del comando que falló (`npm run dev`, `npm run build`, `npx vite`).
- La pestaña `Console` del navegador con errores completos.
- La pestaña `Network` mostrando la petición que falla y su `Response`.

---

Si quieres, puedo intentar arrancar `npm run dev` aquí y traer la salida de la terminal para diagnosticar cualquier error inmediatamente.

# 📋 Registro de Peticiones (plantilla)

A continuación hay una tabla para registrar las peticiones realizadas durante la práctica. Copia/pega filas adicionales según necesites.

| Método | URL | Código de estado | Tiempo respuesta | Observaciones CORS |
|---|---|---:|---:|---|
| GET | https://pokeapi.co/api/v2/pokemon?limit=20 | 200 | 123 ms | - |

### HTTP vs HTTPS

Para que esta aplicación funcione, el navegador (cliente) debe comunicarse con los servidores de PokéAPI.

*   **HTTP (HyperText Transfer Protocol)**: Es el protocolo estándar de comunicación. Imagínalo como una carta postal abierta; cualquiera que maneje la carta en el camino podría leerla.
*   **HTTPS (Secure)**: Es la versión segura. Utiliza SSL/TLS para encriptar la "carta". Aunque alguien la intercepte, solo verá caracteres sin sentido. **PokéAPI utiliza HTTPS**, garantizando que los datos que recibes son íntegros y provienen realmente de ellos.

### ¿Cómo funciona una petición (Request)?

1.  **Fetch**: La aplicación utiliza la función nativa `fetch()` de JavaScript.
2.  **Verbo GET**: Se utiliza el método HTTP `GET`, que significa "quiero obtener datos" (a diferencia de POST, que sería para enviar datos nuevos).
3.  **Endpoints**:
    *   Lista: `https://pokeapi.co/api/v2/pokemon?limit=20`
    *   Detalle: `https://pokeapi.co/api/v2/pokemon/{nombre_o_id}`
4.  **Respuesta**: El servidor devuelve un objeto JSON con el estado `200 OK` si todo salió bien, o `404 Not Found` si el Pokémon no existe.

## 🛠 Tecnologías

*   **React 18**: Para la construcción de la interfaz de usuario basada en componentes.
*   **Tailwind CSS**: Para estilos rápidos, responsivos y modernos sin escribir CSS tradicional.
*   **Lucide React**: Para iconografía vectorial ligera.
*   **Vite/Esbuild**: (Implícito en el entorno) Para el empaquetado y transpilation de TypeScript.
