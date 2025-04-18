import { useState, useCallback } from 'react'
import { useToast } from './use-toast'

type ValidationRule<T> = (value: T) => string | undefined

export interface FieldConfig<T> {
  initialValue: T
  validate?: ValidationRule<T>
  required?: boolean
}

interface FormConfig<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FieldConfig<T[K]>
  }
  onSubmit: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const [values, setValues] = useState<T>(() => {
    const initial: Partial<T> = {}
    for (const [key, field] of Object.entries(config.fields)) {
      initial[key as keyof T] = field.initialValue
    }
    return initial as T
  })

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const validateField = useCallback((name: keyof T, value: T[keyof T]) => {
    const field = config.fields[name]
    if (field.required && !value) {
      return `${String(name)} is required`
    }
    if (field.validate) {
      return field.validate(value)
    }
    return undefined
  }, [config.fields])

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    for (const [key, value] of Object.entries(values)) {
      const error = validateField(key as keyof T, value)
      if (error) {
        newErrors[key as keyof T] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }, [values, validateField])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)
    try {
      await config.onSubmit(values)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }, [config, values, validateForm, toast])

  const resetForm = useCallback(() => {
    const initial: Partial<T> = {}
    for (const [key, field] of Object.entries(config.fields)) {
      initial[key as keyof T] = field.initialValue
    }
    setValues(initial as T)
    setErrors({})
  }, [config.fields])

  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    handleChange(name, value)
  }, [handleChange])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  }
}