import { useState } from "react"


export function ExchangeCurrencyDropdown({options, selectedOption, handleChange}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const localHandleChange = (id) => {
        handleChange(id);
        closeModal();
    }

    return (
    
  <div className="flex relative">
      <button onClick={toggleIsOpen} id="states-button" data-dropdown-toggle="dropdown" className="w-full z-10 flex justify-between items-center  py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
        {selectedOption ? (
            <div className="flex gap-3 items-center">
                {selectedOption.image 
                    ? <img className="bg-gray-500 rounded-full shadow-lg object-fit size-12" src={selectedOption.image} /> 
                    : <div className="bg-gray-500 rounded-full shadow-lg object-fit size-12"></div>
                }
                <span>{selectedOption.name}</span>
            </div>
        ) : (
            <span>Selecciona una opción</span>
        )}
        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
        <div onClick={closeModal} className={`fixed z-10 top-0 left-0 w-screen h-screen ${isOpen ? 'block' : 'hidden'}`}></div>
        <div id="dropdown-states" className={`z-20 absolute top-0 translate-y-20  bg-white divide-y divide-gray-100
        rounded-lg shadow w-72 dark:bg-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
                {options &&
                options.map(option => (
                <li key={option.id}>
                    <button data-option="algo" onClick={() => localHandleChange(option.id)} type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                        <div className="inline-flex gap-3 items-center">
                        {option.image 
                            ? <img className="bg-gray-500 rounded-full shadow-lg object-fit size-12" src={option.image} /> 
                            : <div className="bg-gray-500 rounded-full shadow-lg object-fit size-12"></div>
                        }
                            <span>{option.name}</span>
                        </div>
                    </button>
                </li>
                ))
                }
                
            </ul>
        </div>
  </div>

  )
}
