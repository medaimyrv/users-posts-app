import type { User } from '../../types/domain'
import { normalizeText } from '../../utils/text'

/** Filtra por nombre sin distinguir mayúsculas ni tildes. Función pura: fácil de testear. */
export function filterUsersByName(users: User[], query: string): User[] {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) return users
  return users.filter((user) => normalizeText(user.name).includes(normalizedQuery))
}
