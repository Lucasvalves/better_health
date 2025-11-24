import React, { useState, useRef, useEffect } from 'react'
import styles from './page.module.scss'

interface Option {
  label: string
  value: string
}

interface Props {
  id?: string
  label?: string
  value: string | number
  options?: Option[]
  placeholder?: string
  onChange: (value: string) => void
}

export function CustomSelect({
  value,
  options,
  placeholder = 'Selecione...',
  onChange,
  label
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedLabel = options?.find((opt) => opt.value === value)?.label

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.customSelect} ref={ref}>
      <label htmlFor="specialties-select">{label}</label>
      <div className={styles.selected} onClick={() => setOpen(!open)}>
        {selectedLabel || placeholder}
        <span className={styles.arrow} />
      </div>
      {open && (
        <ul className={styles.optionsList}>
          {options?.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
