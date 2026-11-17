import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  findSpecialtyInText,
  pickListedSpecialty,
} from '../../src/services/specialtyMatcher.ts'

const SPECIALTIES = ['Clínico Geral', 'Cardiologia', 'Dermatologia', 'Pediatria']

describe('specialty matcher', () => {
  it('finds the specialty from the kind of doctor the user asked', () => {
    assert.equal(findSpecialtyInText('marcar um medico clinico amanhã', SPECIALTIES), 'Clínico Geral')
    assert.equal(findSpecialtyInText('preciso de um cardiologista', SPECIALTIES), 'Cardiologia')
    assert.equal(findSpecialtyInText('quero uma Dermatologista', SPECIALTIES), 'Dermatologia')
    assert.equal(findSpecialtyInText('consulta de pediatria', SPECIALTIES), 'Pediatria')
  })

  it('does not match on generic words', () => {
    assert.equal(findSpecialtyInText('quero marcar uma consulta com um médico', SPECIALTIES), undefined)
  })

  it('does not match when the specialty is not in the list', () => {
    assert.equal(findSpecialtyInText('preciso de um neurologista', SPECIALTIES), undefined)
  })

  it('does not choose when more than one specialty fits', () => {
    assert.equal(
      findSpecialtyInText('cardiologia ou dermatologia', SPECIALTIES),
      undefined,
    )
  })

  it('accepts a model specialty only when it is in the list', () => {
    assert.equal(pickListedSpecialty('cardiologia', SPECIALTIES), 'Cardiologia')
    assert.equal(pickListedSpecialty('Clinico geral', SPECIALTIES), 'Clínico Geral')
    assert.equal(pickListedSpecialty('Neurologia', SPECIALTIES), undefined)
    assert.equal(pickListedSpecialty(undefined, SPECIALTIES), undefined)
    assert.equal(pickListedSpecialty(null, SPECIALTIES), undefined)
  })
})
