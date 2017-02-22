import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';

import { TestmapComponent} from '../testmap/testmap.component';

@Component({
  selector: 'app-routetest',
  templateUrl: './routetest.component.html',
  styleUrls: ['./routetest.component.css']
})
export class RoutetestComponent implements OnInit {

  @Input()
  mapComponentRef: TestmapComponent;

  routeVisible: boolean = false;


  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }
  }

  toogleroute(): void {
    console.log('Toogle Route');

    if (this.routeVisible) {
      this.mapComponentRef.hideRoute();
      this.routeVisible = false;
    }
    else {
      this.mapService.getRoute().then(route => this.showRoute(route));


      this.mapService.addEdge(14, 16, 1.123, {
        'type': 'LineString',
        'coordinates': [
          [1722178.9470130377, 5955230.595548892],
          [1722198.6534343925, 5955261.05092735]
        ]
      }).
        subscribe(
        edge => this.edgeAdded(edge),
        error => console.log("ERROR: " + <any>error));

      /*
             this.mapService.deleteEdge(6).subscribe(
                                  edge => this.edgeDeleted(edge),
                                  error =>  console.log("ERROR deleteEdge: " + <any>error ));
      */

    }
  }

  edgeAdded(edge: any): void {
    console.log("edgeAdded... " + JSON.stringify(edge));

    edge.properties.destination = 19;
    this.mapService.updateEdge(edge, edge.id).
      subscribe(
      edge => this.edgeUpdated(edge),
      error => console.log("ERROR: " + <any>error));
  }

  edgeDeleted(edge: any): void {
    console.log("edgeDeleted... " + JSON.stringify(edge));
  }

  edgeUpdated(edge: any): void {
    console.log("edgeUpdated... " + JSON.stringify(edge));
  }


  showRoute(route: Object[]): void {
    this.mapComponentRef.showRoute(route);
    this.routeVisible = true;
  }
}
