interface ListSkeletonProps {
  /** Texto anunciado a lectores de pantalla, p. ej. "Cargando usuarios…". */
  label: string
  rows?: number
}

/**
 * Placeholder con la forma de una lista mientras carga: reduce la espera percibida
 * y evita saltos de layout. Es decorativo (`aria-hidden`); el estado se anuncia
 * con un texto solo para lectores de pantalla.
 */
export function ListSkeleton({ label, rows = 5 }: ListSkeletonProps) {
  return (
    <>
      <p role="status" className="sr-only">
        {label}
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
