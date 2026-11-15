import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '../api/client'
import type { NewPost, Post, User } from '../types/domain'

/**
 * jsdom aplica CORS como un navegador real: sin estas cabeceras descarta la respuesta
 * simulada y axios recibe un "Network Error". La API real también las envía.
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/** Datos de prueba: incluyen un nombre con tilde para probar la búsqueda. */
export const testUsers: User[] = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com', company: { name: 'Romaguera' } },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com', company: { name: 'Deckow' } },
  { id: 3, name: 'José Pérez', username: 'jose', email: 'jose@example.com', company: { name: 'Acme' } },
]

export const testPosts: Post[] = [
  { id: 1, userId: 1, title: 'Primera publicación', body: 'Contenido de la primera' },
  { id: 2, userId: 1, title: 'Segunda publicación', body: 'Contenido de la segunda' },
]

/** Handlers por defecto: imitan a JSONPlaceholder (el POST devuelve siempre `id: 101`). */
export const handlers = [
  // Preflight CORS que el navegador (jsdom) envía antes del POST con JSON.
  http.options(`${API_BASE_URL}/*`, () => new HttpResponse(null, { status: 204, headers: CORS_HEADERS })),

  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(testUsers, { headers: CORS_HEADERS })),

  http.get(`${API_BASE_URL}/users/:userId/posts`, ({ params }) =>
    HttpResponse.json(
      testPosts.filter((post) => post.userId === Number(params.userId)),
      { headers: CORS_HEADERS },
    ),
  ),

  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const newPost = (await request.json()) as NewPost
    return HttpResponse.json({ ...newPost, id: 101 }, { status: 201, headers: CORS_HEADERS })
  }),
]
