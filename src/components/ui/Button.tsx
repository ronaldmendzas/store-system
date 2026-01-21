import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'normal' | 'large'
  children: ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success'
}

const sizeStyles = {
  normal: 'py-3 px-6 text-base',
  large: 'py-4 px-8 text-lg'
}

export function Button({
  variant = 'primary',
  size = 'normal',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn-action ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
