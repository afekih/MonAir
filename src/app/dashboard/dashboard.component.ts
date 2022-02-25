import {Component, OnInit, ViewChild} from '@angular/core';
import {MonAirService} from "../services/mon-air.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Chart, {ChartItem, ChartData, ChartOptions} from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['Node ID', 'LoRaWAN Address', 'Last seen'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;

  public datasets: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public nodesList: any[] = [];
  public nodesContributions: any[] = [];
  public measuresNumber: any;
  public selectedYear = 2019;
  public contributionTableColumns: string[] = ['node_id', 'contribution'];
  private labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  // private chartData = {
  //   labels: this.labels,
  //   datasets: [{
  //     label: 'Number of measurements during ' + this.selectedYear,
  //     // radius: 5,
  //     backgroundColor: '#fff',
  //     borderColor: '#5e72e4',
  //     data: [0],
  //   }]
  // };
  //
  // chartConfig: ChartConfiguration = {
  //   type: 'line',
  //   data: this.chartData,
  //   options: {}
  // };


  public chartData: ChartData<'line'> = {
    labels: this.labels,
    datasets: [
      {
        label: 'Number of measurements during ' + this.selectedYear,
        // radius: 5,
        pointBackgroundColor: '#f4f5f7',
        // borderColor: '#5e72e4',
        // pointBackgroundColor:
        data: [0],
        tension: 0.5
      },
      // {label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500], tension: 0.5}
    ],
  };

  chartOptions: ChartOptions = {
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
  };

  constructor(private monAirService: MonAirService) {
  }

  //
  ngOnInit() {

    // this.nodesService.listen('nodesListUpdate').subscribe((data : any[])=>{
    //   this.nodesList = data;
    // });

    this.monAirService.getNodesList()
      .subscribe((data: any[]) => {
        this.nodesList = data;
        // console.log('list of nodes: ', this.nodesList);
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator!;
      });

    this.monAirService.getMeasuresNumber()
      .subscribe((data: { [x: string]: any; }) => {
        // console.log('number of measures: ', data);
        this.measuresNumber = data['measuresNumber'];
      });

    this.monAirService.getTopContributors(7)
      .subscribe((data: Object[]) => {
        // console.log("contributors: ", data);
        this.nodesContributions = data;
      });

    this.monAirService.getMeasuresPerMonth(2019)
      .subscribe((data: { [key: string]: any[] }) => {
        console.log('measures per month: ', data['number']);
        this.chartData.datasets[0].data = data['number'];
        let chartElement = <ChartItem>document.getElementById('measuresChart');
        new Chart(
          chartElement,
          {
            type: 'line',
            data: this.chartData,
            options: this.chartOptions
          }
        );
        // this.data = this.datasets[0];
        // this.updateOptions();
      });

    // parseOptions(Chart, chartOptions());


    // this.getMeasuresPerMonth(this.selectedYear);
  }

  // ngAfterViewChecked(){
  //   let chartElement = <ChartItem>document.getElementById('measuresChart');
  //
  //   let measuresChart = new Chart(
  //     chartElement,
  //     this.config
  //   );
  // }

  public updateOptions() {
    // this.measuresChart.data.datasets[0].data = this.data;
    // // this.ordersChart.data.datasets[0].data = this.data;
    // // this.getMeasuresPerMonth(this.selectedYear);
    // this.measuresChart.update();
    // // this.ordersChart.update();
  }

  getMeasuresPerMonth(year: number) {
    this.monAirService.getMeasuresPerMonth(year)
      .subscribe((data: { [key: string]: any[] }) => {
        this.chartData.datasets = data['number'];
        // this.data = this.datasets[0];
        this.updateOptions();
      });
  }

}
