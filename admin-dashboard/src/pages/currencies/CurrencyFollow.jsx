import React from 'react'
import { Link } from 'react-router-dom';
import { useFetchGet } from '../../hooks/fetcher';
import { SimpleCard, OutlinedCard, RowInfo } from '../../components/ui';
import { primaryButtonStyle } from "../../components/forms";

export function CurrencyFollow() {
const {data:currencies, loading, error} = useFetchGet("/api/currencies");

  return (
    <>
    {/* <div>{currencies && JSON.stringify(currencies)}</div> */}
    <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-between gap-4">
        <h1 className='text-3xl font-medium'>Monedas</h1>
        <Link to={'registrar'} className={primaryButtonStyle}>
            Registrar Moneda
        </Link>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
    {currencies?.map(currency => (
        <OutlinedCard  key={currency.id}>
            <div className='h-full flex flex-col gap-3'>
                <div>
                    <h5 className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400">{currency.name}</h5>
                    <div className="flex items-baseline text-gray-900 dark:text-white">
                        <span className="text-5xl font-extrabold tracking-tight">{currency.code}</span>
                    </div>
                </div>
                
                {Object.keys(currency.filters).length > 0 ? 
                    (
                    <div className='text-sm '>
                        <div className='mb-4 dark:border-indigo-700 border-slate-500 border-dashed border-b'></div>
                        <p className='text-base '>Filtros Activos:</p>
                        {
                        
                        (currency.filters?.payTypes)?.length > 0 && 
                        <div className='mt-3'>
                            <p>Tipos de Pago: </p>
                            <ul role="list" className="space-y-2 my-2">
                            {currency.filters?.payTypes?.map((payType, indexTypes) => (
                                <li className="flex"  key={indexTypes}>
                                    <svg className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    <span className="text-sm font-light  leading-tight text-gray-500 dark:text-gray-400 ms-3">{payType}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        }

                        {Object.keys(currency.filters).includes("transAmount") &&
                        <p className=''>Valor de transferencia: <span className='text-xl font-medium tracking-tight text-gray-900 dark:text-white' >{currency.filters?.transAmount}</span></p>
                        }
                    </div>

                    ) : (
                        <p className='mt-3' >No tiene filtros asociados</p>
                    )} 
                    <div className='grow flex justify-end items-end' >
                        <Link className={primaryButtonStyle} to={"./" + currency.id}>Editar</Link>
                    </div>

            </div>
            

        </OutlinedCard>
        
    ))}
    </div>

    </>

  )
}


                