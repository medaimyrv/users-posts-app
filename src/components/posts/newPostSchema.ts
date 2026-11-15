import { z } from 'zod'

export const TITLE_MAX_LENGTH = 100

/**
 * Esquema de validación del formulario: única fuente de verdad para
 * las reglas y para el tipo de los valores (`z.infer`).
 * `.trim()` hace que un campo con solo espacios cuente como vacío.
 */
export const newPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio.')
    .max(TITLE_MAX_LENGTH, `El título no puede superar los ${TITLE_MAX_LENGTH} caracteres.`),
  body: z.string().trim().min(1, 'El texto es obligatorio.'),
})

export type NewPostFormValues = z.infer<typeof newPostSchema>
