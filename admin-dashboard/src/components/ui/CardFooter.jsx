export function CardFooter({children, extraClass}) {
  return (
    <div className={`flex mt-4 md:mt-6 ${extraClass}`}>
        {children}
    </div>
  )
}
