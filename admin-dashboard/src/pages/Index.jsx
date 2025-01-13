import {  useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { CardAction, CardFooter, PrimaryButton } from "../components/ui";
import { useFetchGet} from '../hooks/fetcher';
import { fetchPost } from "../services/fetchPost";
import { displayResponseMessages } from "../lib/utils";

export default function Index() {
const endpoint = "/api/exchanges";
const {data:exchangeData, error} = useFetchGet(endpoint);

console.log(exchangeData)
return (
  <div>
    <ToastContainer />

    <div className="flex justify-between items-center mb-10">
      <h1 className="text-3xl font-medium">Tasas y Calculos</h1>
      {exchangeData &&
      <OutlinedCard padding="sm">
        <p className="text-sm">Margen de Ganancia <span className="text-medium text-xl">{exchangeData.profit_margin}%</span></p>
      </OutlinedCard>
      }
                                              
    </div>

    <div className="grid gap-4">
        <ExchageSideSection 
          data={exchangeData?.rates_to_ves}
          isToVes
          title="Envíos a Venezuela" 
        />
        
        <ExchageSideSection 
          data={exchangeData?.rates_from_ves}
          isToVes={false}
          title="Envíos desde Venezuela" 
        />

    </div>
  
    </div>
  )
}

const SimpleCard = ({children, padding="md", hasHover=null}) => {
  return (
    <div className={`rounded-lg ${padding === "sm"  ? 'p-2' : 'p-4'}   bg-indigo-600 bg-opacity-0 dark:border-indigo-700  ${hasHover && 'cursor-pointer hover:bg-opacity-10'}`} >
      {children}
    </div>
  )
}

const OutlinedCard =({children, padding="md", hasHover=null}) => {
  return (
    <div className={`border-solid border-2 dark:border-indigo-700 border-slate-500 rounded-lg ${padding === "sm"  ? 'p-2' : 'p-4'} bg-indigo-600 bg-opacity-0  ${hasHover && 'cursor-pointer hover:bg-opacity-10'}`} >
      {children}
    </div>
  )
}

const RowInfo = ({children}) => {
  return (
    <div className="p-2 dark:bg-indigo-950 bg-indigo-200 rounded-md flex gap-4 items-center justify-between">
      {children}
    </div>
  )
}

const ExchageSideSection = ({data, title, isToVes}) => {
    return (
        <SimpleCard>

            {/* {data && JSON.stringify(data)} */}
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.map((currencyPair, currencyPairIndex) => (
            <div 
              key={currencyPairIndex} 
              className="bg-slate-200 dark:bg-indigo-900 dark:bg-opacity-15 p-2 sm:p-4 text-slate-600 dark:text-slate-400 rounded-md flex flex-col gap-2">
                <div className="p-3 dark:bg-indigo-950 bg-indigo-200 rounded-md grid place-content-center">
                  <div className="text-center flex flex-col items-center gap-2">
                      <p className="text-sm font-medium "><span className="text-slate-500">Envío</span> {currencyPair.origin_currency}</p>

                      <div className="rounded-full w-fit px-4 py-6 bg-gradient-to-b dark:from-indigo-950 dark:to-slate-900 to-blue-800 from-indigo-400 ">
                        <p className="text-white text-3xl">{currencyPair.rate}</p>
                        <p className="text-sm font-medium dark:text-slate-500 text-slate-300">{currencyPair.destination_currency}</p>
                      </div>

                      <p className="text-sm">Valor ofrecido al cliente</p>

                  </div>
                </div>

                  <div className="mt-2 flex flex-col gap-2">
                    
                    <p>Oferta de {isToVes ? 'Compra' : 'Venta'} en Binance</p>
                    <RowInfo>
                      {isToVes 
                      ? <p className="text-sm">Comprar <span className="font-medium">USDT</span> con <span className="font-medium">VES</span> a </p>
                      : <p className="text-sm">Vender <span className="font-medium">USDT</span> por <span className="font-medium">VES</span> a </p>
                    }
                      <span className="text-medium text-xl">{currencyPair.calculated_price}</span>                      
                    </RowInfo>
                    
                    <p className="text-sm mt-2">Información Extra</p>
                      
                      <RowInfo>
                        <p className="text-sm text-slate-400 dark:text-slate-600">Referencia de <span className="font-medium">{currencyPair.origin_currency}</span> a <span className="font-medium">USDT</span></p>
                        <span className="text-lg text-medium text-slate-400 dark:text-slate-600">{currencyPair.origin_reference_price}</span>
                      </RowInfo>

                      <RowInfo>
                        <p className="text-sm text-slate-400 dark:text-slate-600">Referencia de <span className="font-medium">USDT</span> a <span className="font-medium">{currencyPair.destination_currency}</span></p>
                        <span className="text-lg text-medium text-slate-400 dark:text-slate-600">{currencyPair.destination_reference_price}</span>                      
                      </RowInfo>

                      <div className="mt-2 flex justify-end">
                        <OutlinedCard padding="sm"> <span className="text-sm text-slate-400 dark:text-slate-600">Ver Más</span></OutlinedCard>
                      </div>
                      
                  </div>

                
{/* 
                <div className="flex flex-col gap-2">
                  
                </div> */}
                

            </div>
            ))}
                
                </div>

          </SimpleCard>

    )
}

  {/* <div className="flex flex-col gap-0.5">
                        <p className="">Mejores 5 precios en {currencyPair.origin_currency}</p>
                        <p className="flex underline underline-offset-2 gap-4 text-blue-600 dark:text-indigo-500 font-semibold ">
                            {currencyPair?.origin_prices.map((price, index) => (
                                <span className={index === 2 ? 'text-yellow-600': ''}  >{price}</span>
                            ))}
                        </p>
                        <p className="text-lg">Precio de Referencia  <span className="ms-2 text-xl font-semibold text-yellow-600">{currencyPair.origin_reference_price}</span></p>
                    </div> */}
{/*                     
                    <div className="flex flex-col gap-0.5">
                        <p className="">Mejores 5 precios en {currencyPair.destination_currency}</p>
                        <p className="flex underline underline-offset-2 gap-4 text-blue-600 dark:text-indigo-500 font-semibold ">
                            {currencyPair?.destination_prices.map((price, index) => (
                                <span className={index === 2 ? 'text-yellow-600': ''}  >{price}</span>
                            ))}
                        </p>
                        <p className="text-lg">Precio de Referencia  <span className="ms-2 text-xl font-semibold text-yellow-600">{currencyPair.destination_reference_price}</span></p>
                    </div> */}