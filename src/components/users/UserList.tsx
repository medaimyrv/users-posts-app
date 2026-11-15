import type { User } from '../../types/domain'

interface UserListProps {
  users: User[]
}

/** Componente presentacional: solo pinta la lista que recibe. */
export function UserList({ users }: UserListProps) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} className="user-item">
          <span className="user-name">{user.name}</span>
          <span className="user-meta">{user.email}</span>
        </li>
      ))}
    </ul>
  )
}
