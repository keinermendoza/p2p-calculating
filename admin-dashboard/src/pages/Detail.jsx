import Chart from "chart.js/auto";
import { BarChart } from "../charts/BarPrice"
import { CategoryScale } from "chart.js";
import { OutlinedCard } from "../components/ui";

Chart.register(CategoryScale);

export default function Detail({data, setIsDetailView}) {
  const bgBase = 'rgba(54, 162, 235, 0.8)';
  const bgSelected= 'rgba(255, 99, 132, 0.8)';
  const bgOrigin = data.exchange.origin_prices.map(() => bgBase); // Colores por defecto
  const bgDestination = data.exchange.destination_prices.map(() => bgBase);

  bgOrigin[data.position - 1] = bgSelected;
  bgDestination[data.position - 1] = bgSelected;

  return (
    <div className="flex flex-col gap-8">
        <p className="w-fit mb-10 text-blue-600 hover:text-blue-900 dark:text-indigo-500 dark:hover:text-indigo-300">
            <button onClick={() => setIsDetailView(false)} 
            className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span className="text-lg">Volver</span>
            </button>
        </p>
        {/* {JSON.stringify(data)} */}

        <h1 className="text-center text-3xl font-medium">Graficos y detalles del cálculo {data.exchange.origin_currency} - {data.exchange.destination_currency} </h1>


        <section className="flex flex-col-reverse 2xl:flex-row flex-wrap-reverse justify-between items-center gap-8">
        
          <div className="w-full max-w-3xl">
            <BarChart 
              chartData={{
                labels: data.exchange.origin_prices || [],
                datasets: [{
                  label: "Precios de binance P2P",
                  data: data.exchange.origin_prices || [],  
                  backgroundColor: bgOrigin  
                }],
              }}
              startPoint={0.999}

              title={`Precios de Compra de USDT en ${data.exchange.origin_currency}`} 
            />
          </div>

         <OutlinedCard >
            <div className='w-full flex flex-col gap-3'>
                <h5 className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400">Cálculo de Tasa {data.exchange.origin_currency} - {data.exchange.destination_currency} </h5>
                  <p className="text-sm mb-1"> <span className="">Precio de Binance en la </span>posición N° {data.position}</p>
                  <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight">{data.exchange.origin_reference_price} </span>
                      <span className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400">{data.exchange.origin_currency} - USDT </span>
                  </div>

                  {data.exchange.origin_currency === "VES" &&
                  <>
                    <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                        <span className="text-3xl font-extrabold whitespace-nowrap tracking-tight">{data.margin} %</span>
                        <span className="text-sm mb-1 text-gray-500 dark:text-gray-400 "> Margen de Ganancia sobre VES</span>
                    </div>
                    <div className=' dark:border-indigo-700 border-slate-500 border-dashed border-b'></div>

                    <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                        <span className="text-3xl font-extrabold tracking-tight">{data.exchange.calculated_price}</span>
                        <span className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400"> {data.exchange.origin_currency} - USDT  <span className=" text-sm font-base">con Margen</span></span>
                    </div>
                  </>
                }

                <div className=' dark:border-indigo-700 my-2 border-slate-500 border-solid border rounded-md'></div>

                <p className="text-sm mb-1"> <span className="">Precio de Binance en la </span>posición N° {data.position}</p>

                <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                    <span className="text-3xl font-extrabold tracking-tight">{data.exchange.destination_reference_price} </span>
                    <span className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400"> USDT - {data.exchange.destination_currency} </span>
                </div>
        
                {data.exchange.destination_currency === "VES" &&
                <>
                  <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight whitespace-nowrap">{data.margin} %</span>
                      <span className="text-sm mb-1 text-gray-500 dark:text-gray-400 "> Margen de Ganancia sobre VES</span>
                  </div>

                  <div className=' dark:border-indigo-700 border-slate-500 border-dashed border-b'></div>

                  <div className="flex gap-2 items-center text-gray-900 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight">{data.exchange.calculated_price}</span>
                      <span className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400"> USDT - {data.exchange.destination_currency} <span className=" text-sm font-normal">con Margen</span></span>
                  </div>
                </>
                }

              <div className=' dark:border-indigo-700 my-2 border-slate-500 border-solid border rounded-md'></div>

              <div className="flex gap-4 items-center text-gray-900 dark:text-white">
                  <span className="text-3xl font-extrabold tracking-tight">{data.exchange.rate}</span>
                  <span className="mb-1 text-xl font-medium text-gray-500 dark:text-gray-400"> {data.exchange.destination_currency} x 1 {data.exchange.origin_currency} <span className=" text-sm font-normal ">Tasa de cambio</span></span>
              </div>

            </div>
          </OutlinedCard>

        </section>

        <section className="flex flex-col xl:flex-row justify-center items-center gap-4">
        <div className="w-full max-w-3xl">
          <BarChart 
            chartData={{
              labels: data.exchange.destination_prices || [],
              datasets: [{
                label: "Precios de binance P2P",
                data: data.exchange.destination_prices || [],  
                backgroundColor: bgDestination  
              }],
            }}
            startPoint={0.999}
            
            title={`Precios de Venta de USDT en ${data.exchange.destination_currency}`} 
          />
        </div>

        

        </section>

    </div>
  )
}

