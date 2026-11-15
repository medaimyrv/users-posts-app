import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

const STORAGE_KEY = 'theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/**
 * Tema inicial. Prioridad:
 * 1. El que ya aplicó el script de `index.html` (evita el destello al cargar).
 * 2. La elección guardada del usuario.
 * 3. La preferencia del sistema operativo.
 */
function getInitialTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  if (isTheme(applied)) return applied

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, cookies bloqueadas).
  }

  // `?.`: jsdom (tests) no implementa matchMedia.
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Estado global del tema con Context.
 * Aplica el tema como `data-theme` en `<html>`: las variables CSS de `global.css`
 * cambian de valor y todos los componentes se actualizan sin lógica propia.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Sincroniza React con un sistema externo (el DOM): uso legítimo de un efecto.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    // Solo se guarda cuando el usuario elige; si nunca elige, se sigue al sistema.
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sin persistencia: el tema funciona igual durante la sesión.
    }
  }, [theme])

  // `useMemo`: el objeto del contexto solo cambia cuando cambia el tema,
  // así los consumidores no se renderizan de nuevo sin motivo.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
