import { NavLink } from "react-router-dom"

export function ComeBackLink() {
  return (
    <p className="w-fit mb-10 text-blue-600 hover:text-blue-900 dark:text-indigo-500 dark:hover:text-indigo-300">
        <NavLink className="flex items-center gap-3" to="../">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="text-lg">Volver</span>
        </NavLink>
    </p>

  )
}
