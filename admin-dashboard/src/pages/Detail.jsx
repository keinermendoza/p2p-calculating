import { BarChart } from "../charts/BarPrice"
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

export default function Detail({data, setIsDetailView}) {
  const bgColors = data.exchange.origin_prices.map(() => 'rgba(54, 162, 235, 0.8)'); // Colores por defecto
  console.log(data)
  // Cambiar color de la barra en la posición 2 (índice 1, por ejemplo)
  bgColors[data.position - 1] = 'rgba(255, 99, 132, 0.8)';

  return (
    <div>
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
        {JSON.stringify(data)}

        <BarChart chartData={{
          labels: data.exchange.origin_prices || [],
          datasets: [{
            label: "Precios",
            data: data.exchange.origin_prices || [],  
            backgroundColor: bgColors  
          }],
          
        }}
          title="Venda Diária por Método de Pagamento" />
    </div>
  )
}



// datasets: [{
//   label: '# of Votes',
//   data: [12, 19, 3, 5, 2, 3],
//   borderWidth: 1
// }]