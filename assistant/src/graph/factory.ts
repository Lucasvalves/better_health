import { config } from '../config.ts'
import { AppointmentService } from '../services/appointmentService.ts'
import { OpenRouterService } from '../services/openRouterService.ts'
import { buildAppointmentGraph } from './graph.ts'

export function resolveAuthToken(authToken?: string): string {
  const token = authToken?.trim() || config.betterHealthDevToken.trim()
  if (!token) {
    throw new Error(
      'Better Health auth token is required. Pass token in /chat or set BETTER_HEALTH_DEV_TOKEN in .env for local/studio tests.',
    )
  }
  return token
}

export function buildGraph(authToken?: string) {
  const token = resolveAuthToken(authToken)
  const llmClient = new OpenRouterService(config)
  const appointmentService = new AppointmentService({
    baseUrl: config.betterHealthApiUrl,
    authToken: token,
  })
  return buildAppointmentGraph(llmClient, appointmentService)
}

export const graph = async (runtime?: {
  configurable?: { authToken?: string }
}) => {
  return buildGraph(runtime?.configurable?.authToken)
}
