import { useEffect, useId, useRef } from 'react'
import { useUserPosts } from '../../hooks/useUserPosts'
import type { User } from '../../types/domain'
import { ErrorMessage } from '../common/ErrorMessage'
import { ListSkeleton } from '../common/ListSkeleton'
import { PostList } from './PostList'

interface PostsPanelProps {
  user: User
}

/**
 * Publicaciones del usuario seleccionado.
 * Debe renderizarse con `key={user.id}`: al cambiar de usuario React lo monta de nuevo,
 * el estado vuelve a `loading` y la petición anterior se cancela (cleanup del hook).
 */
export function PostsPanel({ user }: PostsPanelProps) {
  const headingId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { state, retry } = useUserPosts(user.id)

  // Al seleccionar un usuario, el foco va al título: los lectores de pantalla anuncian
  // el cambio y en móvil (columnas apiladas) la vista se desplaza hasta las publicaciones.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section
      className="panel"
      aria-labelledby={headingId}
      aria-busy={state.status === 'loading'}
    >
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        Publicaciones de {user.name}
      </h2>

      {state.status === 'loading' && <ListSkeleton label="Cargando publicaciones…" rows={4} />}

      {state.status === 'error' && (
        <ErrorMessage message="No se pudieron cargar las publicaciones." onRetry={retry} />
      )}

      {state.status === 'success' &&
        (state.data.length > 0 ? (
          <PostList posts={state.data} />
        ) : (
          <p className="empty-state">Este usuario todavía no tiene publicaciones.</p>
        ))}
    </section>
  )
}
