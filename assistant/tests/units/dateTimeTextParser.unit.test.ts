import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  mergeDateTimeParts,
  parseDateTimeFromText,
} from '../../src/services/dateTimeTextParser.ts'
import { resolveDateTime } from '../../src/services/dateTimeResolver.ts'

const NOW = new Date('2026-11-17T12:44:00.000Z')
const TZ = 'America/Sao_Paulo'

function resolve(text: string) {
  return resolveDateTime(parseDateTimeFromText(text), NOW, TZ)
}

describe('date time text parser', () => {
  it('reads the messages that failed in the real conversation', () => {
    assert.equal(
      resolve(
        'Olá, meu nome é Lucas, meu cpf é 06461740538 e eu gostaria de marcar um medico clinico amanhã as 11 horas.',
      ),
      '2026-11-18T14:00:00.000Z',
    )
    assert.equal(resolve('Amanhã as 14 horas'), '2026-11-18T17:00:00.000Z')
  })

  it('reads relative days', () => {
    assert.equal(resolve('quero amanhã às 10'), '2026-11-18T13:00:00.000Z')
    assert.equal(resolve('hoje ao meio dia'), '2026-11-17T15:00:00.000Z')
    assert.equal(resolve('hoje ao meio-dia'), '2026-11-17T15:00:00.000Z')
    assert.equal(resolve('depois de amanhã às 8h'), '2026-11-19T11:00:00.000Z')
    assert.equal(resolve('amanhã à meia-noite'), '2026-11-18T03:00:00.000Z')
  })

  it('reads weekdays', () => {
    assert.equal(resolve('sexta às 14h30'), '2026-11-20T17:30:00.000Z')
    assert.equal(resolve('na segunda-feira às 9 horas'), '2026-11-23T12:00:00.000Z')
    assert.equal(resolve('sábado às 10:15'), '2026-11-21T13:15:00.000Z')
  })

  it('reads explicit dates', () => {
    assert.equal(resolve('dia 20/11 às 10h'), '2026-11-20T13:00:00.000Z')
    assert.equal(resolve('dia 20 às 10h'), '2026-11-20T13:00:00.000Z')
    assert.equal(resolve('20 de dezembro às 15h'), '2026-12-20T18:00:00.000Z')
    assert.equal(resolve('5/3/2027 às 9h'), '2027-03-05T12:00:00.000Z')
    assert.equal(resolve('em 5 de março de 2027 às 9h'), '2027-03-05T12:00:00.000Z')
  })

  it('reads the different ways of writing the time', () => {
    assert.deepEqual(parseDateTimeFromText('amanhã 11h'), { relativeDay: 'tomorrow', hour: 11, minute: 0 })
    assert.deepEqual(parseDateTimeFromText('amanhã 11 hrs'), { relativeDay: 'tomorrow', hour: 11, minute: 0 })
    assert.deepEqual(parseDateTimeFromText('amanhã 14h30'), { relativeDay: 'tomorrow', hour: 14, minute: 30 })
    assert.deepEqual(parseDateTimeFromText('amanhã 14:45'), { relativeDay: 'tomorrow', hour: 14, minute: 45 })
    assert.deepEqual(parseDateTimeFromText('amanhã 9 horas e meia'), { relativeDay: 'tomorrow', hour: 9, minute: 30 })
    assert.deepEqual(parseDateTimeFromText('amanhã às 14'), { relativeDay: 'tomorrow', hour: 14, minute: 0 })
  })

  it('uses the period of the day', () => {
    assert.equal(parseDateTimeFromText('amanhã às 3 da tarde').hour, 15)
    assert.equal(parseDateTimeFromText('hoje às 8 da noite').hour, 20)
    assert.equal(parseDateTimeFromText('amanhã às 9 da manhã').hour, 9)
    assert.equal(parseDateTimeFromText('amanhã às 14 da tarde').hour, 14)
  })

  it('does not take the period from a greeting', () => {
    assert.equal(parseDateTimeFromText('Boa tarde, quero amanhã às 10').hour, 10)
    assert.equal(parseDateTimeFromText('Boa noite! amanhã às 9h').hour, 9)
  })

  it('does not mistake the CPF or a date for a time', () => {
    assert.deepEqual(parseDateTimeFromText('meu cpf é 06461740538 e quero amanhã'), {
      relativeDay: 'tomorrow',
    })
    assert.deepEqual(parseDateTimeFromText('cpf 064.617.405-38'), {})
    assert.deepEqual(parseDateTimeFromText('dia 20/11'), { day: 20, month: 11 })
  })

  it('returns nothing when there is no date or time', () => {
    assert.deepEqual(parseDateTimeFromText('quero marcar uma consulta'), {})
    assert.deepEqual(parseDateTimeFromText('Dra. Erica Silva'), {})
  })

  it('ignores invalid hours and dates', () => {
    assert.equal(parseDateTimeFromText('amanhã às 25h').hour, undefined)
    assert.equal(parseDateTimeFromText('amanhã 10h75').hour, undefined)
    assert.equal(parseDateTimeFromText('dia 40/13').day, undefined)
  })

  it('prefers the text over the model, part by part', () => {
    assert.deepEqual(
      mergeDateTimeParts(
        { relativeDay: 'tomorrow', hour: 11, minute: 0 },
        { weekday: 'friday', hour: 9 },
      ),
      {
        relativeDay: 'tomorrow',
        weekday: undefined,
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 11,
        minute: 0,
      },
    )
  })

  it('fills only the missing part with what the model understood', () => {
    const merged = mergeDateTimeParts(
      { hour: 14, minute: 0 },
      { relativeDay: 'tomorrow', hour: 9 },
    )

    assert.equal(merged.relativeDay, 'tomorrow')
    assert.equal(merged.hour, 14)
  })
})
