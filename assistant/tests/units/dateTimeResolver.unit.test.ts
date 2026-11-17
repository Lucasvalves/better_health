import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  describeNow,
  formatLocalDateTime,
  resolveDateTime,
} from '../../src/services/dateTimeResolver.ts'

const TZ = 'America/Sao_Paulo'
const TUESDAY_MORNING = new Date('2026-11-17T12:44:00.000Z')
const TUESDAY_LATE_NIGHT = new Date('2026-11-18T01:30:00.000Z')

describe('date time resolver', () => {
  it('resolves "amanhã às 10" in the clinic time zone', () => {
    assert.equal(
      resolveDateTime({ relativeDay: 'tomorrow', hour: 10 }, TUESDAY_MORNING, TZ),
      '2026-11-18T13:00:00.000Z',
    )
  })

  it('resolves "hoje ao meio-dia"', () => {
    assert.equal(
      resolveDateTime({ relativeDay: 'today', hour: 12 }, TUESDAY_MORNING, TZ),
      '2026-11-17T15:00:00.000Z',
    )
  })

  it('resolves "depois de amanhã" and midnight', () => {
    assert.equal(
      resolveDateTime({ relativeDay: 'day_after_tomorrow', hour: 0 }, TUESDAY_MORNING, TZ),
      '2026-11-19T03:00:00.000Z',
    )
  })

  it('uses the local day when UTC is already the next day', () => {
    assert.equal(
      resolveDateTime({ relativeDay: 'today', hour: 23 }, TUESDAY_LATE_NIGHT, TZ),
      '2026-11-18T02:00:00.000Z',
    )
    assert.equal(
      resolveDateTime({ relativeDay: 'tomorrow', hour: 10 }, TUESDAY_LATE_NIGHT, TZ),
      '2026-11-18T13:00:00.000Z',
    )
  })

  it('resolves the next weekday, never today', () => {
    assert.equal(
      resolveDateTime({ weekday: 'friday', hour: 14, minute: 30 }, TUESDAY_MORNING, TZ),
      '2026-11-20T17:30:00.000Z',
    )
    assert.equal(
      resolveDateTime({ weekday: 'tuesday', hour: 9 }, TUESDAY_MORNING, TZ),
      '2026-11-24T12:00:00.000Z',
    )
    assert.equal(
      resolveDateTime({ weekday: 'monday', hour: 9 }, TUESDAY_MORNING, TZ),
      '2026-11-23T12:00:00.000Z',
    )
  })

  it('resolves a day of the month without month', () => {
    assert.equal(
      resolveDateTime({ day: 20, hour: 10 }, TUESDAY_MORNING, TZ),
      '2026-11-20T13:00:00.000Z',
    )
    assert.equal(
      resolveDateTime({ day: 17, hour: 15 }, TUESDAY_MORNING, TZ),
      '2026-11-17T18:00:00.000Z',
    )
  })

  it('moves a past day of the month to the next month', () => {
    assert.equal(
      resolveDateTime({ day: 10, hour: 10 }, TUESDAY_MORNING, TZ),
      '2026-12-10T13:00:00.000Z',
    )
  })

  it('resolves day and month, moving to next year when already past', () => {
    assert.equal(
      resolveDateTime({ day: 25, month: 12, hour: 8 }, TUESDAY_MORNING, TZ),
      '2026-12-25T11:00:00.000Z',
    )
    assert.equal(
      resolveDateTime({ day: 20, month: 2, hour: 10 }, TUESDAY_MORNING, TZ),
      '2027-02-20T13:00:00.000Z',
    )
  })

  it('respects an explicit year', () => {
    assert.equal(
      resolveDateTime({ day: 5, month: 3, year: 2027, hour: 9 }, TUESDAY_MORNING, TZ),
      '2027-03-05T12:00:00.000Z',
    )
  })

  it('returns nothing for dates that do not exist', () => {
    assert.equal(resolveDateTime({ day: 31, month: 2, hour: 9 }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({ day: 31, hour: 9 }, TUESDAY_MORNING, TZ), undefined)
  })

  it('returns nothing when the date or the time is missing', () => {
    assert.equal(resolveDateTime({ relativeDay: 'tomorrow' }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({ hour: 10 }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({}, TUESDAY_MORNING, TZ), undefined)
  })

  it('returns nothing for invalid hour or minute', () => {
    assert.equal(resolveDateTime({ relativeDay: 'today', hour: 25 }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({ relativeDay: 'today', hour: -1 }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({ relativeDay: 'today', hour: 10, minute: 60 }, TUESDAY_MORNING, TZ), undefined)
    assert.equal(resolveDateTime({ relativeDay: 'today', hour: 10.5 }, TUESDAY_MORNING, TZ), undefined)
  })

  it('follows the configured time zone', () => {
    assert.equal(
      resolveDateTime({ relativeDay: 'tomorrow', hour: 10 }, TUESDAY_MORNING, 'UTC'),
      '2026-11-18T10:00:00.000Z',
    )
  })

  it('describes the current moment in the local time zone', () => {
    assert.deepEqual(describeNow(TUESDAY_LATE_NIGHT, TZ), {
      date: '2026-11-17',
      time: '22:30',
      weekday: 'tuesday',
      timeZone: TZ,
    })
  })

  it('formats a date in the local time zone for the user', () => {
    assert.equal(
      formatLocalDateTime('2026-11-18T13:00:00.000Z', TZ),
      'quarta-feira, 18 de novembro de 2026 às 10h',
    )
    assert.equal(
      formatLocalDateTime('2026-11-20T17:30:00.000Z', TZ),
      'sexta-feira, 20 de novembro de 2026 às 14h30',
    )
  })
})
