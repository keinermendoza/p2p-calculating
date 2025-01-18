import { SimpleCard, OutlinedCard, RowInfo } from "../components/ui";
import { PrimaryButton } from "../components/ui";
export default function List({exchangeData, choiceExchange}) {
    return (
        <div>
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-medium">Tasas y Calculos</h1>
            
            {exchangeData &&
            <div className="flex justify-between items-center gap-2">
              <OutlinedCard padding="sm">
                <p className="text-sm">Usando Posición N° <span className="text-medium text-xl">{exchangeData.selected_position}</span></p>
              </OutlinedCard>

              <OutlinedCard padding="sm">
                <p className="text-sm">Margen de Ganancia <span className="text-medium text-xl">{exchangeData.profit_margin}%</span></p>
              </OutlinedCard>
            </div>
            }
            
            
                                                    
          </div>
      
          <div className="grid gap-4">
              <ExchageSideSection 
                data={exchangeData?.rates_to_ves}
                // setIsDetailView={setIsDetailView}
                choiceExchange={choiceExchange}
                isToVes
                title="Envíos a Venezuela" 
              />
              
              <ExchageSideSection 
                data={exchangeData?.rates_from_ves}
                // setIsDetailView={setIsDetailView}
                choiceExchange={choiceExchange}
                isToVes={false}
                title="Envíos desde Venezuela" 
              />
      
          </div>
        
          </div>
        )
}





const ExchageSideSection = ({data, title, isToVes, choiceExchange}) => {
    return (
        <SimpleCard>

            {/* {data && JSON.stringify(data)} */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">{title}</h2>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.map((currencyPair, currencyPairIndex) => (
            <div 
              key={currencyPairIndex} 
              className=" dark:bg-slate-800 dark:bg-opacity-50 bg-indigo-200  p-2 sm:p-4 text-slate-600 dark:text-slate-400 rounded-md flex flex-col gap-2">
                <div className="p-3   bg-slate-200 dark:bg-slate-900 rounded-md grid place-content-center">
                  <div className="text-center flex flex-col items-center gap-2">
                      <p className="text-sm text-salte-700 dark:text-white font-medium "><span className="text-slate-500">Envío</span> {currencyPair.origin_currency}</p>

                      <div className="rounded-full w-fit px-4 py-6 bg-gradient-to-b dark:from-indigo-950 dark:to-slate-900 to-blue-800 from-indigo-400 ">
                        <p className="text-white text-3xl">{currencyPair.rate}</p>
                        <p className="text-sm font-medium dark:text-slate-500 text-slate-300">{currencyPair.destination_currency}</p>
                      </div>

                      <p className="text-sm">Valor ofrecido al cliente</p>

                  </div>
                </div>

                  <div className="mt-2 flex flex-col gap-2">

                    
                    <p>Ofertas a Realizar en Binance</p>
                    
                    
                    {isToVes
                    ? <RowInfo>
                        <p className="text-sm ">Comprar <span className="font-semibold text-slate-700 dark:text-white">USDT</span> con <span className="font-semibold text-slate-700 dark:text-white">{currencyPair.origin_currency}</span> a</p>
                        <span className="text-lg text-medium ">{currencyPair.origin_reference_price}</span>
                     </RowInfo>
                    : <RowInfo>
                      <p className="text-sm ">Comprar <span className="font-semibold text-slate-700 dark:text-white">USDT</span> con <span className="font-semibold text-slate-700 dark:text-white">{currencyPair.origin_currency}</span> a</p>
                      <span className="text-lg text-medium ">{currencyPair.calculated_price}</span>                      
                    </RowInfo>
                    }
                    
                 
                    {isToVes
                    ? <RowInfo>
                        <p className="text-sm ">Vender <span className="font-semibold text-slate-700 dark:text-white">USDT</span> por <span className="font-semibold text-slate-700 dark:text-white">{currencyPair.destination_currency}</span> a</p>
                        <span className="text-lg text-medium ">{currencyPair.calculated_price}</span>
                     </RowInfo>
                    : <RowInfo>
                      <p className="text-sm ">Vender <span className="font-semibold text-slate-700 dark:text-white">USDT</span> por <span className="font-semibold text-slate-700 dark:text-white">{currencyPair.destination_currency}</span> a</p>
                      <span className="text-lg text-medium ">{currencyPair.destination_reference_price}</span>                      
                    </RowInfo>
                    }
                    
                    {/* <p className="text-sm mt-2">Información Extra</p>
                      
                      <RowInfo>
                        <p className="text-sm text-slate-400 dark:text-slate-600">Referencia de <span className="font-medium">{currencyPair.origin_currency}</span> a <span className="font-medium">USDT</span></p>
                        <span className="text-lg text-medium text-slate-400 dark:text-slate-600">{currencyPair.origin_reference_price}</span>
                      </RowInfo>

                      <RowInfo>
                        <p className="text-sm text-slate-400 dark:text-slate-600">Referencia de <span className="font-medium">USDT</span> a <span className="font-medium">{currencyPair.destination_currency}</span></p>
                        <span className="text-lg text-medium text-slate-400 dark:text-slate-600">{currencyPair.destination_reference_price}</span>                      
                      </RowInfo>

                       */}


                      <div className="mt-2 flex justify-end">
                      <PrimaryButton handleClick={() => choiceExchange(isToVes, currencyPairIndex)}>
                        Ver Detalles
                      </PrimaryButton>
                      </div>
                  </div>
            </div>
            ))}
                
                </div>

          </SimpleCard>

    )
}