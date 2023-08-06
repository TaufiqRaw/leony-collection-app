import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

interface ProductionData {
  date: string; 
  amount: number;
}

declare var productionData: ProductionData[];
const ctx = document.getElementById('productionChart') as HTMLCanvasElement;
console.log(ctx)

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: productionData.map(data => data.date),
    datasets: [{
      label: '# produksi',
      data: productionData.map(data => data.amount),
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        ticks: {
            maxTicksLimit: 8
        }
      }
    }
  }
});