import type { NewPost, Post, User } from '../types/domain'
import { api } from './client'

// El `signal` permite cancelar la petición (lo usan los hooks para evitar race conditions).
// Nota: el genérico `get<T>` confía en el contrato de la API; con más tiempo lo validaría con Zod.

export async function getUsers(signal: AbortSignal): Promise<User[]> {
  const { data } = await api.get<User[]>('/users', { signal })
  return data
}

export async function getPostsByUser(userId: number, signal: AbortSignal): Promise<Post[]> {
  const { data } = await api.get<Post[]>(`/users/${userId}/posts`, { signal })
  return data
}

/** La API simula la creación: responde con la publicación y un `id`, pero no la guarda. */
export async function createPost(newPost: NewPost): Promise<Post> {
  const { data } = await api.post<Post>('/posts', newPost)
  return data
}
