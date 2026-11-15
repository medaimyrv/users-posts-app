import { useState } from 'react'
import styles from './App.module.css'
import panelStyles from './components/common/Panel.module.css'
import { ThemeToggle } from './components/common/ThemeToggle'
import { PostsPanel } from './components/posts/PostsPanel'
import { UsersPanel } from './components/users/UsersPanel'
import type { User } from './types/domain'

function App() {
  // Estado compartido por dos hermanos: se sube al padre común y se pasa por props.
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Usuarios y publicaciones</h1>
        <ThemeToggle />
      </header>

      <main className={styles.layout}>
        <div className={styles.sidebar}>
          <UsersPanel selectedUserId={selectedUser?.id ?? null} onSelectUser={setSelectedUser} />
        </div>

        {selectedUser ? (
          // `key` reinicia el panel (estado y petición) al cambiar de usuario.
          <PostsPanel key={selectedUser.id} user={selectedUser} />
        ) : (
          <section
            className={`${panelStyles.panel} ${panelStyles.placeholder}`}
            aria-label="Publicaciones"
          >
            <p className={panelStyles.empty}>Selecciona un usuario para ver sus publicaciones.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
