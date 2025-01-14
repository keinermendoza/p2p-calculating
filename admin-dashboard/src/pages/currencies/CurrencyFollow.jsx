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

    <div className='flex gap-4'>
    {currencies?.map(currency => (
        <OutlinedCard padding='sm' key={currency.id}>
            <p className='text-xl'>{currency.name}</p>
            <p className='lg'>{currency.code}</p>

            {Object.keys(currency.filters).length > 0 ? 
            (
                <>
                    <p>Filtros Activos</p>
                    {currency.filters?.payTypes && 
                    <div>
                        <p>Tipos de Pago</p>
                        <ul className='list-disc list-inside'>
                        {currency.filters?.payTypes?.map((payType, indexTypes) => (
                            <li  key={indexTypes}>{payType}</li>
                        ))}
                        </ul>
                    </div>
                    }

                    {currency.filters?.transAmount && 
                    <div>
                        <p>Valor de transferencia: <span>{currency.filters?.transAmount}</span> </p>
                    </div>
                    }
                </>

            ) : (
                <p>No tiene filtros asociados</p>
            )} 
            
            <Link className={primaryButtonStyle} to={currency.id}>Editar</Link>
            
        </OutlinedCard>
    ))}
    </div>

    </>

  )
}
