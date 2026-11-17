const PREFIX_LENGTH = 6

const GENERIC_WORDS = new Set([
  'medico',
  'medica',
  'medicina',
  'doutor',
  'doutora',
  'consulta',
  'consultas',
  'especialista',
  'atendimento',
  'agendar',
  'marcar',
])

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function significantWords(text: string): string[] {
  return normalize(text)
    .split(/[^a-z]+/)
    .filter((word) => word.length >= PREFIX_LENGTH && !GENERIC_WORDS.has(word))
}

function sharesPrefix(left: string, right: string): boolean {
  return left.slice(0, PREFIX_LENGTH) === right.slice(0, PREFIX_LENGTH)
}

export function findSpecialtyInText(
  text: string,
  specialties: string[],
): string | undefined {
  const textWords = significantWords(text)

  const matches = specialties.filter((specialty) =>
    significantWords(specialty).some((specialtyWord) =>
      textWords.some((textWord) => sharesPrefix(textWord, specialtyWord)),
    ),
  )

  return matches.length === 1 ? matches[0] : undefined
}

export function pickListedSpecialty(
  name: string | null | undefined,
  specialties: string[],
): string | undefined {
  if (!name) {
    return undefined
  }

  const wanted = normalize(name).trim()
  return specialties.find((specialty) => normalize(specialty).trim() === wanted)
}
