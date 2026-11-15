import axios from 'axios'

/**
 * Instancia de axios con la URL base de la API.
 * Axios ya rechaza las respuestas no-2xx, parsea el JSON y serializa el body,
 * así que no hace falta un wrapper propio.
 */
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})
