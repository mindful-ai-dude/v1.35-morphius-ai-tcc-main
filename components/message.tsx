'use client'

import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Citing } from './custom-link'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './ui/markdown'

export function BotMessage({
  message,
  className
}: {
  message: string
  className?: string
}) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    message || ''
  )

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(message || '')

  if (containsLaTeX) {
    return (
      <div className={cn('prose-sm prose-neutral prose-a:text-accent-foreground/50', className)}>
        <MemoizedReactMarkdown
          rehypePlugins={[
            [rehypeExternalLinks, { target: '_blank' }],
            [rehypeKatex]
          ]}
          remarkPlugins={[remarkGfm, remarkMath]}
        >
          {processedData}
        </MemoizedReactMarkdown>
      </div>
    )
  }

  return (
    <div className={cn('prose-sm prose-neutral prose-a:text-accent-foreground/50', className)}>
      <MemoizedReactMarkdown
        rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            let processedChildren = children;
            
            if (children && children.length) {
              if (children[0] == '▍') {
                return (
                  <span className="mt-1 cursor-default animate-pulse">▍</span>
                )
              }

              processedChildren = [(children[0] as string).replace('`▍`', '▍'), ...children.slice(1)];
            }

            const match = /language-(\w+)/.exec(className || '')

            if (inline) {
              return (
                <code className={className} {...props}>
                  {processedChildren}
                </code>
              )
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(processedChildren).replace(/\n$/, '')}
                {...props}
              />
            )
          },
          a: Citing
        }}
      >
        {message}
      </MemoizedReactMarkdown>
    </div>
  )
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}
