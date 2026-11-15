# Usuarios y publicaciones

Pequeña app con React y TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com): lista de usuarios con búsqueda por nombre, publicaciones de cada usuario y creación de nuevas publicaciones con un formulario validado.

## Cómo ejecutarlo

> Se completará al final.

## Decisiones

| Tema | Elección | Alternativas | Por qué |
|---|---|---|---|
| Herramienta de build | **Vite** (plantilla `react-ts`) | Next.js, Create React App | Arranca al instante, se configura poco y Vitest se integra de forma nativa. Next.js sería sobreingeniería para una SPA sin servidor, y CRA está obsoleto. |
| Gestor de paquetes | **npm** | pnpm | Viene con Node: quien revise no necesita instalar nada más. |
| Estado | **`useState`** para el estado local y **Context** para el global | Redux, Zustand | El proyecto es pequeño y Redux añadiría complejidad sin beneficio. |
| Linter | **oxlint** (por defecto en la plantilla de Vite) | ESLint | Es el que trae la plantilla actual, es muy rápido y cubre las reglas de hooks. |
| Tipado | TypeScript `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` | `strict` solo | Detecta más errores en tiempo de compilación (accesos a arrays que pueden ser `undefined` y propiedades opcionales mal usadas). |
| Peticiones HTTP | **axios** (instancia con `baseURL` en `src/api/client.ts`) | `fetch` nativo con un wrapper propio | Empecé con `fetch`, pero obligaba a escribir un wrapper (comprobar `res.ok`, una clase de error propia, serializar el body). Axios ya rechaza las respuestas no 2xx y gestiona el JSON, así que el código queda más corto y fácil de explicar. Es una dependencia muy extendida en la industria. |
| Datos del servidor | **Hooks propios** con `useState` + `useEffect` (`useAsyncData`, `useUsers`, `useUserPosts`) | TanStack Query | Coherente con la decisión de usar `useState` y sin dependencias. Es el patrón clásico de `useEffect`, extraído a un hook: estado como unión discriminada (`loading`, `error`, `success`), cancelación con `AbortController` contra *race conditions* y `retry`. Cuando cambia el parámetro (el usuario), el componente se reinicia con `key={userId}`. TanStack Query (caché, reintentos, deduplicación) sería la elección en una app mayor. |
| Arquitectura | `types/` (dominio), `api/` (transporte y endpoints), `hooks/` (ciclo de vida de los datos) | Todo dentro de los componentes | Responsabilidad única: los componentes solo pintan. `useAsyncData` recibe la función de carga como parámetro, así que sirve para cualquier endpoint sin modificarlo (abierto/cerrado). |

**Principios generales:** código claro, buenas prácticas de UX/UI y accesibilidad, y principios SOLID aplicados con criterio, sin ser puristas.

## Uso de la IA

He usado Claude Code (Claude Opus 5.5) como asistente durante toda la prueba, trabajando por etapas: la IA propone opciones, yo decido y la IA implementa solo esa etapa. Los commits los reviso y los hago yo.

### Planificación
- **Qué le pedí:** un plan por etapas con tabla (etapa, tareas, commit sugerido, tiempo estimado).
- **Qué acepté:** la división en 8 etapas y los mensajes de commit.
- **Qué corregí:**
  - Los tiempos estimados me parecieron excesivos para algo sencillo; se redujeron de unos 140 min a unos 80 min.
  - Fijé de antemano la gestión de estado: `useState` para el local y Context para el global, sin Redux.
  - Le pedí que me consultara cada decisión tecnológica, aplicar buenas prácticas de UX/UI y SOLID sin purismo, y que nunca hiciera commits por su cuenta.

### Etapa 0: Arranque
- **Qué le pedí:** opciones de herramienta de build y gestor de paquetes. Elegí Vite y npm, sus recomendaciones.
- **Qué acepté:** crear el proyecto, limpiar el boilerplate, endurecer el `tsconfig`, añadir el script `typecheck` y poner `lang="es"`.
- **Qué corregí:** —

### Etapa 1: Capa de datos
- **Qué le pedí:** opciones de cliente HTTP y de gestión de los datos del servidor. Primero elegí `fetch` nativo y hooks propios con `useState`, sus recomendaciones.
- **Qué acepté:** los tipos de dominio, los endpoints y el hook genérico `useAsyncData` con unión discriminada, `AbortController` y `retry`.
- **Qué corregí:**
  - Al revisar el código antes del commit vi que el wrapper de `fetch` tenía demasiado código propio que luego tendría que explicar. Le pedí cambiar a **axios**, que ofrece lo mismo con menos código.
  - Le pregunté qué resolvía exactamente `useAsyncData`. Su versión calculaba `loading` en el render comparando la petición actual con la última resuelta, para evitar un `setState` síncrono en el efecto que el linter había marcado. Era correcta pero difícil de explicar, así que elegí **simplificarla**: el hook ahora es el patrón clásico de `useEffect`, y el reinicio al cambiar de usuario se hace con `key={userId}`.
- **Verificación:** probé los endpoints contra la API real para confirmar la forma de las respuestas y que el POST devuelve siempre `id: 101`.

## Qué haría con más tiempo

> Se completará al final.

## Tiempo total

> Se completará al final.
