import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** Servidor MSW: intercepta las peticiones HTTP reales que hace axios en los tests. */
export const server = setupServer(...handlers)
