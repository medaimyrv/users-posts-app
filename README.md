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

## Qué haría con más tiempo

> Se completará al final.

## Tiempo total

> Se completará al final.
