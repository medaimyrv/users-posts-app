interface UserListSkeletonProps {
  rows?: number
}

/**
 * Placeholder con la forma de la lista mientras carga: reduce la espera percibida
 * y evita saltos de layout. Es decorativo (`aria-hidden`); el estado se anuncia
 * con un texto solo para lectores de pantalla.
 */
export function UserListSkeleton({ rows = 5 }: UserListSkeletonProps) {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando usuarios…
      </p>
      <ul className="skeleton-list" aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="skeleton-item">
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line skeleton-line--short" />
          </li>
        ))}
      </ul>
    </>
  )
}
