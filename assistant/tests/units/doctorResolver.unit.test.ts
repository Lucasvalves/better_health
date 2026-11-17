import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  DoctorSelectionError,
  hasDoctorQuery,
  resolveDoctor,
} from '../../src/services/doctorResolver.ts'
import type { Doctor } from '../../src/services/betterHealthApiClient.ts'

const cardio = { id: 'spec-1', name: 'Cardiologia' }
const derma = { id: 'spec-2', name: 'Dermatologia' }

const doctors: Doctor[] = [
  { id: 'doc-1', name: 'Erica Silva', crm: '12345/SP', specialties_id: 'spec-1', Specialties: cardio },
  { id: 'doc-2', name: 'Paulo Silva', crm: 'CRM-67890', specialties_id: 'spec-1', Specialties: cardio },
  { id: 'doc-3', name: 'Álvaro Mendes', crm: '11111', specialties_id: 'spec-2', Specialties: derma },
]

function selectionError(run: () => unknown): DoctorSelectionError {
  try {
    run()
  } catch (error) {
    assert.ok(error instanceof DoctorSelectionError)
    return error
  }
  throw new Error('Expected DoctorSelectionError')
}

describe('doctor resolver', () => {
  it('finds a doctor by CRM ignoring prefix, case and punctuation', () => {
    assert.equal(resolveDoctor(doctors, { doctorCrm: 'crm 12345 / sp' }).id, 'doc-1')
    assert.equal(resolveDoctor(doctors, { doctorCrm: '67890' }).id, 'doc-2')
  })

  it('does not fall back to the name when the CRM is not found', () => {
    const error = selectionError(() =>
      resolveDoctor(doctors, { doctorCrm: '99999', doctorName: 'Erica Silva' }),
    )

    assert.equal(error.message, 'No doctor found with this CRM')
  })

  it('finds a doctor by name ignoring title, accents and case', () => {
    assert.equal(resolveDoctor(doctors, { doctorName: 'Dra. erica silva' }).id, 'doc-1')
    assert.equal(resolveDoctor(doctors, { doctorName: 'Dr Alvaro' }).id, 'doc-3')
  })

  it('returns the matching doctors when the name is ambiguous', () => {
    const error = selectionError(() => resolveDoctor(doctors, { doctorName: 'Silva' }))

    assert.match(error.message, /More than one doctor/)
    assert.deepEqual(
      error.options.map((option) => option.crm),
      ['12345/SP', 'CRM-67890'],
    )
  })

  it('reports when no doctor has that name', () => {
    const error = selectionError(() => resolveDoctor(doctors, { doctorName: 'Carlos' }))

    assert.equal(error.message, 'No doctor found with this name')
  })

  it('lists the doctors of the specialty instead of picking one', () => {
    const error = selectionError(() =>
      resolveDoctor(doctors, { specialtyName: 'cardiologia' }),
    )

    assert.match(error.message, /must choose one/)
    assert.deepEqual(
      error.options.map((option) => option.name),
      ['Erica Silva', 'Paulo Silva'],
    )
    assert.equal(error.options[0]?.specialty, 'Cardiologia')
  })

  it('lists a single doctor when the specialty has only one', () => {
    const error = selectionError(() =>
      resolveDoctor(doctors, { specialtyName: 'Dermatologia' }),
    )

    assert.equal(error.options.length, 1)
  })

  it('reports when the specialty has no doctors', () => {
    const error = selectionError(() =>
      resolveDoctor(doctors, { specialtyName: 'Neurologia' }),
    )

    assert.equal(error.message, 'No doctor found for this specialty')
    assert.deepEqual(error.options, [])
  })

  it('requires a CRM, a name or a specialty', () => {
    const error = selectionError(() => resolveDoctor(doctors, {}))

    assert.equal(error.message, 'Doctor name, CRM or specialty is required')
    assert.equal(hasDoctorQuery({ doctorName: '  ' }), false)
    assert.equal(hasDoctorQuery({ specialtyName: 'Cardiologia' }), true)
  })

  it('does not expose ids in the options', () => {
    const error = selectionError(() => resolveDoctor(doctors, { specialtyName: 'Cardiologia' }))

    assert.equal(JSON.stringify(error.options).includes('doc-'), false)
    assert.equal(JSON.stringify(error.options).includes('spec-'), false)
  })
})
