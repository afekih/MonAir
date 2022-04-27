import {Component, OnInit, OnDestroy} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import * as moment from "moment/moment";
import {environment} from "../../../environments/environment";
import {MonAirService} from "../../shared/services/mon-air.service";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
  private style = 'mapbox://styles/mapbox/streets-v11';
  public measures: any[] = [];
  public pointsColorIndex: any[] = [];
  public selectedParameter: string;
  public startDate: string;
  public endDate: string;
  public filename: string;
  public paramUnit: string;
  public map: any;
  public minMax = {
    min: 0,
    max: 0
  }
  public paramRanges: any;

  constructor(private monAirService: MonAirService) {
    this.selectedParameter = 'temperature';
    // this.startDate = moment().format('yyyy-MM-DThh:mm');
    this.startDate = '2019-06-20T12:00';
    this.endDate = '2019-06-20T17:00';
    this.filename = "";
    this.paramUnit = this.monAirService.getParamUnit(this.selectedParameter);
    this.monAirService.getParamRanges().subscribe((data: any) => {
      this.paramRanges = data;
    });
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      accessToken: environment.mapbox.accessToken,
      zoom: 13,
      center: [4.864864, 45.766216]
    });
    // this.map.addControl(new mapboxgl.NavigationControl());
  }

  log(variable: any) {
    console.log(variable);
  }

  getNodeMeasuresPoints() {
    this.monAirService
      .getNodesMeasures(moment(this.startDate).toISOString(), moment(this.endDate).toISOString())
      .then((value: any) => {
        let features: any = []
        this.measures = value

        if (value.length > 0) {

          let minMaxTemp = this.getMinMaxValues(this.measures, 'temperature');
          let minMaxHum = this.getMinMaxValues(this.measures, 'humidity');
          let minMaxPm10 = this.getMinMaxValues(this.measures, 'pm10');
          let minMaxPm25 = this.getMinMaxValues(this.measures, 'pm25');
          this.minMax = this.getMinMaxValues(this.measures, this.selectedParameter);

          this.measures.map((measure: any) => {
            measure['value'] = measure[this.selectedParameter];

            measure['temperature_ind'] = (measure['temperature'] - minMaxTemp['min']) / (minMaxTemp['max'] - minMaxTemp['min']);
            measure['humidity_ind'] = (measure['humidity'] - minMaxHum['min']) / (minMaxHum['max'] - minMaxHum['min']);
            measure['pm10_ind'] = (measure['pm10'] - minMaxPm10['min']) / (minMaxPm10['max'] - minMaxPm10['min']);
            measure['pm25_ind'] = (measure['pm25'] - minMaxPm25['min']) / (minMaxPm25['max'] - minMaxPm25['min']);
            let range: any = Object.entries(this.paramRanges['pm25'])
              .filter((range: any) => {
                // console.log(range);
                return range[1]['min'] <= measure['pm25'] && measure['pm25'] <= range[1]['max']
              });
            measure['pm25_color'] = range[0][1]['color'];
            range = Object.entries(this.paramRanges['pm10'])
              .filter((range: any) => {
                // console.log(range);
                return range[1]['min'] <= measure['pm10'] && measure['pm10'] <= range[1]['max']
              });
            measure['pm10_color'] = range[0][1]['color'];

            features.push({
              'type': 'Feature',
              'properties': measure,
              'geometry': {
                'type': 'Point',
                'coordinates': [measure['lng'], measure['lat']]
              }
            });
          });

          console.log(this.measures[0]);

          this.map.remove();

          this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            accessToken: environment.mapbox.accessToken,
            zoom: 13,
            center: [this.measures[0]["lng"], this.measures[0]["lat"]]
          });

          this.map.on('load', () => {
            this.map.addControl(new mapboxgl.NavigationControl())
            this.map.addSource('pollution', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: features
              }
            });

            this.map.addLayer({
              'id': 'measure-point',
              'type': 'circle',
              'source': 'pollution',
              'filter': ['!', ['has', 'point_count']],
              'paint': {
                'circle-radius': {
                  'base': 1.75,
                  'stops': [
                    [12, 4],
                    [22, 100]
                  ]
                },
                // 'circle-color': [
                //   "rgb",
                //   // red is higher when feature.properties.temperature is higher
                //   ['+', ['*', ["get", this.selectedParameter + "_ind"], 70], 180],
                //   // green is always zero
                //   ['-', 255, ['*', ["get", this.selectedParameter + "_ind"], 255]],
                //   // blue is higher when feature.properties.temperature is lower
                //   0
                // ],
                // "circle-color": ["get", "color"]
                // 'circle-opacity': {
                //   default: 0,
                //   stops: [
                //     [12, 0],
                //     [15, 1]
                //   ]
                // }
              },
            });

            this.setPointColors();

            // this.map.addLayer(
            //   {
            //     id: 'trees-heat',
            //     type: 'heatmap',
            //     source: 'pollution',
            //     // maxzoom: 15,
            //     paint: {
            //       // increase weight as diameter breast height increases
            //       'heatmap-weight': {
            //         property: this.selectedParameter,
            //         type: 'exponential',
            //         stops: [
            //           [1, 0],
            //           [62, 1]
            //         ]
            //       },
            //       // increase intensity as zoom level increases
            //       'heatmap-intensity': {
            //         stops: [
            //           [11, 1],
            //           [15, 3]
            //         ]
            //       },
            //       // assign color values be applied to points depending on their density
            //       'heatmap-color': [
            //         'interpolate',
            //         ['linear'],
            //         ['heatmap-density'],
            //         0,
            //         'rgba(236,222,239,0)',
            //         0.2,
            //         'rgb(208,209,230)',
            //         0.4,
            //         'rgb(166,189,219)',
            //         0.6,
            //         'rgb(103,169,207)',
            //         0.8,
            //         'rgb(28,144,153)'
            //       ],
            //       // increase radius as zoom increases
            //       'heatmap-radius': {
            //         stops: [
            //           [11, 15],
            //           [15, 20]
            //         ]
            //       },
            //       // decrease opacity to transition into the circle layer
            //       'heatmap-opacity': {
            //         default: 1,
            //         stops: [
            //           [14, 1],
            //           [15, 0]
            //         ]
            //       }
            //     }
            //   }
            // );

            this.map.on('click', 'measure-point', (e: any) => {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<p><b>Date:</b> ' + moment(e.features[0].properties.date).format('dddd, D MMMM YYYY - H[h]mm:ss') +
                  '</p> <p><b>Node: </b>' + e.features[0].properties['node_id'] + '</p>  <p><b>' +
                  this.selectedParameter.toLocaleUpperCase() + ' = </b>' + e.features[0].properties[this.selectedParameter] +
                  ' ' + this.monAirService.getParamUnit(this.selectedParameter) + '</p>')
                .addTo(this.map);
            });

            // Change the pointer form when it hovers a point
            this.map.on('mouseenter', 'measure-point', () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            this.map.on('mouseleave', 'measure-point', () => {
              this.map.getCanvas().style.cursor = '';
            });

            this.generateHeatmap();

          });
        } else {
          alert("no measures found for the selected dates");
        }
      });
  }

  getMinMaxValues(data: any, param: string) {
    if (param === 'humidity') {
      return {min: 0, max: 100}
    }
    let maxValue = Math.max.apply(Math, data.map((o: any) => {
      return o[param];
    }));
    let minValue = Math.min.apply(Math, data.map((o: any) => {
      return o[param];
    }));

    return {min: minValue, max: maxValue}
  }

  generateHeatmap() {
    let points: any[] = []
    this.measures.map((measure: any) => {
      points.push({
        lat: measure['lat'],
        lon: measure['lng'],
        val: measure[this.selectedParameter]
      });
    });
  }

  onParamChange() {
    this.minMax = this.getMinMaxValues(this.measures, this.selectedParameter);
    this.paramUnit = this.monAirService.getParamUnit(this.selectedParameter);

    this.measures.map((measure: any) => {
      measure['fraction'] = (measure[this.selectedParameter] - this.minMax.min) / (this.minMax.max - this.minMax.min);
    });

    this.setPointColors();
  }

  setPointColors() {
    if (!this.selectedParameter.includes('pm')) {
      this.map.setPaintProperty('measure-point', 'circle-color', [
        "rgb",
        // red is higher when feature.properties.temperature is higher
        ['+', ['*', ["get", this.selectedParameter + "_ind"], 70], 180],
        // green is always zero
        ['-', 255, ['*', ["get", this.selectedParameter + "_ind"], 255]],
        // blue is higher when feature.properties.temperature is lower
        0
      ]);
    } else {
      this.map.setPaintProperty('measure-point', 'circle-color', ["get", this.selectedParameter + "_color"]);
    }
  }

  exportData() {

  }

  // perc2color(perc: number) {
  //   let r, g, b = 0;
  //   if (perc < 50) {
  //     r = 255;
  //     g = Math.round(5.1 * perc);
  //   } else {
  //     g = 255;
  //     r = Math.round(510 - 5.10 * perc);
  //   }
  //   let h = r * 0x10000 + g * 0x100 + b * 0x1;
  //   return [r, g, b]
  //   // return '#' + ('000000' + h.toString(16)).slice(-6);
  // }

  ngOnDestroy(): void {
    this.map.remove();
  }

}
