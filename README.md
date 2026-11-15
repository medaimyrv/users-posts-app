# Usuarios y publicaciones

Pequeña app con React y TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com): lista de usuarios con búsqueda por nombre, publicaciones de cada usuario y creación de nuevas publicaciones con un formulario validado.

## Cómo ejecutarlo

> Se completará al final.
>
> Nota (Windows): ejecutar los tests desde PowerShell o CMD. Desde Git Bash, Vitest puede fallar con "failed to find the runner" por la letra de unidad en minúscula.

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
| Estado de carga | **Skeleton** con la forma de la lista + texto "Cargando…" solo para lectores de pantalla (`role="status"`) | Spinner, solo texto | Reduce la espera percibida y evita saltos de layout. El skeleton es decorativo (`aria-hidden`) y respeta `prefers-reduced-motion`. |
| Búsqueda | En el cliente, **en cada pulsación**, sin distinguir mayúsculas ni tildes | Debounce, búsqueda en servidor | La API solo tiene 10 usuarios y no ofrece búsqueda parcial, así que se filtra en memoria la lista ya cargada. Un debounce solo añadiría retraso; lo usaría si la búsqueda pasara al servidor o la lista fuera muy grande. |
| Componentes | Contenedor (`UsersPanel`: datos y búsqueda) + presentacionales (`UserList`, `UserListSkeleton`, `SearchBox`, `ErrorMessage`) + lógica pura (`filterUsersByName`) | Un solo componente grande | Responsabilidad única. Los presentacionales son reutilizables y la lógica pura se testea sin renderizar. |
| Usuario seleccionado | **`useState` en `App`** + props (estado subido al padre común) | Context, React Router (`/users/:id`) | Lo comparten dos componentes hermanos a un solo nivel, así que no hay *prop drilling*. Context lo reservo para algo de verdad global, el tema claro u oscuro. Router daría URL compartible y botón atrás (ver "Qué haría con más tiempo"). |
| Reinicio al cambiar de usuario | `<PostsPanel key={user.id} />` | Sincronizar el estado en un efecto | Cambiar la `key` hace que React monte el componente de nuevo: el estado vuelve a `loading` y el cleanup cancela la petición anterior. |
| Disposición | **Maestro-detalle, mobile-first**: una columna en móvil y dos desde 48rem | Vista de detalle con botón "Volver" | Lista y publicaciones visibles a la vez en escritorio. En móvil, al seleccionar, el foco pasa al título de las publicaciones y la vista se desplaza hasta ellas. |
| Accesibilidad de la selección | Usuarios como `<button aria-pressed>`; foco programático al `h2` (`tabIndex={-1}`) | `<li onClick>` | Manejable con teclado y el lector de pantalla anuncia cuál está seleccionado y el cambio de contenido. Área táctil de 44 px o más. |
| Formulario | **React Hook Form + Zod** (`@hookform/resolvers`) | `useState` a mano, RHF solo | Elegido **a propósito para demostrar el estándar de la industria**: con 2 campos bastaría con `useState`. El esquema Zod es la única fuente de verdad: reglas y tipo (`z.infer`). `.trim()` rechaza títulos con solo espacios y el esquema se puede testear sin renderizar. |
| Momento de validar | **Al enviar y, después, al corregir** (`mode: 'onSubmit'` + `reValidateMode: 'onChange'`, el comportamiento por defecto de RHF) | Al salir de cada campo, solo al enviar | No muestra errores mientras se escribe por primera vez; tras el primer intento, el error desaparece al corregir. El foco va al primer campo inválido. Errores enlazados con `aria-invalid` y `aria-describedby`, y `noValidate` para no mezclarlos con los globos nativos. |
| Añadir la publicación | **Esperar la respuesta del POST** y guardarla en un `useState` local (`createdPosts`) que se pinta delante de las cargadas | Actualización optimista | Solo aparece si la API responde bien. El botón pasa a "Publicando…" y se deshabilita para evitar dobles envíos. Si falla, se muestra un error y se conserva lo escrito. No hace falta tocar `useAsyncData`. |
| `id` de las publicaciones creadas | Ids locales negativos (`-1`, `-2`…) | Usar el `id` de la API | La API devuelve siempre `id: 101`: con dos publicaciones creadas chocarían las `key` de React. Los negativos nunca coinciden con los del servidor. |
| Test runner | **Vitest** + jsdom | Jest | Comparte configuración con Vite (TS y JSX sin configurar nada) y su API es compatible con Jest. Jest en Vite pide Babel o `ts-jest` y configuración de ESM. |
| Estilo de tests | **Testing Library + user-event**: tests de integración sobre `App`, buscando por *role* y *label* | Tests unitarios de cada componente con mocks | Prueban el comportamiento que ve el usuario, no la implementación, y de paso verifican la accesibilidad (si no se encuentra por *role* o *label*, un lector de pantalla tampoco lo encontraría). El esquema Zod se prueba aparte, como función pura. |
| Simulación de la API | **MSW** (Mock Service Worker) | `vi.mock` del módulo de la API, mockear axios | Intercepta las peticiones HTTP reales, así que se prueba toda la cadena (componente → hook → axios → red). Si se cambia axios por `fetch`, los tests siguen valiendo. `onUnhandledFrame: 'error'` evita peticiones reales accidentales. |
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

