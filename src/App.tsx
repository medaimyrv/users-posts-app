import { useState } from 'react'
import { PostsPanel } from './components/posts/PostsPanel'
import { UsersPanel } from './components/users/UsersPanel'
import type { User } from './types/domain'

function App() {
  // Estado compartido por dos hermanos: se sube al padre común y se pasa por props.
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <main className="app">
      <h1>Usuarios y publicaciones</h1>

      <div className="layout">
        <UsersPanel selectedUserId={selectedUser?.id ?? null} onSelectUser={setSelectedUser} />

        {selectedUser ? (
          // `key` reinicia el panel (estado y petición) al cambiar de usuario.
          <PostsPanel key={selectedUser.id} user={selectedUser} />
        ) : (
          <section className="panel panel--placeholder" aria-label="Publicaciones">
            <p className="empty-state">Selecciona un usuario para ver sus publicaciones.</p>
          </section>
        )}
      </div>
    </main>
  )
}

export default App
