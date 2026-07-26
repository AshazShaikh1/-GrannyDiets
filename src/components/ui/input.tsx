import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border ${
          error ? 'border-error' : 'border-border'
        } bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-error' : 'focus:ring-focus'
        } disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
