import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-lg font-bold text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full py-4 px-4 text-xl border-2 border-gray-300 rounded-xl
          focus:border-blue-500 focus:outline-none
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
