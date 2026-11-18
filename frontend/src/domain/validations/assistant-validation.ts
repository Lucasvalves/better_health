import { z } from 'zod'

export const ASSISTANT_MAX_MESSAGE_LENGTH = 2000
export const ASSISTANT_MAX_HISTORY = 10

export const assistantRequestSchema = z.object({
  question: z.string().trim().min(1).max(ASSISTANT_MAX_MESSAGE_LENGTH),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(ASSISTANT_MAX_MESSAGE_LENGTH)
      })
    )
    .max(ASSISTANT_MAX_HISTORY)
    .default([])
})

export type AssistantRequest = z.infer<typeof assistantRequestSchema>
