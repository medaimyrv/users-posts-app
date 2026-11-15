import { useId } from 'react'
import styles from './SearchBox.module.css'

interface SearchBoxProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Campo de búsqueda controlado con etiqueta visible asociada (accesible). */
export function SearchBox({ label, value, onChange, placeholder }: SearchBoxProps) {
  const id = useId()

  return (
    <div className={styles.searchBox}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  )
}
