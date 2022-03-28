import {Component, OnInit, OnDestroy} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import * as moment from "moment/moment";
import {environment} from "../../../environments/environment";
import {MonAirService} from "../../shared/services/mon-air.service";
import {state, trigger, style, transition, animate} from "@angular/animations";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '840px',
        opacity: 1,
      })),
      state('closed', style({
        height: 0,
        opacity: 0.8,
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
    trigger('searching', [
      state('noSearch', style({
        marginTop: '10em',
        // 'justify-content': 'center',
        marginLeft: '12em',
        height: '15em',
        // width: '70em'
      })),
      state('search', style({
        marginTop: 0,
        // 'justify-content': 'start',
        marginLeft: '0em !important',
        height: '7em',
        // width: 'auto'
      })),
      transition('noSearch <=> search', [
        animate('0.5s')
      ]),
    ])
  ],
})

export class MapComponent implements OnInit, OnDestroy {
  public measures: any[] = [];
  public selectedParameter: string;
  public startDate: string;
  public endDate: string;
  public filename: string;
  public map: any;
  private style = 'mapbox://styles/mapbox/streets-v11';
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(private monAirService: MonAirService) {
    this.selectedParameter = 'temperature';
    // this.startDate = moment().format('yyyy-MM-DThh:mm');
    this.startDate = '2019-06-20T12:00';
    // this.log(this.startDate);
    this.endDate = '2019-06-20T17:00';
    this.filename = "";
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
      .getNodesMeasures(moment(this.startDate).toISOString(), moment(this.endDate).toISOString(), this.selectedParameter)
      .then((value: any) => {
        let features: any = []
        this.measures = value
        // console.log('value', this.measures);

        this.measures.map((measure: any) => {
          measure['value'] = measure[this.selectedParameter];
          features.push({
            'type': 'Feature',
            'properties': measure,
            // 'properties': {
            //   'value': measure[this.selectedParameter],
            //   'node': measure['node_id'],
            //   'date': measure['date'],
            //   // 'impact': measure['impact'],
            //   // 'fraction': measure['fraction'],
            //   'iconSize': [40, 40]
            // },
            'geometry': {
              'type': 'Point',
              'coordinates': [measure['lng'], measure['lat']]
            }
          });
        });

        this.map.remove();

        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          accessToken: environment.mapbox.accessToken,
          zoom: 13,
          center: [4.864864, 45.766216]
        });

        this.map.on('load', () => {
          this.map.addControl(new mapboxgl.NavigationControl())
          this.map.addSource('pollution', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features
            },
            // cluster: true,
            // clusterMaxZoom: 13, // Max zoom to cluster points on
            // clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
          });

          // this.map.addLayer({
          //   id: 'clusters',
          //   type: 'circle',
          //   source: 'pollution',
          //   filter: ['has', 'point_count'],
          //   paint: {
          //     // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          //     // with three steps to implement three types of circles:
          //     //   * Blue, 20px circles when point count is less than 100
          //     //   * Yellow, 30px circles when point count is between 100 and 750
          //     //   * Pink, 40px circles when point count is greater than or equal to 750
          //     'circle-color': [
          //       'step',
          //       ['get', 'point_count'],
          //       '#51bbd6',
          //       100,
          //       '#f1f075',
          //       750,
          //       '#f28cb1'
          //     ],
          //     'circle-radius': [
          //       'step',
          //       ['get', 'point_count'],
          //       20,
          //       100,
          //       30,
          //       750,
          //       40
          //     ]
          //   }
          // });
          //
          // this.map.addLayer({
          //   id: 'cluster-count',
          //   type: 'symbol',
          //   source: 'pollution',
          //   filter: ['has', 'point_count'],
          //   layout: {
          //     'text-field': '{point_count_abbreviated}',
          //     'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          //     'text-size': 12
          //   }
          // });

          this.map.addLayer({
            'id': 'unclustered-point',
            'type': 'circle',
            'source': 'pollution',
            'filter': ['!', ['has', 'point_count']],
            'paint': {
              'circle-radius': {
                'base': 1.75,
                'stops': [
                  [12, 4],
                  [22, 50]
                ]
              },
              'circle-color': [
                "rgb",
                // red is higher when feature.properties.temperature is higher
                180,
                // green is always zero
                ['-', 255, ["get", "value"]],
                // blue is higher when feature.properties.temperature is lower
                24
              ],
              'circle-opacity': {
                  default: 0,
                  stops: [
                    [12, 0],
                    [15, 1]
                  ]
                }
            },
          });

          this.map.addLayer(
            {
              id: 'trees-heat',
              type: 'heatmap',
              source: 'pollution',
              // maxzoom: 15,
              paint: {
                // increase weight as diameter breast height increases
                'heatmap-weight': {
                  property: this.selectedParameter,
                  type: 'exponential',
                  stops: [
                    [1, 0],
                    [62, 1]
                  ]
                },
                // increase intensity as zoom level increases
                'heatmap-intensity': {
                  stops: [
                    [11, 1],
                    [15, 3]
                  ]
                },
                // assign color values be applied to points depending on their density
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(236,222,239,0)',
                  0.2,
                  'rgb(208,209,230)',
                  0.4,
                  'rgb(166,189,219)',
                  0.6,
                  'rgb(103,169,207)',
                  0.8,
                  'rgb(28,144,153)'
                ],
                // increase radius as zoom increases
                'heatmap-radius': {
                  stops: [
                    [11, 15],
                    [15, 20]
                  ]
                },
                // decrease opacity to transition into the circle layer
                'heatmap-opacity': {
                  default: 1,
                  stops: [
                    [14, 1],
                    [15, 0]
                  ]
                }
              }
            }
          );

          this.map.on('click', 'unclustered-point', (e: any) => {
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML('<p><b>Date:</b> ' + moment(e.features[0].properties.date).format('dddd, D MMMM YYYY - H[h]mm:ss') +
                '</p> <p><b>Node: </b>' + e.features[0].properties['node_id'] + '</p>  <p><b>' +
                this.selectedParameter.toLocaleUpperCase() + ' = </b>' + e.features[0].properties[this.selectedParameter] +
                ' ' + this.monAirService.getParamUnit(this.selectedParameter) + '</p>')
              .addTo(this.map);
          });

          this.map.on('mouseenter', 'unclustered-point', () => {
            this.map.getCanvas().style.cursor = 'pointer';
          });

// Change it back to a pointer when it leaves.
          this.map.on('mouseleave', 'unclustered-point', () => {
            this.map.getCanvas().style.cursor = '';
          });

          this.generateHeatmap();

        });

      });

    // this.isOpen = true;


  }

  generateHeatmap() {
    let points: any[] = []
    this.measures.map((measure:any) => {
      points.push({
        lat: measure['lat'],
        lon: measure['lng'],
        val: measure[this.selectedParameter]
      });
    });

    // console.log(points);
  }

  onParamChange() {
    this.map.setPaintProperty('unclustered-point', 'circle-color', [
      "rgb",
      // red is higher when feature.properties.temperature is higher
      ['+', 50, ['*', 2, ["get", this.selectedParameter]]],
      // green is always zero
      80,
      // blue is higher when feature.properties.temperature is lower
      ['-', 255, ['*', 2, ["get", this.selectedParameter]]]
    ]);
  }

  exportData() {

  }

  ngOnDestroy(): void {
    this.map.remove();
  }

}
