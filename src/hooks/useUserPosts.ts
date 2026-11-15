import { useCallback } from 'react'
import { getPostsByUser } from '../api/jsonplaceholder'
import { useAsyncData } from './useAsyncData'

/**
 * Publicaciones de un usuario. El componente que lo use debe renderizarse con
 * `key={userId}` para reiniciar el estado al cambiar de usuario (ver `useAsyncData`).
 */
export function useUserPosts(userId: number) {
  // `useCallback` mantiene estable la función mientras no cambie `userId`.
  const load = useCallback((signal: AbortSignal) => getPostsByUser(userId, signal), [userId])
  return useAsyncData(load)
}
