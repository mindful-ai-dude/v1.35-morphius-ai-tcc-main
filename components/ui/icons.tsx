'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <circle cx="128" cy="128" r="128" fill="black"></circle>
      <rect x="82" y="118" width="92" height="20" rx="5" fill="white"></rect>
      <rect x="118" y="82" width="20" height="92" rx="5" fill="white"></rect>
    </svg>
  )
}

export { IconLogo }