### Etapa 2: Lista de usuarios con búsqueda
- **Qué le pedí:** opciones para mostrar la carga y para decidir cuándo filtrar.
- **Qué acepté:** el skeleton (su recomendación), la búsqueda sin distinguir mayúsculas ni tildes, el contador de resultados anunciado a lectores de pantalla, el mensaje de "sin resultados" y la separación entre contenedor y componentes presentacionales.
- **Qué corregí o decidí distinto:** la IA recomendaba filtrar en cada pulsación, sin debounce. Primero elegí añadir debounce con un custom hook (`useDebouncedValue`) para demostrar el patrón. Al revisarlo me di cuenta de que el filtro se hace en memoria sobre la lista ya cargada, así que el debounce no ahorraba nada y solo retrasaba el resultado 300 ms. **Lo quité.**

### Etapa 3: Publicaciones del usuario seleccionado
- **Qué le pedí:** opciones para guardar el usuario seleccionado y para la disposición en pantalla.
- **Qué acepté:** `useState` en `App` y el maestro-detalle (sus recomendaciones), el reinicio con `key`, los usuarios como botones con `aria-pressed`, el foco al título de las publicaciones y un skeleton reutilizable (`ListSkeleton`) para usuarios y publicaciones.
- **Refactor:** en la etapa 2 el skeleton solo lo usaban los usuarios, así que era específico (`UserListSkeleton`). Al necesitarlo también las publicaciones, lo generalicé a `ListSkeleton` con un prop `label` en vez de duplicarlo. Prefiero abstraer cuando aparece un segundo caso real (YAGNI) antes que adivinarlo de antemano.
- **Qué indiqué yo:** que el layout fuera **responsive mobile-first** y que Context se use para el **tema claro u oscuro**, como ejemplo de estado global (se implementa en la etapa de estilos).

### Etapa 4: Formulario para crear publicaciones
- **Qué le pedí:** opciones para gestionar el formulario, el momento de validar y cómo añadir la publicación a la lista.
- **Qué acepté:** validación perezosa y esperar a la respuesta del POST con estado local (sus recomendaciones), y los ids locales negativos para evitar el `id: 101` repetido.
- **Qué corregí o decidí distinto:** la IA recomendaba un formulario controlado a mano con `useState`. Lo cambié a **React Hook Form**, porque es lo que se usa hoy en la industria y quería demostrarlo. Le pregunté si convenía añadir Zod; me explicó la diferencia (tipo deducido del esquema, `.trim()`, esquema testeable) y elegí **RHF + Zod**.
- **Corrección de la IA durante la revisión:** había ocultado el mensaje de éxito vacío con `display: none`, pero eso saca la región `role="status"` del árbol de accesibilidad y algunos lectores dejarían de anunciarla. Lo quitó.

### Etapa 5: Tests
- **Qué le pedí:** opciones de test runner y de simulación de la API. Elegí Vitest y MSW, sus recomendaciones.
- **Qué acepté:** 9 tests:
  - **Integración (6):** búsqueda sin distinguir tildes ni mayúsculas con "sin resultados", error de carga con reintento, selección de usuario con foco, validación del formulario, creación y error al publicar.
  - **Unitarios del esquema Zod (3).**
- **Qué corregí:** me di cuenta de que la app se veía casi sin estilos y le pregunté si estaba usando CSS Modules sin habérmelo consultado. No era así: había ido añadiendo CSS global mínimo en `index.css` para el skeleton, el layout y el formulario, pero **no me había avisado**. La decisión de cómo hacer los estilos queda para la etapa 6.
- **Lo que destaparon los tests y se corrigió:**
  - **Bug real en el formulario:** llamar a `reset()` dentro de `handleSubmit` hacía que RHF dejara `isSubmitSuccessful` en `false` y no aparecía "Publicación creada.". Se cambió al patrón que recomienda la documentación de RHF: `reset` en un `useEffect` que reacciona a `isSubmitSuccessful`.
  - **CORS en los mocks:** jsdom aplica CORS como un navegador. Sin cabeceras `Access-Control-Allow-*` en las respuestas de MSW (ni respuesta al *preflight* `OPTIONS` del POST), axios recibía "Network Error". La API real las envía, así que los mocks ahora también.
  - **Cambio de API en MSW 3:** la opción `onUnhandledRequest` ahora se llama `onUnhandledFrame`. El typecheck lo detectó.
  - **Entorno:** en Windows, ejecutar Vitest desde Git Bash (`/d/...`, unidad en minúscula) da "failed to find the runner". Desde PowerShell o CMD funciona.

## Qué haría con más tiempo

> Se completará al final.

## Tiempo total

> Se completará al final.
