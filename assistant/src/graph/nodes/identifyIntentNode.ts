import {
  getSystemPrompt,
  getUserPromptTemplate,
  IntentSchema,
  type ConversationMessage,
} from '../../prompts/v1/identifyIntent.ts'
import { AppointmentService } from '../../services/appointmentService.ts'
import {
  DEFAULT_TIME_ZONE,
  describeNow,
  resolveDateTime,
} from '../../services/dateTimeResolver.ts'
import {
  mergeDateTimeParts,
  parseDateTimeFromText,
} from '../../services/dateTimeTextParser.ts'
import { OpenRouterService } from '../../services/openRouterService.ts'
import {
  findSpecialtyInText,
  pickListedSpecialty,
} from '../../services/specialtyMatcher.ts'
import type { GraphState } from '../graph.ts'

export type ClockOptions = {
  timeZone?: string
  now?: () => Date
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const HISTORY_LIMIT = 6
const HISTORY_MESSAGE_MAX_LENGTH = 500

const RESET_RUN_STATE: Partial<GraphState> = {
  intent: undefined,
  safetyAlert: undefined,
  doctorName: undefined,
  doctorCrm: undefined,
  specialtyName: undefined,
  doctorOptions: undefined,
  datetime: undefined,
  patientName: undefined,
  patientCpf: undefined,
  appointmentId: undefined,
  reason: undefined,
  actionSuccess: undefined,
  actionError: undefined,
  appointmentData: undefined,
  error: undefined,
}

function buildHistory(messages: GraphState['messages']): ConversationMessage[] {
  return messages
    .slice(-(HISTORY_LIMIT + 1), -1)
    .filter((message) => message.type === 'human' || message.type === 'ai')
    .map((message) => ({
      role: message.type === 'human' ? ('user' as const) : ('assistant' as const),
      content: message.text.slice(0, HISTORY_MESSAGE_MAX_LENGTH),
    }))
}

export function createIdentifyIntentNode(
  llmClient: OpenRouterService,
  appointmentService: AppointmentService,
  clock: ClockOptions = {},
) {
  const timeZone = clock.timeZone ?? DEFAULT_TIME_ZONE
  const now = clock.now ?? (() => new Date())

  return async (state: GraphState): Promise<Partial<GraphState>> => {
    const input = state.messages.at(-1)!.text
    const history = buildHistory(state.messages)

    try {
      const specialties = await appointmentService.listSpecialtyNamesForPrompt()
      const currentTime = now()
      const systemPrompt = getSystemPrompt(
        specialties,
        describeNow(currentTime, timeZone),
      )
      const userPrompt = getUserPromptTemplate(input, history)
      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema,
      )

      if (!result.success) {
        return {
          ...RESET_RUN_STATE,
          intent: 'unknown',
          error: result.error ?? 'Intent identification failed',
        }
      }

      const {
        relativeDay,
        weekday,
        day,
        month,
        year,
        hour,
        minute,
        ...intentData
      } = result.data!

      const dateTimeParts = mergeDateTimeParts(parseDateTimeFromText(input), {
        relativeDay: relativeDay ?? undefined,
        weekday: weekday ?? undefined,
        day: day ?? undefined,
        month: month ?? undefined,
        year: year ?? undefined,
        hour: hour ?? undefined,
        minute: minute ?? undefined,
      })

      return {
        ...RESET_RUN_STATE,
        ...intentData,
        specialtyName:
          findSpecialtyInText(input, specialties) ??
          pickListedSpecialty(intentData.specialtyName, specialties),
        appointmentId: UUID_PATTERN.test(intentData.appointmentId ?? '')
          ? intentData.appointmentId
          : undefined,
        datetime: resolveDateTime(dateTimeParts, currentTime, timeZone),
      }
    } catch (error) {
      return {
        ...RESET_RUN_STATE,
        intent: 'unknown',
        error:
          error instanceof Error
            ? error.message
            : 'Intent identification failed',
      }
    }
  }
}
