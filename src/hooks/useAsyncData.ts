import { useCallback, useEffect, useState } from 'react'

/**
 * Unión discriminada: es imposible tener a la vez `data` y `error`,
 * y TypeScript obliga a comprobar `status` antes de acceder a `data`.
 */
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

/**
 * Patrón clásico de carga de datos con `useEffect`, extraído para reutilizarlo.
 *
 * - `load` debe tener referencia estable (función de módulo o `useCallback`);
 *   si cambia en cada render, el efecto se repetiría en bucle.
 * - Cancela la petición con `AbortController` al desmontar, para no actualizar
 *   un componente que ya no existe ni pisar datos con respuestas antiguas.
 * - Si el parámetro de la carga cambia (p. ej. el usuario), el componente que
 *   usa el hook debe renderizarse con `key={param}`: React lo monta de nuevo y
 *   el estado vuelve a `loading` sin lógica extra.
 */
export function useAsyncData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    load(controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: unknown) => {
        // Al cancelar, axios rechaza con un error de cancelación: no es un error real.
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      })

    return () => controller.abort()
  }, [load, attempt])

  /** Vuelve a lanzar la petición (botón "Reintentar"). */
  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { state, retry }
}
