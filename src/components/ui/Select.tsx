import { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
}

export function Select({ label, id, options, className = '', ...props }: SelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-lg font-bold text-gray-700 mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        className={`
          w-full py-4 px-4 text-xl border-2 border-gray-300 rounded-xl
          focus:border-blue-500 focus:outline-none bg-white
          ${className}
        `}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
