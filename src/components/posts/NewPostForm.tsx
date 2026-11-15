import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import buttonStyles from '../common/Button.module.css'
import styles from './NewPostForm.module.css'
import { newPostSchema, type NewPostFormValues } from './newPostSchema'

interface NewPostFormProps {
  /** Envía la publicación. Si rechaza, el formulario muestra un error y conserva lo escrito. */
  onCreate: (values: NewPostFormValues) => Promise<void>
}

/**
 * Formulario con React Hook Form + Zod.
 * Validación "perezosa" (comportamiento por defecto de RHF):
 * - `mode: 'onSubmit'`: no muestra errores mientras se escribe por primera vez;
 * - `reValidateMode: 'onChange'`: tras el primer envío, el error desaparece al corregir;
 * - `shouldFocusError`: al enviar con errores, el foco va al primer campo inválido.
 */
export function NewPostForm({ onCreate }: NewPostFormProps) {
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewPostFormValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: { title: '', body: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await onCreate(values)
    } catch {
      // Con un error en `root`, RHF marca el envío como no exitoso y se conserva lo escrito.
      setError('root', { message: 'No se pudo publicar. Inténtalo de nuevo.' })
    }
  })

  // Patrón recomendado por RHF: limpiar el formulario después de un envío exitoso
  // (llamar a `reset` dentro de `handleSubmit` choca con su actualización final del estado).
  // `keepIsSubmitSuccessful` mantiene visible la confirmación.
  useEffect(() => {
    if (isSubmitSuccessful) reset(undefined, { keepIsSubmitSuccessful: true })
  }, [isSubmitSuccessful, reset])

  return (
    // `noValidate`: desactiva los globos nativos del navegador; los errores los pinta la app.
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`} className={styles.heading}>
        Nueva publicación
      </h3>
      <p>
        Los campos marcados con <span className={styles.required}>*</span> son obligatorios.
      </p>

      <div className={styles.field}>
        <label htmlFor={titleId} className={styles.label}>
          Título{' '}
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        </label>
        <input
          id={titleId}
          type="text"
          className={styles.input}
          aria-required="true"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          {...register('title')}
        />
        {errors.title && (
          <p id={`${titleId}-error`} className={styles.fieldError}>
            {errors.title.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={bodyId} className={styles.label}>
          Texto{' '}
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id={bodyId}
          rows={4}
          className={`${styles.input} ${styles.textarea}`}
          aria-required="true"
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? `${bodyId}-error` : undefined}
          {...register('body')}
        />
        {errors.body && (
          <p id={`${bodyId}-error`} className={styles.fieldError}>
            {errors.body.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert" className={styles.formError}>
          {errors.root.message}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={buttonStyles.primary} disabled={isSubmitting}>
          {isSubmitting ? 'Publicando…' : 'Publicar'}
        </button>

        {/* Siempre presente para que los lectores de pantalla anuncien el cambio de contenido. */}
        <p role="status" className={styles.success}>
          {isSubmitSuccessful ? 'Publicación creada.' : ''}
        </p>
      </div>
    </form>
  )
}
