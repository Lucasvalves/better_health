export const DEFAULT_TIME_ZONE = 'America/Sao_Paulo'

export const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

export type Weekday = (typeof WEEKDAYS)[number]

export type RelativeDay = 'today' | 'tomorrow' | 'day_after_tomorrow'

export type DateTimeParts = {
  relativeDay?: RelativeDay
  weekday?: Weekday
  day?: number
  month?: number
  year?: number
  hour?: number
  minute?: number
}

type WallTime = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

type CalendarDate = Pick<WallTime, 'year' | 'month' | 'day'>

const RELATIVE_DAY_OFFSET: Record<RelativeDay, number> = {
  today: 0,
  tomorrow: 1,
  day_after_tomorrow: 2,
}

function wallTimeAt(utcMs: number, timeZone: string): WallTime {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(utcMs))

  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)!.value)

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  }
}

function wallTimeAsUtcMs(wall: WallTime): number {
  return Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  )
}

function offsetAt(utcMs: number, timeZone: string): number {
  return wallTimeAsUtcMs(wallTimeAt(utcMs, timeZone)) - utcMs
}

function zonedWallTimeToUtcMs(wall: WallTime, timeZone: string): number {
  const guess = wallTimeAsUtcMs(wall)
  const first = guess - offsetAt(guess, timeZone)
  return guess - offsetAt(first, timeZone)
}

function addDays(date: CalendarDate, days: number): CalendarDate {
  const moved = new Date(Date.UTC(date.year, date.month - 1, date.day + days))
  return {
    year: moved.getUTCFullYear(),
    month: moved.getUTCMonth() + 1,
    day: moved.getUTCDate(),
  }
}

function weekdayIndex(date: CalendarDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
}

function isRealDate(date: CalendarDate): boolean {
  const check = new Date(Date.UTC(date.year, date.month - 1, date.day))
  return (
    check.getUTCFullYear() === date.year &&
    check.getUTCMonth() === date.month - 1 &&
    check.getUTCDate() === date.day
  )
}

function compareDates(left: CalendarDate, right: CalendarDate): number {
  return (
    Date.UTC(left.year, left.month - 1, left.day) -
    Date.UTC(right.year, right.month - 1, right.day)
  )
}

function resolveCalendarDate(
  parts: DateTimeParts,
  today: CalendarDate,
): CalendarDate | undefined {
  if (parts.relativeDay) {
    return addDays(today, RELATIVE_DAY_OFFSET[parts.relativeDay])
  }

  if (parts.weekday) {
    const target = WEEKDAYS.indexOf(parts.weekday)
    const distance = ((target - weekdayIndex(today) + 6) % 7) + 1
    return addDays(today, distance)
  }

  if (parts.day === undefined) {
    return undefined
  }

  if (parts.month === undefined) {
    const sameMonth = { year: today.year, month: today.month, day: parts.day }
    const date =
      parts.day >= today.day
        ? sameMonth
        : {
            year: today.month === 12 ? today.year + 1 : today.year,
            month: today.month === 12 ? 1 : today.month + 1,
            day: parts.day,
          }
    return isRealDate(date) ? date : undefined
  }

  if (parts.year !== undefined) {
    const date = { year: parts.year, month: parts.month, day: parts.day }
    return isRealDate(date) ? date : undefined
  }

  const thisYear = { year: today.year, month: parts.month, day: parts.day }

  if (!isRealDate(thisYear)) {
    return undefined
  }

  if (compareDates(thisYear, today) >= 0) {
    return thisYear
  }

  const nextYear = { ...thisYear, year: today.year + 1 }
  return isRealDate(nextYear) ? nextYear : undefined
}

function isValidTime(hour?: number, minute?: number): hour is number {
  return (
    hour !== undefined &&
    Number.isInteger(hour) &&
    hour >= 0 &&
    hour <= 23 &&
    (minute === undefined ||
      (Number.isInteger(minute) && minute >= 0 && minute <= 59))
  )
}

export function resolveDateTime(
  parts: DateTimeParts,
  now: Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): string | undefined {
  if (!isValidTime(parts.hour, parts.minute)) {
    return undefined
  }

  const today = wallTimeAt(now.getTime(), timeZone)
  const date = resolveCalendarDate(parts, today)

  if (!date) {
    return undefined
  }

  const utcMs = zonedWallTimeToUtcMs(
    { ...date, hour: parts.hour, minute: parts.minute ?? 0, second: 0 },
    timeZone,
  )

  return new Date(utcMs).toISOString()
}

export function describeNow(now: Date, timeZone: string = DEFAULT_TIME_ZONE) {
  const wall = wallTimeAt(now.getTime(), timeZone)
  const pad = (value: number) => String(value).padStart(2, '0')

  return {
    date: `${wall.year}-${pad(wall.month)}-${pad(wall.day)}`,
    time: `${pad(wall.hour)}:${pad(wall.minute)}`,
    weekday: WEEKDAYS[weekdayIndex(wall)]!,
    timeZone,
  }
}

export function formatLocalDateTime(
  iso: string,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  const date = new Date(iso)

  const day = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  const wall = wallTimeAt(date.getTime(), timeZone)
  const time =
    wall.minute === 0
      ? `${wall.hour}h`
      : `${wall.hour}h${String(wall.minute).padStart(2, '0')}`

  return `${day} às ${time}`
}
