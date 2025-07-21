import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ChildFriendlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success'
  size?: 'small' | 'medium' | 'large'
  hasIcon?: boolean
}

const ChildFriendlyButton = forwardRef<HTMLButtonElement, ChildFriendlyButtonProps>(
  ({ className, variant = 'primary', size = 'large', hasIcon = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles with larger touch targets (minimum 44px as per guidelines)
          'relative inline-flex items-center justify-center font-bold transition-all duration-200',
          'rounded-2xl shadow-lg active:scale-95',
          'focus:outline-none focus:ring-4 focus:ring-offset-2',
          
          // Size variants with child-friendly dimensions
          {
            'h-12 px-6 text-lg': size === 'small', // Still 48px tall
            'h-16 px-8 text-xl': size === 'medium', // 64px tall
            'h-20 px-10 text-2xl': size === 'large', // 80px tall
          },
          
          // Color variants with high contrast
          {
            'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-400': variant === 'primary',
            'bg-yellow-400 text-purple-900 hover:bg-yellow-300 focus:ring-yellow-300': variant === 'secondary',
            'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400': variant === 'success',
          },
          
          // Icon adjustments
          hasIcon && 'gap-3',
          
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Visual feedback layer */}
        <span className="absolute inset-0 rounded-2xl bg-white opacity-0 transition-opacity hover:opacity-10" />
        
        {/* Content */}
        <span className="relative flex items-center gap-3">
          {children}
        </span>
      </button>
    )
  }
)

ChildFriendlyButton.displayName = 'ChildFriendlyButton'

export { ChildFriendlyButton }