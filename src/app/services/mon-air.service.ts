import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MonAirService {
  private serverUrl = environment.serverUrl;
  public dbMeasuresRef: AngularFireList<any>;
  public dbNodesRef: AngularFireList<any>;
  public dbStatsRef: AngularFireObject<any>;

  constructor(private http: HttpClient, private fbDatabase: AngularFireDatabase) {
    this.dbMeasuresRef = fbDatabase.list('/measures');
    this.dbNodesRef = fbDatabase.list('/nodes');
    this.dbStatsRef = fbDatabase.object('/stats');
  }

  getAllData(): Observable<any> {
    return this.dbMeasuresRef.snapshotChanges().pipe(map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    );
  }

  getNodesList(): Observable<any[]> {
    return this.dbNodesRef.valueChanges().pipe();
  }

  getNumberOfNodes() {
    return this.http.get(this.serverUrl + '/getNodesNumber');
  }

  getMeasures() {
    return this.http.get(this.serverUrl + '/getMeasures');
  }

  getNumberOfMeasures() {
    return this.dbStatsRef.valueChanges().pipe();
    // return this.http.get(this.serverUrl + '/getMeasuresNumber');
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

  getMeasuresPerMonth(year: string) {
    // return this.http.get<{ [key: string]: any[] }>(this.serverUrl + '/getMeasuresPerMonth?year=' + year);
    return this.fbDatabase.object('/stats/measures_per_year/' + year).valueChanges().pipe();
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
