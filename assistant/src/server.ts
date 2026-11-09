import { HumanMessage } from 'langchain'
import { buildGraph } from './graph/factory.ts'

import Fastify from 'fastify'

export type BuildGraphFn = typeof buildGraph

export const createServer = (deps?: { buildGraph?: BuildGraphFn }) => {
  const app = Fastify()
  const createGraph = deps?.buildGraph ?? buildGraph

  app.post(
    '/chat',
    {
      schema: {
        body: {
          type: 'object',
          required: ['question', 'token'],
          properties: {
            question: { type: 'string', minLength: 10 },
            token: { type: 'string', minLength: 1 },
          },
        },
      },
    },
    async function (request, reply) {
      try {
        const { question, token } = request.body as {
          question: string
          token: string
        }

        const compiledGraph = createGraph(token)
        const response = await compiledGraph.invoke({
          messages: [new HumanMessage(question)],
        })

        return {
          intent: response.intent,
          actionSuccess: response.actionSuccess,
          actionError: response.actionError,
          error: response.error,
          doctorName: response.doctorName,
          datetime: response.datetime,
          patientName: response.patientName,
          appointmentData: response.appointmentData,
          messages: response.messages,
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'An error occurred while processing your request.'

        if (
          message.toLowerCase().includes('unauthorized') ||
          message.toLowerCase().includes('token')
        ) {
          return reply.status(401).send({
            error: 'Unauthorized',
          })
        }

        return reply.status(500).send({
          error: 'An error occurred while processing your request.',
        })
      }
    },
  )

  return app
}
