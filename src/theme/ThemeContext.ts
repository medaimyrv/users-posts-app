import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

/** `null` por defecto: `useTheme` detecta si se usa fuera del `ThemeProvider`. */
export const ThemeContext = createContext<ThemeContextValue | null>(null)
