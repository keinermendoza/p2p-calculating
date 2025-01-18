import { Bar } from "react-chartjs-2";
import { defaults } from 'chart.js';

// defaults.font.family = 'monospace';

export function BarChart({ chartData, moneyOptions=false, startPoint=null, options=null, title=null }) {

  const defaultOptions = {
    plugins: {
        title: {
        display: title,
        text: title,
        font: {
            size: 24 // <== Define font size here
        }
    },
  }
}

// const moneyChartOptions = {
//   responsive: true,
//   plugins: {
//     title: {
//       display: title,
//       text: title
//       },
//       legend: {
//           display: true,
//           position: "top",
//       },
//       tooltip: {
//           callbacks: {
//               label: function (context) {
//                   return ``;
//               },
//           },
//       },
//   },
//   scales: {
//       y: {
//         //   ticks: {
//         //       callback: function (value) {
//         //           return `R$ ${value.toLocaleString("pt-BR")}`;
//         //       },
//         //   },
//       },
//   },
// };



  const minValue = Math.min(...chartData.datasets[0].data);


  const startValue = parseFloat(minValue * startPoint);

  const usingStartPoint = {
      ...defaultOptions,
      scales: {
        y: {
            min: startValue, // Usa el valor calculado como el inicio del eje
            ticks: {
                beginAtZero: false // Asegúrate de que no comience desde 0
            }
        }
    }
  }


  const chartOptions = options  || startPoint && usingStartPoint || defaultOptions;
    return (
        <Bar
          data={chartData}
          options={chartOptions}
        />
    );
  }
