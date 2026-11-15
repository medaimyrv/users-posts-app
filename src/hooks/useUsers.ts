import { getUsers } from '../api/jsonplaceholder'
import { useAsyncData } from './useAsyncData'

/** `getUsers` es una función de módulo: su referencia es estable y no hace falta `useCallback`. */
export function useUsers() {
  return useAsyncData(getUsers)
}
