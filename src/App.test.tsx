import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from './api/client'
import App from './App'
import { CORS_HEADERS } from './test/handlers'
import { server } from './test/server'
import { ThemeProvider } from './theme/ThemeProvider'

/**
 * Tests de integración: renderizan la app completa y la usan como una persona
 * (teclado y clics con user-event), buscando por roles y etiquetas accesibles.
 * La red la simula MSW, así que se prueba toda la cadena: componente → hook → axios.
 */

/** Renderiza la app con sus providers, igual que `main.tsx`. */
function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}

async function selectUser(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  await user.click(await screen.findByRole('button', { name }))
  // Espera a que carguen sus publicaciones (aparece el formulario).
  await screen.findByRole('form', { name: 'Nueva publicación' })
}

describe('Tema', () => {
  it('alterna entre claro y oscuro y recuerda la elección', async () => {
    const user = userEvent.setup()
    renderApp()

    const toggle = screen.getByRole('button', { name: 'Tema oscuro' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})

describe('Usuarios', () => {
  it('filtra por nombre sin distinguir mayúsculas ni tildes y avisa si no hay resultados', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('3 usuarios')

    const search = screen.getByLabelText('Buscar por nombre')
    await user.type(search, 'JOSE')

    expect(screen.getByRole('button', { name: /José Pérez/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Leanne Graham/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 de 3 usuarios')

    await user.clear(search)
    await user.type(search, 'zzz')
    expect(screen.getByText('Ningún usuario coincide con «zzz».')).toBeInTheDocument()
  })

  it('muestra un error si falla la carga y permite reintentar', async () => {
    // Solo la primera petición falla; el reintento usa el handler por defecto.
    server.use(
      http.get(`${API_BASE_URL}/users`, () => new HttpResponse(null, { status: 500, headers: CORS_HEADERS }), {
        once: true,
      }),
    )
    const user = userEvent.setup()
    renderApp()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No se pudieron cargar los usuarios.')

    await user.click(within(alert).getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Publicaciones', () => {
  it('muestra las publicaciones del usuario seleccionado', async () => {
    const user = userEvent.setup()
    renderApp()

    await selectUser(user, /Leanne Graham/)

    expect(screen.getByRole('heading', { name: 'Publicaciones de Leanne Graham' })).toHaveFocus()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /Leanne Graham/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('valida que título y texto son obligatorios y lleva el foco al primer error', async () => {
    const user = userEvent.setup()
    renderApp()
    await selectUser(user, /Leanne Graham/)

    const title = screen.getByLabelText(/Título/)
    const body = screen.getByLabelText(/Texto/)

    // Solo espacios: `.trim()` del esquema lo trata como vacío.
    await user.type(body, '   ')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('El título es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El texto es obligatorio.')).toBeInTheDocument()
    expect(title).toHaveAttribute('aria-invalid', 'true')
    expect(title).toHaveAccessibleDescription('El título es obligatorio.')
    expect(title).toHaveFocus()

    // Validación perezosa: tras el primer envío, el error desaparece al corregir.
    await user.type(title, 'Hola')
    expect(screen.queryByText('El título es obligatorio.')).not.toBeInTheDocument()
  })

  it('crea una publicación y la muestra la primera de la lista', async () => {
    const user = userEvent.setup()
    renderApp()
    await selectUser(user, /Leanne Graham/)

    await user.type(screen.getByLabelText(/Título/), 'Mi nueva publicación')
    await user.type(screen.getByLabelText(/Texto/), 'Contenido nuevo')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('Publicación creada.')).toBeInTheDocument()

    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(3)
    expect(within(articles[0]!).getByRole('heading')).toHaveTextContent('Mi nueva publicación')

    // El formulario se limpia tras crear.
    expect(screen.getByLabelText(/Título/)).toHaveValue('')
  })

  it('si falla la publicación muestra un error y conserva lo escrito', async () => {
    server.use(
      http.post(`${API_BASE_URL}/posts`, () => new HttpResponse(null, { status: 500, headers: CORS_HEADERS })),
    )
    const user = userEvent.setup()
    renderApp()
    await selectUser(user, /Leanne Graham/)

    await user.type(screen.getByLabelText(/Título/), 'No se guardará')
    await user.type(screen.getByLabelText(/Texto/), 'Contenido')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo publicar. Inténtalo de nuevo.')
    expect(screen.getByLabelText(/Título/)).toHaveValue('No se guardará')
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.queryByText('Publicación creada.')).not.toBeInTheDocument()
  })
})
