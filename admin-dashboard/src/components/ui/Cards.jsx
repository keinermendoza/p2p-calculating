export const SimpleCard = ({children, padding="md", hasHover=null}) => {
  return (
    <div className={`rounded-lg ${padding === "sm"  ? 'p-2' : 'p-4'}   bg-indigo-600 bg-opacity-0 dark:border-indigo-700  ${hasHover && 'cursor-pointer hover:bg-opacity-10'}`} >
      {children}
    </div>
  )
}

export const OutlinedCard =({children, padding="md", hasHover=null}) => {
  return (
    <div className={`border-solid border-2 dark:border-indigo-700 border-slate-500 rounded-lg ${padding === "sm"  ? 'p-2' : 'p-4'} bg-indigo-600 bg-opacity-0  ${hasHover && 'cursor-pointer hover:bg-opacity-10'}`} >
      {children}
    </div>
  )
}

export const RowInfo = ({children}) => {
  return (
    <div className="p-2 dark:bg-indigo-950 bg-indigo-200 rounded-md flex gap-4 items-center justify-between">
      {children}
    </div>
  )
}
