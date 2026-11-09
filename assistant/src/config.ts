export type ModelConfig = {
  apiKey: string
  httpReferer: string
  xTitle: string
  betterHealthApiUrl: string
  /** Optional fallback for local/studio when request has no token. Never commit a real JWT. */
  betterHealthDevToken: string

  provider: {
    sort: {
      by: string
      partition: string
    }
  }

  models: string[]
  temperature: number
}

console.assert(
  process.env.OPENROUTER_API_KEY,
  'OPENROUTER_API_KEY is not set in environment variables',
)

export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: '',
  xTitle: 'Better Health Assistant',
  betterHealthApiUrl:
    process.env.BETTER_HEALTH_API_URL ?? 'http://localhost:3333',
  betterHealthDevToken: process.env.BETTER_HEALTH_DEV_TOKEN ?? '',
  models: [
    // https://openrouter.ai/models?fmt=cards&max_price=0&supported_parameters=response_format
    'nvidia/nemotron-3.5-super-vl:free',
  ],
  provider: {
    sort: {
      by: 'throughput',
      partition: 'none',
    },
  },
  temperature: 0.7,
}
