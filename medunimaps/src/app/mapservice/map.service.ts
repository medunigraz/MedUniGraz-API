import { Injectable } from '@angular/core';
import { BASEMAP } from './mock-basemap02';
import { BASEMAP_1 } from './mock-basemap01';
import { FLOORS } from './mock-floors';
import {ROOMS} from './mock-rooms';
import {DEMOROUTE} from './mock-route';
import {ROOMS_MAP} from './mock-roomGeoInformation'
import {NAVIGATIONEDGES_DEMO} from './mock-navigationedges'

import {Room} from '../base/room';
import { Floor } from '../base/floor';
import { Observable } from 'rxjs';

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
    return Observable.of(FLOORS);
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
    return Observable.of(NAVIGATIONEDGES_DEMO);
  }

  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    console.log("Get Route Local!");
    return Observable.of(DEMOROUTE);
  }

  searchRoom(term: string): Observable<Room[]> {
    //https://angular.io/docs/ts/latest/tutorial/toh-pt6.html
    var rooms: Room[] = [];
    //console.log('searchRoom...');

    if (term.length == 0) {
      return Observable.of(rooms);
    }

    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].name.startsWith(term)) {
        rooms.push(ROOMS[i]);
      }
    }

    return Observable.of(rooms);
  }

  getNavigationNodes(layer: number): Observable<Object> {
    return Observable.of({
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

  deleteNode(id: number): Observable<Object> {
    return null;
  }

  deleteEdge(id: number): Observable<Object> {
    return null;
  }

  updateNode(node: any, id: number): Observable<Object> {
    return null;
  }

  updateEdge(edge: any, id: number): Observable<Object> {
    return null;
  }
}
