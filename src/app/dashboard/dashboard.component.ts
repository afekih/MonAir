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
  public nodesList: any[] = [];
  public nodesContributions: any[] = [];
  public measuresNumber: any;
  public selectedYear = new Date().getFullYear().toString();
  public measuresChart: any;
  public contributionTableColumns: string[] = ['node_id', 'contribution'];
  public yearsList: string[];
  private labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
      }
    ],
  };

  public chartOptions: ChartOptions = {
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
    this.yearsList = DashboardComponent.generateYearsList(2019);
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

    this.measuresChart = new Chart(
      <ChartItem>document.getElementById('measuresChart'),
      {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions
      }
    );

    this.getMeasuresPerMonth(this.selectedYear);

  }


  getMeasuresPerMonth(year: string) {
    this.monAirService.getMeasuresPerMonth(year)
      .subscribe((data: { [key: string]: any[] }) => {
        this.chartData.datasets[0].data = data['number'];
        this.measuresChart.update();
      });
  }

  private static generateYearsList(startYear: number) {
    let currentYear = new Date().getFullYear();
    let result: string[] = []
    for (let year=startYear; year <= currentYear; year++){
      result.push(year.toString());
    }
    return result
  }

}
