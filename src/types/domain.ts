/**
 * Tipos de dominio. Solo incluyen los campos que usa la app:
 * la API devuelve más (dirección, teléfono...), pero TypeScript es estructural
 * y tipar lo que no usamos solo añadiría ruido.
 */
export interface User {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
  }
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

/** Datos necesarios para crear una publicación: el `id` lo asigna el servidor. */
export type NewPost = Omit<Post, 'id'>
