import { clsx } from 'clsx'

interface CTAButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
}

export function CTAButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className,
  disabled = false,
}: CTAButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-semibold tracking-tight',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
    'shadow-md hover:shadow-xl active:scale-[0.98]',
  ]

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      'hover:from-amber-500 hover:to-orange-500 hover:shadow-amber-500/40',
      'focus:ring-amber-500',
    ],
    secondary: [
      'bg-black/60 backdrop-blur-md border border-zinc-700/70 text-white',
      'hover:bg-black/80 hover:border-zinc-500/70 hover:shadow-zinc-500/30',
      'focus:ring-zinc-500',
    ],
  }

  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm rounded-full',
    md: 'px-8 py-3.5 text-base rounded-full',
    lg: 'px-10 py-4 text-lg rounded-full',
  }

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}