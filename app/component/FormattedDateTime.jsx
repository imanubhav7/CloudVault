import { cn, formatDateTime } from '@/lib/utils'
import React from 'react'

const FormattedDateTime = ({date,className}) => {
  return (
    <p className={cn('text-light-200 body-1', className)}>
        {formatDateTime(date)}
    </p>
  )
}

export default FormattedDateTime
