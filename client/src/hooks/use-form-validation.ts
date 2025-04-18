import { useState } from "react"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
}

interface ValidationRules {
  [key: string]: ValidationRule
}

export function useFormValidation<T extends { [key: string]: string }>(
  initialState: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialState)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (name: string, value: string): string => {
    const rules = validationRules[name]
    if (!rules) return ""

    if (rules.required && !value) {
      return `${name} is required`
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name} must be less than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${name} is invalid`
    }

    if (rules.custom && !rules.custom(value)) {
      return `${name} is invalid`
    }

    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    const error = validate(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateAll = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    Object.keys(values).forEach(key => {
      const error = validate(key, values[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (
    onSubmit: (values: T) => Promise<void>
  ) => {
    setIsSubmitting(true)
    if (validateAll()) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error(error)
      }
    }
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  }
}