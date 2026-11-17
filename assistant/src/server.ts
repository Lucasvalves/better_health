import { AIMessage, HumanMessage } from 'langchain'
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
            question: { type: 'string', minLength: 1 },
            token: { type: 'string', minLength: 1 },
            history: {
              type: 'array',
              maxItems: 10,
              items: {
                type: 'object',
                required: ['role', 'content'],
                properties: {
                  role: { type: 'string', enum: ['user', 'assistant'] },
                  content: { type: 'string', minLength: 1, maxLength: 2000 },
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      try {
        const { question, token, history = [] } = request.body as {
          question: string
          token: string
          history?: Array<{ role: 'user' | 'assistant'; content: string }>
        }

        const compiledGraph = createGraph(token)
        const response = await compiledGraph.invoke({
          messages: [
            ...history.map((message) =>
              message.role === 'user'
                ? new HumanMessage(message.content)
                : new AIMessage(message.content),
            ),
            new HumanMessage(question),
          ],
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
