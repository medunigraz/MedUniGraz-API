import { Injectable } from '@angular/core';
import { BASEMAP } from './mock-basemap02';
import { BASEMAP_1 } from './mock-basemap01';
import { FLOORS } from './mock-floors';
import { ROOMS } from './mock-rooms';
import { DEMOROUTE } from './mock-route';
import { ROOMS_MAP } from './mock-roomGeoInformation'
import { NAVIGATIONEDGES_DEMO } from './mock-navigationedges'

import { Room } from '../base/room';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';
import { EdgeWeight } from '../base/edgeweight';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class MapService {

  constructor() { }

  getBaseMapIntern(layer: number): Promise<Object> {
    if (layer == 1) {
      return Promise.resolve(BASEMAP);
    }
    return Promise.resolve(BASEMAP_1);
  }

  getBaseMap(layer: number): Promise<Object> {
    return new Promise<Object>(resolve =>
      setTimeout(resolve, 200)) // delay 2 seconds
      .then(() => this.getBaseMapIntern(layer));
  }

  getFloorNames(): Observable<Floor[]> {
    return of(FLOORS);
  }

  getRooms(layer: number): Observable<Object> {
    return null;
  }

  getDoors(layer: number): Observable<Object> {
    return null;
  }

  getFloors(layer: number): Observable<Object> {
    return null;
  }

  getNavigationEdges(layer: number): Observable<Object> {
    return this.getNavigationEdgesIntern(layer);
  }

  getNavigationEdgesIntern(layer: number): Observable<Object> {
    return of(NAVIGATIONEDGES_DEMO);
  }

  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    console.log("Get Route Local!");
    return of(DEMOROUTE);
  }

  getPoiTypes(): Observable<PoiType[]> {
    return null;
  }

  getPoiInstances(layer: number): Observable<Object> {
    return null;
  }

  getBeacons(layer: number): Observable<Object> {
    return null;
  }

  getEdgeWeightTypes(): Observable<EdgeWeight[]> {
    return null;
  }


  searchRoom(term: string): Observable<Room[]> {
    //https://angular.io/docs/ts/latest/tutorial/toh-pt6.html
    var rooms: Room[] = [];
    //console.log('searchRoom...');

    if (term.length == 0) {
      return of(rooms);
    }

    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].name.startsWith(term)) {
        rooms.push(ROOMS[i]);
      }
    }

    return of(rooms);
  }

  getNavigationNodes(layer: number): Observable<Object> {
    return of({
      'geojson': {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [
            ]
          }
        }]
      }
    });
  }

  addNode(floor: number, center: any): Observable<Object> {
    return null;
  }

  addEdge(source: number, destination: number, length: number, path: any): Observable<Object> {
    return null;
  }

  addPoiInstance(floor: number, center: any, poitypeid: number): Observable<Object> {
    return null;
  }

  addBeacon(floor: number, center: any, name: string): Observable<Object> {
    return null;
  }

  deleteNode(id: number): Observable<Object> {
    return null;
  }

  deleteEdge(id: number): Observable<Object> {
    return null;
  }

  deletePoi(id: number): Observable<Object> {
    return null;
  }

  deleteBeacon(id: number): Observable<Object> {
    return null;
  }

  updateNode(node: any, id: number): Observable<Object> {
    return null;
  }

  updateEdge(edge: any, id: number): Observable<Object> {
    return null;
  }

  updatePoi(node: any, id: number): Observable<Object> {
    return null;
  }

  updateBeacon(beacon: any, id: number): Observable<Object> {
    return null;
  }

}
