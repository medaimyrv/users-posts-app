import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Acceso tipado al tema. Falla pronto y con un mensaje claro si falta el provider. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  }
  return context
}
