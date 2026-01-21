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
      <label htmlFor={id} className="block text-base font-bold mb-2">
        {label}
      </label>
      <select
        id={id}
        className={`
          w-full py-3 px-4 text-lg border-2 rounded-xl
          bg-secondary border-color
          focus:border-primary focus:outline-none
          transition-colors cursor-pointer
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
