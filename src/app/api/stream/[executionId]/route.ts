import { NextRequest } from 'next/server'
import { subscribeToExecution } from '@/lib/squad-runner'
import { SSEEvent } from '@/types'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/stream/[executionId]'>) {
  const { executionId } = await ctx.params

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const send = (event: SSEEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        } catch {
          // connection closed
        }
      }

      const unsubscribe = subscribeToExecution(executionId, (event) => {
        send(event)

        if (event.type === 'squad_done' || event.type === 'error') {
          try {
            controller.close()
          } catch {
            // already closed
          }
          unsubscribe()
        }
      })

      // Auto-close after 5 minutes if no done event received
      const timeout = setTimeout(() => {
        unsubscribe()
        try {
          controller.close()
        } catch {
          // already closed
        }
      }, 5 * 60 * 1000)

      return () => {
        clearTimeout(timeout)
        unsubscribe()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
