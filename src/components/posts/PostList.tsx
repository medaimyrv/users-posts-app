import type { Post } from '../../types/domain'
import styles from './PostList.module.css'

interface PostListProps {
  posts: Post[]
}

/** Componente presentacional: cada publicación es un `<article>` con su título. */
export function PostList({ posts }: PostListProps) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <article className={styles.item}>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.body}>{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
