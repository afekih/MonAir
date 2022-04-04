import {ChartData, ChartOptions} from "chart.js/auto";

export const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      }
    },
    y: {
      grid: {
        display: false,
      },
      beginAtZero: true,
      ticks: {
        stepSize: 1
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
    bar: {
      // borderSkipped: 'start',
      borderRadius: 40,
      hoverBackgroundColor: '#0652DD',
      backgroundColor: function(context) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }
        return getGradient(ctx, chartArea);
      },
      // hoverBackgroundColor: '#0652DD',
      borderWidth: 0,
      // borderColor: '#bdc3c7',
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

export let barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Number of measurements',
    data: [],
    // backgroundColor: [
    //   'rgba(255, 99, 132, 0.2)',
    //   'rgba(255, 159, 64, 0.2)',
    //   'rgba(255, 205, 86, 0.2)',
    //   'rgba(75, 192, 192, 0.2)',
    //   'rgba(54, 162, 235, 0.2)',
    //   'rgba(153, 102, 255, 0.2)',
    //   'rgba(201, 203, 207, 0.2)'
    // ],
    // borderColor: [
    //   'rgb(255, 99, 132)',
    //   'rgb(255, 159, 64)',
    //   'rgb(255, 205, 86)',
    //   'rgb(75, 192, 192)',
    //   'rgb(54, 162, 235)',
    //   'rgb(153, 102, 255)',
    //   'rgb(201, 203, 207)'
    // ],
    borderWidth: 0,
    // hoverBackgroundColor: '#0099ff',
    barPercentage: 0.35,
  }]
};

let width: any, height: any, gradient: any;
function getGradient(ctx: any, chartArea: any) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#11cdef');
    // gradient.addColorStop(0.28, 'rgba(9,18,121,1)');
    gradient.addColorStop(1, '#1171ef');
  }

  return gradient;
}
