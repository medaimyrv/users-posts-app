import { useEffect, useId, useRef, useState } from 'react'
import { createPost } from '../../api/jsonplaceholder'
import { useUserPosts } from '../../hooks/useUserPosts'
import type { Post, User } from '../../types/domain'
import { ErrorMessage } from '../common/ErrorMessage'
import { ListSkeleton } from '../common/ListSkeleton'
import panelStyles from '../common/Panel.module.css'
import type { NewPostFormValues } from './newPostSchema'
import { NewPostForm } from './NewPostForm'
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

  // La API no guarda nada: las publicaciones creadas viven en estado local
  // y se pintan delante de las cargadas (sin tocar `useAsyncData`).
  const [createdPosts, setCreatedPosts] = useState<Post[]>([])
  // La API devuelve siempre `id: 101`; para que las `key` no choquen usamos ids
  // locales negativos, que nunca coinciden con los del servidor.
  const nextLocalId = useRef(-1)

  // Al seleccionar un usuario, el foco va al título: los lectores de pantalla anuncian
  // el cambio y en móvil (columnas apiladas) la vista se desplaza hasta las publicaciones.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function handleCreate(values: NewPostFormValues) {
    const created = await createPost({ ...values, userId: user.id })
    const localPost: Post = { ...created, id: nextLocalId.current-- }
    setCreatedPosts((previous) => [localPost, ...previous])
  }

  return (
    <section
      className={panelStyles.panel}
      aria-labelledby={headingId}
      aria-busy={state.status === 'loading'}
    >
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className={panelStyles.heading}>
        Publicaciones de {user.name}
      </h2>

      {state.status === 'loading' && <ListSkeleton label="Cargando publicaciones…" rows={4} />}

      {state.status === 'error' && (
        <ErrorMessage message="No se pudieron cargar las publicaciones." onRetry={retry} />
      )}

      {state.status === 'success' && (
        <>
          <NewPostForm onCreate={handleCreate} />

          {createdPosts.length + state.data.length > 0 ? (
            <PostList posts={[...createdPosts, ...state.data]} />
          ) : (
            <p className={panelStyles.empty}>Este usuario todavía no tiene publicaciones.</p>
          )}
        </>
      )}
    </section>
  )
}
