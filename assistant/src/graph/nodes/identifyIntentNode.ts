import {
  getSystemPrompt,
  getUserPromptTemplate,
  IntentSchema,
} from '../../prompts/v1/identifyIntent.ts'
import { AppointmentService } from '../../services/appointmentService.ts'
import { OpenRouterService } from '../../services/openRouterService.ts'
import type { GraphState } from '../graph.ts'

export function createIdentifyIntentNode(
  llmClient: OpenRouterService,
  appointmentService: AppointmentService,
) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    const input = state.messages.at(-1)!.text

    try {
      const professionals = await appointmentService.listProfessionalsForPrompt()
      const systemPrompt = getSystemPrompt(professionals)
      const userPrompt = getUserPromptTemplate(input)
      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema,
      )

      if (!result.success) {
        return {
          intent: 'unknown',
          error: result.error ?? 'Intent identification failed',
        }
      }

      const intentData = result.data!
      return {
        ...intentData,
      }
    } catch (error) {
      return {
        intent: 'unknown',
        error:
          error instanceof Error
            ? error.message
            : 'Intent identification failed',
      }
    }
  }
}
