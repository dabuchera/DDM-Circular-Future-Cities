import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function StandardButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props

  return (
    <button
      {...rest}
      className="laptop:px-5 laptop:py-3 tablet:px-3 tablet:py-1 mobile:px-2 mobile:py-1 
       text-white laptop:text-sm tablet:text-base mobile:text-xxs font-medium
       bg-blue-500 
       border border-white rounded-md shadow-sm
       hover:bg-white hover:text-blue-500 
       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
       disabled:opacity-50 disabled:pointer-events-none"
    >
      {props.children}
    </button>
  )
}

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props

  return (
    <button
      {...rest}
      className="mt-5 laptop:px-3 laptop:py-2 tablet:px-1 tablet:py-1 mobile:px-2 mobile:py-1 
       text-blue-500 laptop:text-sm tablet:text-base mobile:text-xxs font-medium
       border border-blue-500 rounded-md shadow-sm
       hover:bg-blue-500 hover:text-white"
    >
      {props.children}
    </button>
  )
}

export function NoLoggingButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, className, ...rest } = props

  return (
    <button
      {...rest}
      className="laptop:px-5 laptop:py-3 tablet:px-4 tablet:py-2 mobile:px-3 mobile:py-2 
       text-gray-400 laptop:text-sm tablet:text-base mobile:text-xxs font-medium 
       bg-gray-800
       border border-gray-200 rounded-md shadow-sm 
       disabled:opacity-50 disabled:pointer-events-none cursor-not-allowed"
    >
      {props.children}
    </button>
  )
}

export function LinkButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props

  return (
    <button
      {...rest}
      className="laptop:px-5 laptop:py-3 tablet:px-3 tablet:py-1 mobile:px-2 mobile:py-1 
       text-blue-500 laptop:text-sm tablet:text-base mobile:text-xxs font-medium
       bg-blue-white 
       border border-blue-500 rounded-md shadow-sm
       hover:bg-blue-500 hover:text-white 
       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
       disabled:opacity-50 disabled:pointer-events-none"
    >
      {props.children}
    </button>
  )
}

// More or less the same as above. But without background-color set
// This button can change Color Background
export function ColorButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, className, ...rest } = props

  const classes = twMerge(`

  laptop:px-5 laptop:py-3 tablet:px-3 tablet:py-1 mobile:px-2 mobile:py-1 
  text-white laptop:text-sm tablet:text-base mobile:text-xxs font-medium
  border rounded-md shadow-sm"
  ${className ?? ''}

  `)

  return (
    <button {...rest} className={classes}>
      {props.children}
    </button>
  )
}
