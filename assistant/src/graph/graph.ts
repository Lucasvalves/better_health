import {
  StateGraph,
  START,
  END,
  MessagesZodMeta,
} from '@langchain/langgraph'
import { withLangGraph } from '@langchain/langgraph/zod'
import type { BaseMessage } from '@langchain/core/messages'

import { createSchedulerNode } from './nodes/schedulerNode.ts'
import { createCancellerNode } from './nodes/cancellerNode.ts'
import {
  createIdentifyIntentNode,
  type ClockOptions,
} from './nodes/identifyIntentNode.ts'
import { createMessageGeneratorNode } from './nodes/messageGeneratorNode.ts'

import { z } from 'zod/v3'
import { OpenRouterService } from '../services/openRouterService.ts'
import { AppointmentService } from '../services/appointmentService.ts'

const AppointmentStateAnnotation = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),

  intent: z.enum(['schedule', 'cancel', 'unknown']).optional(),
  safetyAlert: z.boolean().optional(),
  doctorName: z.string().optional(),
  doctorCrm: z.string().optional(),
  specialtyName: z.string().optional(),
  doctorOptions: z
    .array(
      z.object({ name: z.string(), crm: z.string(), specialty: z.string() }),
    )
    .optional(),
  datetime: z.string().optional(),
  patientName: z.string().optional(),
  patientCpf: z.string().optional(),
  appointmentId: z.string().optional(),
  reason: z.string().optional(),

  actionSuccess: z.boolean().optional(),
  actionError: z.string().optional(),
  appointmentData: z.any().optional(),

  error: z.string().optional(),
})

export type GraphState = z.infer<typeof AppointmentStateAnnotation>

export function buildAppointmentGraph(
  llmClient: OpenRouterService,
  appointmentService: AppointmentService,
  clock: ClockOptions = {},
) {
  const workflow = new StateGraph({
    stateSchema: AppointmentStateAnnotation,
  })
    .addNode(
      'identifyIntent',
      createIdentifyIntentNode(llmClient, appointmentService, clock),
    )
    .addNode('schedule', createSchedulerNode(appointmentService, clock.now))
    .addNode('cancel', createCancellerNode(appointmentService))
    .addNode('message', createMessageGeneratorNode(llmClient, clock.timeZone))
    .addEdge(START, 'identifyIntent')
    .addConditionalEdges(
      'identifyIntent',
      (state: GraphState): string => {
        if (
          state.safetyAlert ||
          state.error ||
          !state.intent ||
          state.intent === 'unknown'
        ) {
          return 'message'
        }
        return state.intent
      },
      {
        schedule: 'schedule',
        cancel: 'cancel',
        message: 'message',
      },
    )
    .addEdge('schedule', 'message')
    .addEdge('cancel', 'message')
    .addEdge('message', END)

  return workflow.compile()
}
