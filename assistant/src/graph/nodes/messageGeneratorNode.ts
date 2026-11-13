import {
  getSystemPrompt,
  getUserPromptTemplate,
  MessageSchema,
} from '../../prompts/v1/messageGenerator.ts'
import { SAFETY_ALERT_MESSAGE } from '../../prompts/v1/safetyAlert.ts'
import { OpenRouterService } from '../../services/openRouterService.ts'
import type { GraphState } from '../graph.ts'
import { AIMessage } from 'langchain'

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function createMessageGeneratorNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    if (state.safetyAlert) {
      return {
        messages: [...state.messages, new AIMessage(SAFETY_ALERT_MESSAGE)],
      }
    }

    try {
      const hasSucceeded = state.actionSuccess ? 'success' : 'error'
      const scenario =
        state.intent && state.intent !== 'unknown'
          ? `${state.intent}_${hasSucceeded}`
          : 'unknown'
      const confirmed = state.appointmentData as { date?: string } | undefined
      const details = {
        doctorName: state.doctorName,
        datetime: confirmed?.date ?? state.datetime,
        patientName: state.patientName,
        ...(state.actionSuccess
          ? {}
          : { error: state.actionError ?? state.error }),
      }

      const systemPrompt = getSystemPrompt()
      const userPrompt = getUserPromptTemplate({ scenario, details })

      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        MessageSchema,
      )

      if (
        result.error ||
        !result.data?.message ||
        UUID_PATTERN.test(result.data.message)
      ) {
        return {
          messages: [
            ...state.messages,
            new AIMessage(
              'Desculpe, não consegui gerar a resposta agora. Tente novamente.',
            ),
          ],
        }
      }

      return {
        messages: [...state.messages, new AIMessage(result.data.message)],
      }
    } catch {
      return {
        messages: [
          ...state.messages,
          new AIMessage(
            'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
          ),
        ],
      }
    }
  }
}
