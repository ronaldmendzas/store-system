import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'normal' | 'large'
  children: ReactNode
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white'
}

const sizeStyles = {
  normal: 'py-3 px-6 text-lg',
  large: 'py-5 px-8 text-xl'
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
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-bold transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
