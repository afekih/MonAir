import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";
import {map} from "rxjs/operators";
import firebase from "firebase/compat";

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
          ({key: c.payload.key, ...c.payload.val()})
        )
      )
    );
  }

  getTotalNodesList(): Observable<any[]> {
    return this.dbNodesRef.valueChanges().pipe();
  }

  getTotalNumberOfMeasures() {
    return this.dbStatsRef.valueChanges().pipe();
    // return this.http.get(this.serverUrl + '/getMeasuresNumber');
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
