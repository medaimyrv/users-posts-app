import type { Post } from '../../types/domain'

interface PostListProps {
  posts: Post[]
}

/** Componente presentacional: cada publicación es un `<article>` con su título. */
export function PostList({ posts }: PostListProps) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id}>
          <article className="post-item">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
