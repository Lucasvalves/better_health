import type { DateTimeParts, Weekday } from './dateTimeResolver.ts'

const WEEKDAY_BY_WORD: Record<string, Weekday> = {
  domingo: 'sunday',
  segunda: 'monday',
  terca: 'tuesday',
  quarta: 'wednesday',
  quinta: 'thursday',
  sexta: 'friday',
  sabado: 'saturday',
}

const MONTHS = [
  'janeiro',
  'fevereiro',
  'marco',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const MONTH_PATTERN = MONTHS.join('|')
const WEEKDAY_PATTERN = Object.keys(WEEKDAY_BY_WORD).join('|')

type DateParts = Pick<
  DateTimeParts,
  'relativeDay' | 'weekday' | 'day' | 'month' | 'year'
>
type TimeParts = Pick<DateTimeParts, 'hour' | 'minute'>

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function fullYear(value: string): number {
  const year = Number(value)
  return value.length === 2 ? 2000 + year : year
}

function isDayAndMonth(day: number, month: number): boolean {
  return day >= 1 && day <= 31 && month >= 1 && month <= 12
}

function parseDate(text: string): DateParts {
  if (/\bdepois de amanha\b/.test(text)) {
    return { relativeDay: 'day_after_tomorrow' }
  }

  if (/\bamanha\b/.test(text)) {
    return { relativeDay: 'tomorrow' }
  }

  if (/\bhoje\b/.test(text)) {
    return { relativeDay: 'today' }
  }

  const slash = text.match(
    /(?<![\d/])(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?(?![\d/])/,
  )

  if (slash && isDayAndMonth(Number(slash[1]), Number(slash[2]))) {
    return {
      day: Number(slash[1]),
      month: Number(slash[2]),
      ...(slash[3] ? { year: fullYear(slash[3]) } : {}),
    }
  }

  const written = text.match(
    new RegExp(
      `(?<!\\d)(\\d{1,2})\\s+de\\s+(${MONTH_PATTERN})(?:\\s+de\\s+(\\d{4}))?\\b`,
    ),
  )

  if (written) {
    return {
      day: Number(written[1]),
      month: MONTHS.indexOf(written[2]!) + 1,
      ...(written[3] ? { year: Number(written[3]) } : {}),
    }
  }

  const dayOnly = text.match(/\bdia\s+(\d{1,2})(?![\d/])/)

  if (dayOnly && Number(dayOnly[1]) >= 1 && Number(dayOnly[1]) <= 31) {
    return { day: Number(dayOnly[1]) }
  }

  const weekday = text.match(
    new RegExp(`\\b(${WEEKDAY_PATTERN})(?:[- ]feira)?\\b`),
  )

  if (weekday) {
    return { weekday: WEEKDAY_BY_WORD[weekday[1]!]! }
  }

  return {}
}

function isTime(hour: number, minute: number): boolean {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
}

function toMinute(value: string | undefined): number {
  if (!value) return 0
  return value === 'meia' ? 30 : Number(value)
}

function matchClock(text: string): TimeParts | undefined {
  if (/\bmeio[- ]dia\b/.test(text)) {
    return { hour: 12, minute: 0 }
  }

  if (/\bmeia[- ]noite\b/.test(text)) {
    return { hour: 0, minute: 0 }
  }

  const colon = text.match(/(?<![\d:/.,])(\d{1,2}):(\d{2})(?![\d:])/)

  if (colon && isTime(Number(colon[1]), Number(colon[2]))) {
    return { hour: Number(colon[1]), minute: Number(colon[2]) }
  }

  const unit = text.match(
    /(?<![\d/.,:])(\d{1,2})\s?(?:horas?|hrs?|hs|h)(?![a-z])(?:(\d{2})(?![\d/:])|\s+e\s+(\d{2}|meia)(?![\d/:]))?/,
  )

  if (unit) {
    const hour = Number(unit[1])
    const minute = toMinute(unit[2] ?? unit[3])

    if (isTime(hour, minute)) {
      return { hour, minute }
    }
  }

  const at = text.match(/\b(?:as|das|pelas)\s+(\d{1,2})(?![\d/:.])/)

  if (at && isTime(Number(at[1]), 0)) {
    return { hour: Number(at[1]), minute: 0 }
  }

  return undefined
}

function parseTime(text: string): TimeParts {
  const clock = matchClock(text)

  if (!clock) {
    return {}
  }

  const period = text.replace(/\bboa (tarde|noite)\b/g, ' ')
  const afternoonOrNight = /\b(tarde|noite)\b/.test(period)
  const hour = clock.hour!

  if (afternoonOrNight && hour >= 1 && hour <= 11) {
    return { hour: hour + 12, minute: clock.minute }
  }

  if (/\bnoite\b/.test(period) && hour === 12) {
    return { hour: 0, minute: clock.minute }
  }

  return clock
}

export function parseDateTimeFromText(text: string): DateTimeParts {
  const normalized = normalize(text)
  return { ...parseDate(normalized), ...parseTime(normalized) }
}

const DATE_KEYS = ['relativeDay', 'weekday', 'day', 'month', 'year'] as const

export function mergeDateTimeParts(
  fromText: DateTimeParts,
  fromModel: DateTimeParts,
): DateTimeParts {
  const textHasDate = DATE_KEYS.some((key) => fromText[key] !== undefined)
  const textHasTime = fromText.hour !== undefined

  const date: DateParts = textHasDate
    ? {
        relativeDay: fromText.relativeDay,
        weekday: fromText.weekday,
        day: fromText.day,
        month: fromText.month,
        year: fromText.year,
      }
    : {
        relativeDay: fromModel.relativeDay,
        weekday: fromModel.weekday,
        day: fromModel.day,
        month: fromModel.month,
        year: fromModel.year,
      }

  const time: TimeParts = textHasTime
    ? { hour: fromText.hour, minute: fromText.minute }
    : { hour: fromModel.hour, minute: fromModel.minute }

  return { ...date, ...time }
}
