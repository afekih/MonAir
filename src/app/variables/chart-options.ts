import {ChartData, ChartOptions} from "chart.js/auto";

export const chartOptions: ChartOptions = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      }
    },
    y: {
      grid: {
        display: false,
      }
    }
  },
  elements: {
    point: {
      radius: 5,
      backgroundColor: '#5e72e4',
      borderColor: '#f4f5f7',
      borderWidth: 0
    },
    line: {
      tension: .4,
      borderWidth: 4,
      borderColor: '#5e72e4',
      backgroundColor: '#5e72e4',
      borderCapStyle: 'round'
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 16
      }
    },
  },
}

export let chartData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Number of measurements during ',
      // radius: 5,
      pointBackgroundColor: '#f4f5f7',
      // borderColor: '#5e72e4',
      // pointBackgroundColor:
      data: [0],
      tension: 0.5
    }
  ],
};
