interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

/** Mensaje de error anunciado por lectores de pantalla (`role="alert"`) con opción de reintentar. */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="error-message">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
