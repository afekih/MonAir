import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import Chart, {ChartItem} from 'chart.js/auto';
import {MonAirService} from "../../shared/services/mon-air.service";
import {barChartData, chartOptions} from "../../shared/variables/chart-options";
import * as moment from "moment/moment";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from "rxjs";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-test-old-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['node_id', 'lorawan_address', 'contribution', 'last_seen', 'last_location'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  public measuresChart: any;
  public nodesList: any[];
  public yearlyNodesList: any[];
  public yearlyNodesNumber: number;
  public yearlyNodeIDsList: any;
  public yearlyNumberOfMeasures: number;
  public totalNumberOfMeasures: number;
  public selectedYear: string;
  public yearsList: string[];
  private activeConnection: Subscription = new Subscription();

  constructor(private monAirService: MonAirService) {
    this.nodesList = [];
    this.yearlyNodesList = [];
    this.yearlyNodeIDsList = [];
    this.yearlyNumberOfMeasures = 0;
    this.totalNumberOfMeasures = 0;
    this.yearlyNodesNumber = 0;
    this.selectedYear = new Date().getFullYear().toString();

    this.yearsList = DashboardComponent.generateYearsList(2019);
  }

  ngOnInit(): void {
    this.measuresChart = new Chart(
      <ChartItem>document.getElementById('measuresBarChart'),
      {
        type: 'bar',
        data: barChartData,
        options: chartOptions
      }
    );

    //TODO: Don't forget to unsubscribe at OnDestroy()
    this.getTotalNumberOfMeasures();


  }

  public getMeasuresPerMonth(year: string) {
    this.activeConnection.unsubscribe();
    this.activeConnection = this.monAirService.getMeasuresPerMonth(year)
      .subscribe((data: any) => {
        if (data === null || data['nodes'] === null) {
          barChartData.datasets[0].data = [];
          this.yearlyNodesNumber = 0;
          this.yearlyNodesList = [];
        } else {
          let nodes = data['nodes'];
          this.yearlyNodeIDsList = Object.fromEntries(Object.entries(nodes).filter(([key, value]) => {
            return value as number > 0;
          }));
          this.yearlyNodesNumber = Object.keys(this.yearlyNodeIDsList).length;
          this.yearlyNodesList = this.nodesList.filter((element) => {
            return Object.keys(this.yearlyNodeIDsList).includes(element['node_id']);
          });

          const today = new Date();
          if (year === today.getFullYear().toString()) {
            barChartData.datasets[0].data = data['monthly_stats'].slice(0, today.getMonth() + 1) || [];
          } else {
            barChartData.datasets[0].data = data['monthly_stats'] || [];
          }
        }
        this.dataSource = new MatTableDataSource<any>(this.yearlyNodesList);
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;

        this.measuresChart.update();
        this.yearlyNumberOfMeasures = barChartData.datasets[0].data.reduce((a, b) => a + b, 0);
        this.yearlyNodesList.forEach((element) => {
          element['contribution'] = this.yearlyNodeIDsList[element['node_id']] * 100 / this.yearlyNumberOfMeasures;
        });
      });
  }

  getTotalNumberOfMeasures() {
    //TODO: Don't forget to unsubscribe at OnDestroy()
    this.monAirService.getTotalNumberOfMeasures()
      .subscribe((data: any) => {
        this.totalNumberOfMeasures = (data !== null) ? data["measures_count"] : 0;
        this.monAirService.getTotalNodesList()
          .subscribe((data: Object[]) => {
            this.nodesList = data;
            this.nodesList.map(node => {
              node["contribution"] = node["measures_count"] * 100 / this.totalNumberOfMeasures;
              node["last_seen_date"] = moment(node['last_seen']).format('dddd, D MMMM YYYY - H[h]mm');
            });

            this.getMeasuresPerMonth(this.selectedYear);
          });
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

  ngOnDestroy(): void {
    this.activeConnection.unsubscribe();
  }

}
