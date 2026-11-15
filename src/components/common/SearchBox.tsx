import { useId } from 'react'

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
    <div className="search-box">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  )
}
