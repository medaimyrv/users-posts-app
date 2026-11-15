import type { User } from '../../types/domain'
import styles from './UserList.module.css'

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
    <ul className={styles.list}>
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            className={styles.item}
            aria-pressed={user.id === selectedUserId}
            onClick={() => onSelectUser(user)}
          >
            <span className={styles.name}>{user.name}</span>
            <span className={styles.meta}>{user.email}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
