import { z } from 'zod'

export interface ToolCall<T = unknown> {
  tool: string
  parameters?: T
}

function getTagContent(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 's'))
  return match ? match[1].trim() : ''
}

export function parseToolCallXml<T>(
  xml: string,
  schema?: z.ZodType<T>
): ToolCall<T> {
  const toolCallContent = getTagContent(xml, 'tool_call')
  if (!toolCallContent) {
    console.warn('No tool_call tag found in response')
    return { tool: '' }
  }

  const tool = getTagContent(toolCallContent, 'tool')
  if (!tool) return { tool: '' }

  const parametersXml = getTagContent(toolCallContent, 'parameters')
  if (!parametersXml || !schema) return { tool }

  // Extract all parameter values using tag names from schema
  const rawParameters: Record<string, string> = {}

  try {
    if (schema instanceof z.ZodObject) {
      Object.keys(schema.shape).forEach(key => {
        const value = getTagContent(parametersXml, key)
        if (value) rawParameters[key] = value
      })
    }

    // Prepare parameters with required defaults
    const preparedParameters = {
      ...rawParameters,
      // Convert comma-separated strings to arrays for array fields with default empty arrays
      include_domains:
        rawParameters.include_domains
          ?.split(',')
          .map(d => d.trim())
          .filter(Boolean) ?? [],
      exclude_domains:
        rawParameters.exclude_domains
          ?.split(',')
          .map(d => d.trim())
          .filter(Boolean) ?? [],
      // Convert string to number for numeric fields
      max_results: rawParameters.max_results
        ? parseInt(rawParameters.max_results, 10)
        : undefined
    }

    // Ensure defaults for arrays
    if (!preparedParameters.include_domains) {
      preparedParameters.include_domains = []
    }
    if (!preparedParameters.exclude_domains) {
      preparedParameters.exclude_domains = []
    }

    // Parse parameters using the provided schema
    const parameters = schema.parse(preparedParameters)

    return { tool, parameters }
  } catch (error) {
    console.error('Failed to parse parameters:', error)
    // For tool="search", return default parameters
    if (tool === 'search' && schema) {
      try {
        // Return with empty defaults for required fields
        const defaultParameters = schema.parse({
          query: rawParameters?.query || 'general search',
          include_domains: [],
          exclude_domains: []
        })
        return { tool, parameters: defaultParameters }
      } catch (e) {
        console.error('Failed to create default parameters:', e)
      }
    }
    return { tool }
  }
}
