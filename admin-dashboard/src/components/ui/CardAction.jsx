import React from 'react'

export function CardAction({children, extraClass=""}) {
  return (
  <div className={`w-full bg-white border border-gray-200 rounded-lg shadow
   dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between p-5 ${extraClass} `}>
    {children}
  </div>
  )
}
