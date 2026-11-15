import { useId, useState } from 'react'
import { useUsers } from '../../hooks/useUsers'
import type { User } from '../../types/domain'
import { ErrorMessage } from '../common/ErrorMessage'
import { SearchBox } from '../common/SearchBox'
import { filterUsersByName } from './filterUsers'
import { UserList } from './UserList'
import { UserListSkeleton } from './UserListSkeleton'

/**
 * Contenedor: obtiene los usuarios, gestiona la búsqueda y decide qué estado pintar.
 * La presentación se delega en componentes que solo reciben props.
 */
export function UsersPanel() {
  const headingId = useId()
  const { state, retry } = useUsers()
  // Filtrado en memoria en cada pulsación: con pocos elementos no hace falta debounce.
  const [query, setQuery] = useState('')

  return (
    <section aria-labelledby={headingId} aria-busy={state.status === 'loading'}>
      <h2 id={headingId}>Usuarios</h2>

      <SearchBox
        label="Buscar por nombre"
        value={query}
        onChange={setQuery}
        placeholder="Ej.: Leanne"
      />

      {state.status === 'loading' && <UserListSkeleton />}

      {state.status === 'error' && (
        <ErrorMessage message="No se pudieron cargar los usuarios." onRetry={retry} />
      )}

      {state.status === 'success' && (
        <UserResults
          users={filterUsersByName(state.data, query)}
          total={state.data.length}
          query={query}
        />
      )}
    </section>
  )
}

interface UserResultsProps {
  users: User[]
  total: number
  query: string
}

function UserResults({ users, total, query }: UserResultsProps) {
  return (
    <>
      {/* `role="status"`: los lectores de pantalla anuncian el nº de resultados al filtrar. */}
      <p role="status" className="results-count">
        {users.length === total ? `${total} usuarios` : `${users.length} de ${total} usuarios`}
      </p>

      {users.length > 0 ? (
        <UserList users={users} />
      ) : (
        <p className="empty-state">Ningún usuario coincide con «{query.trim()}».</p>
      )}
    </>
  )
}
