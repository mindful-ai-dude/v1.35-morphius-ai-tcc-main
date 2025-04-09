import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { Model } from '@/lib/types/models'
import { isProviderEnabled } from '@/lib/utils/registry'
import { cookies } from 'next/headers'

export const maxDuration = 400

const DEFAULT_MODEL: Model = {
  id: 'gemini-2.0-flash',
  name: 'Gemini 2.0 Flash',
  provider: 'Google Generative AI',
  providerId: 'google',
  enabled: true,
  toolCallType: 'native' as const
}

export async function POST(req: Request) {
  try {
    const { messages, id: chatId } = await req.json()
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelJson = cookieStore.get('selectedModel')?.value
    const searchMode = cookieStore.get('search-mode')?.value === 'true'

    let selectedModel = DEFAULT_MODEL

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model
      } catch (e) {
        console.error('Failed to parse selected model:', e)
      }
    }

    if (
      !isProviderEnabled(selectedModel.providerId) ||
      selectedModel.enabled === false
    ) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    // Check if messages contain attachments (PDF or images)
    const messagesHavePDF = messages.some((message: any) =>
      message.experimental_attachments?.some(
        (a: any) => a.contentType === 'application/pdf'
      )
    )

    const messagesHaveImage = messages.some((message: any) =>
      message.experimental_attachments?.some(
        (a: any) => a.contentType?.startsWith('image/')
      )
    )

    const isMultimodalModel = (modelId: string) => {
      return [
        'gemini-2.0-flash',
        'gemini-2.0-flash-thinking-exp-01-21',
        'gemini-2.5-pro-exp-03-25',
        'claude-3-5-sonnet-latest',
        'grok-2-vision-1212'
      ].includes(modelId)
    }

    if ((messagesHavePDF || messagesHaveImage) && !isMultimodalModel(selectedModel.id)) {
      if (messagesHavePDF && messagesHaveImage) {
        return new Response(
          `The selected model does not support both PDF and Image inputs.  Please select a different model.`,
          {
            status: 400,
            statusText: 'Bad Request'
          }
        )
      } else if (messagesHavePDF) {
        return new Response(
          `The selected model does not support PDF inputs. Please select a different model.`,
          {
            status: 400,
            statusText: 'Bad Request'
          }
        )
      } else if (messagesHaveImage) {
        return new Response(
          `The selected model does not support Image inputs. Please select a different model.`,
          {
            status: 400,
            statusText: 'Bad Request'
          }
        )
      }
    }

    const supportsToolCalling = selectedModel.toolCallType === 'native'

    return supportsToolCalling
      ? createToolCallingStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode
        })
      : createManualToolStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode
        })
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}