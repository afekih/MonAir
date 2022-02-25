import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MonAirService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getNodesList(): Observable<any[]> {
    return this.http.get<any[]>(this.serverUrl + '/getNodesList');
  }

  getNodesNumber() {
    return this.http.get(this.serverUrl + '/getNodesNumber');
  }

  getMeasures() {
    return this.http.get(this.serverUrl + '/getMeasures');
  }

  getMeasuresNumber() {
    return this.http.get(this.serverUrl + '/getMeasuresNumber');
  }

  getMovingPoints(type: string, startDate: any, endDate: any, parameter: any) {
    return this.http.post(this.serverUrl + '/getMoving' + type, {
      "start_date": startDate,
      "end_date": endDate,
      "parameter": parameter
    });
  }

  getNodesMeasures(type: string, startDate: any, endDate: any, parameter: any) {
    return this.http.post(this.serverUrl + '/getMeasures' + type, {
      "start_date": startDate,
      "end_date": endDate,
      "parameter": parameter
    });
    // return this.http.get(this.serverUrl + ':' + this.serverPort + '/getMeasures?start_date=' + startDate + '&end_date=' + endDate +
    //   '&parameter=' + parameter);
    // return this.http.get(this.serverUrl + ':' + this.serverPort + '/getNodeMeasuresFile?campaign=' + campaign +
    //   '&start_date=' + startDate + '&end_date=' + endDate + '&parameter=' + parameter);
    // return this.http.post(this.serverUrl + ':' + this.serverPort + '/getNodeMeasuresFile', [{
    //   nodesList: nodesList,
    //   start_date: startDate,
    //   end_date: endDate
    // }]);
  }

  getMeasuresPerMonth(year: number) {
    return this.http.get<{[key: string]: any[]}>(this.serverUrl + '/getMeasuresPerMonth?year=' + year);
  }

  getTopContributors(limit: number) {
    return this.http.get<Object[]>(this.serverUrl + '/getTopContributorsNodes?limit=' + limit);
  }

  dummy() {
    return this.http.get(this.serverUrl + '/test');
  }

  // refresh() {
  //   return this.http.get();
  // }
}
