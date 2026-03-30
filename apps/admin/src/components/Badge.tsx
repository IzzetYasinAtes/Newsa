interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'
  children: React.ReactNode
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  destructive: 'bg-red-50 text-red-700',
  secondary: 'bg-secondary text-secondary-foreground',
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
