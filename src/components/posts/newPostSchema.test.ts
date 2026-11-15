import { describe, expect, it } from 'vitest'
import { newPostSchema, TITLE_MAX_LENGTH } from './newPostSchema'

/** Test unitario: el esquema es una función pura y se prueba sin renderizar nada. */
describe('newPostSchema', () => {
  it('rechaza campos vacíos o con solo espacios', () => {
    const result = newPostSchema.safeParse({ title: '   ', body: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'El título es obligatorio.',
      'El texto es obligatorio.',
    ])
  })

  it('rechaza títulos demasiado largos', () => {
    const result = newPostSchema.safeParse({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1), body: 'Texto' })

    expect(result.success).toBe(false)
  })

  it('acepta valores válidos y recorta los espacios', () => {
    const result = newPostSchema.safeParse({ title: '  Hola  ', body: ' Texto ' })

    expect(result.data).toEqual({ title: 'Hola', body: 'Texto' })
  })
})
