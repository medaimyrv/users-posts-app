import buttonStyles from './Button.module.css'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

/** Mensaje de error anunciado por lectores de pantalla (`role="alert"`) con opción de reintentar. */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className={styles.error}>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className={buttonStyles.primary} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
