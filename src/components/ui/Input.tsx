import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-base font-bold mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full py-3 px-4 text-lg border-2 rounded-xl
          bg-secondary border-color
          focus:border-primary focus:outline-none
          transition-colors
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
