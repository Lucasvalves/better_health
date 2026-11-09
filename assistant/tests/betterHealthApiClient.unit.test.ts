import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  BetterHealthApiClient,
  BetterHealthApiError,
} from '../src/services/betterHealthApiClient.ts'

describe('BetterHealthApiClient', () => {
  it('sends Authorization bearer token and parses JSON', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []

    const fetchFn: typeof fetch = async (input, init) => {
      calls.push({ url: String(input), init })
      return new Response(
        JSON.stringify([{ id: 'doc-1', name: 'Dr. Test', crm: '123', specialties_id: 'spec-1' }]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const client = new BetterHealthApiClient(
      'http://localhost:3333',
      'jwt-token',
      fetchFn,
    )

    const doctors = await client.listDoctors()

    assert.equal(calls.length, 1)
    assert.equal(calls[0]?.url, 'http://localhost:3333/doctors')
    assert.equal(
      (calls[0]?.init?.headers as Record<string, string>).Authorization,
      'Bearer jwt-token',
    )
    assert.equal(doctors[0]?.id, 'doc-1')
  })

  it('throws BetterHealthApiError with API message on failure', async () => {
    const fetchFn: typeof fetch = async () =>
      new Response(JSON.stringify({ message: 'Invalid patient' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })

    const client = new BetterHealthApiClient(
      'http://localhost:3333',
      'jwt-token',
      fetchFn,
    )

    await assert.rejects(
      () =>
        client.createAppointment({
          patients_id: 'p1',
          specialties_id: 's1',
          doctors_id: 'd1',
          date: new Date().toISOString(),
        }),
      (error: unknown) => {
        assert.ok(error instanceof BetterHealthApiError)
        assert.equal(error.message, 'Invalid patient')
        assert.equal(error.status, 400)
        return true
      },
    )
  })
})
