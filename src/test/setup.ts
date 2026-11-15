import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

// `onUnhandledFrame: 'error'` (en MSW < 3 se llamaba `onUnhandledRequest`): si un test
// hace una petición sin handler, falla en vez de salir a la red real.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

afterEach(() => {
  server.resetHandlers() // descarta los handlers añadidos en un test con `server.use`
  cleanup() // desmonta lo renderizado (sin `globals: true` no es automático)
})

afterAll(() => server.close())
