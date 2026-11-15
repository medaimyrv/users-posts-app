/**
 * Normaliza un texto para comparaciones de búsqueda:
 * sin tildes ("José" → "jose"), en minúsculas y sin espacios en los extremos.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
