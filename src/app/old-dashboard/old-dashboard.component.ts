import {Component, OnInit, ViewChild} from '@angular/core';
import {MonAirService} from "../services/mon-air.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Chart, {ChartItem} from 'chart.js/auto';
import {chartOptions, chartData} from "../variables/chart-options";
import * as moment from "moment/moment";

// import {map} from 'rxjs/operators';


@Component({
  selector: 'app-old-dashboard',
  templateUrl: './old-dashboard.component.html',
  styleUrls: ['./old-dashboard.component.scss']
})
export class OldDashboardComponent implements OnInit {

  displayedColumns: string[] = ['node_id', 'lorawan_address', 'contribution', 'last_seen', 'last_location'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;

  public datasets: any;
  public nodesList: any[] = [];
  public nodesContributions: any[] = [];
  public numberOfMeasures: number;
  public selectedYear = new Date().getFullYear().toString();
  public measuresChart: any;
  public contributionTableColumns: string[] = ['node_id', 'contribution'];
  public yearsList: string[];

  constructor(private monAirService: MonAirService) {
    // moment.locale('fr');
    this.yearsList = OldDashboardComponent.generateYearsList(2019);
    this.numberOfMeasures = 0;
  }

  //
  ngOnInit() {

    chartData.datasets[0].label = 'Number of measurements during ' + this.selectedYear;

    this.monAirService.getNumberOfMeasuresPerYear(this.selectedYear);

    this.monAirService.getTotalNumberOfMeasures()
      .subscribe((data: any) => {
        // console.log('number of measures: ', data);
        this.numberOfMeasures = data["measures_count"];
        this.monAirService.getTotalNodesList()
          .subscribe((data: Object[]) => {
            this.nodesList = data;
            this.nodesList.map(node => {
              node["contribution"] = node["measures_count"] * 100 / this.numberOfMeasures;
              // console.log('date: ', node['last_seen']);
              node["last_seen_date"] = moment(node['last_seen']).format('dddd, D MMMM YYYY - H[h]mm');
              // console.log();
            });
            // this.nodesList.forEach(node =>{
            //   node['contribution'] = node["measures_count"] * 100 / this.numberOfMeasures;
            // });
            // console.log(data);
            this.dataSource = new MatTableDataSource<any>(data);
            this.dataSource.paginator = this.paginator!;
          });
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
        data: chartData,
        options: chartOptions
      }
    );

    this.getMeasuresPerMonth(this.selectedYear);

  }


  getMeasuresPerMonth(year: string) {
    this.monAirService.getMeasuresPerMonth(year)
      .subscribe((data: any) => {
        // console.log(data);
        const today = new Date()
        if (year === today.getFullYear().toString()) {
          // console.log('same year');
          chartData.datasets[0].data = data['monthly_stats'].slice(0, today.getMonth() + 1);
        } else {
          chartData.datasets[0].data = data['monthly_stats'];
        }
        this.measuresChart.update();
      });
  }

  private static generateYearsList(startYear: number) {
    let currentYear = new Date().getFullYear();
    let result: string[] = []
    for (let year = startYear; year <= currentYear; year++) {
      result.push(year.toString());
    }
    return result
  }

}
