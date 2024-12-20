import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";

const parameterUnits: { [key: string]: string } = {
  'temperature': '°C',
  'humidity': '%',
  'pm1': 'µg/m3',
  'pm25': 'µg/m3',
  'pm10': 'µg/m3'
}

// const regionOfInterest: any = [
//   {"lat": 45.776087, "lon": 4.841163},
//   {"lat": 45.748183, "lon": 4.837987},
//   {"lat": 45.750998, "lon": 4.864165},
//   {"lat": 45.771896, "lon": 4.868800}
// ]

@Injectable({
  providedIn: 'root'
})

export class MonAirService {
  get dbMeasuresRef(): AngularFireList<any> {
    return this._dbMeasuresRef;
  }

  set dbMeasuresRef(value: AngularFireList<any>) {
    this._dbMeasuresRef = value;
  }
  // private serverUrl = environment.serverUrl;
  private _dbMeasuresRef: AngularFireList<any>;
  private dbNodesRef: AngularFireList<any>;
  private dbStatsRef: AngularFireObject<any>;
  private dbConfRef: AngularFireObject<any>
  private paramRanges: any;

  constructor(private fbDatabase: AngularFireDatabase) {
    this._dbMeasuresRef = fbDatabase.list('/measuresRaw');
    this.dbNodesRef = fbDatabase.list('/nodes');
    this.dbStatsRef = fbDatabase.object('/stats');
    this.dbConfRef = fbDatabase.object('/config/paramRanges');
    this.getParamRanges().subscribe((data: any) => {
      this.paramRanges = data['paramRanges'];
    });
  }

  // getAllData(): Observable<any> {
  //   return this.dbMeasuresRef.snapshotChanges().pipe(map(changes =>
  //       changes.map(c =>
  //         ({key: c.payload.key, ...c.payload.val()})
  //       )
  //     )
  //   );
  // }

  getTotalNodesList(): Observable<any[]> {
    return this.dbNodesRef.valueChanges().pipe();
  }

  getTotalNumberOfMeasures() {
    return this.dbStatsRef.valueChanges().pipe();
  }

  getNumberOfMeasuresPerYear(year: string) {
    const startDate = new Date(year + "-01-01T00:00:00.000Z");
    const endDate = new Date(year + "-12-31T23:59:59.000Z");
    return this.fbDatabase.database.ref().child('measures').orderByChild("date")
      .startAt(startDate.toISOString()).endAt(endDate.toISOString());
  }

  getMeasuresPerMonth(year: string) {
    return this.fbDatabase.object('/stats/measures_per_year/' + year).valueChanges()
      .pipe();
  }

  // getTopContributors(limit: number) {
  //   return this.http.get<Object[]>(this.serverUrl + '/getTopContributorsNodes?limit=' + limit);
  // }

  getNodesMeasures(startDate: string, endDate: string) {
    return this.fbDatabase.database.ref().child('measuresRaw').orderByChild("date")
      .startAt(new Date(startDate).toISOString()).endAt(new Date(endDate).toISOString())
      .get().then(snapshot => {
        let measures: any[] = [];
        snapshot.forEach(measure => {
          if (measure.val()["lng"] !== 0 && measure.val()["lat"] !== 0) {
            measures.push(measure.val());
          }
        });
        return measures;
      });
  }

  getParamUnit(parameter: string) {
    return parameterUnits[parameter]
  }

  getParamRanges() {
    return this.dbConfRef.valueChanges().pipe();
  }

  // get RoI() {
  //   return regionOfInterest;
  // }
}
