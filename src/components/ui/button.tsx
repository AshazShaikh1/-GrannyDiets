import * as React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-focus disabled:opacity-50 disabled:pointer-events-none hover:shadow-md active:scale-95'
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-hover hover:-translate-y-0.5',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:-translate-y-0.5',
      outline: 'border border-border bg-transparent hover:bg-surface text-text-primary hover:-translate-y-0.5',
      ghost: 'bg-transparent hover:bg-background text-text-primary hover:scale-105',
      danger: 'bg-error text-white hover:bg-error/90 hover:-translate-y-0.5',
    }

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
