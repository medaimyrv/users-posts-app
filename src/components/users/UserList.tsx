import type { User } from '../../types/domain'

interface UserListProps {
  users: User[]
  selectedUserId: number | null
  onSelectUser: (user: User) => void
}

/**
 * Componente presentacional: pinta la lista y avisa de la selección.
 * Cada usuario es un `<button>` (accesible por teclado) con `aria-pressed`
 * para que los lectores de pantalla anuncien cuál está seleccionado.
 */
export function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            className="user-item"
            aria-pressed={user.id === selectedUserId}
            onClick={() => onSelectUser(user)}
          >
            <span className="user-name">{user.name}</span>
            <span className="user-meta">{user.email}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
