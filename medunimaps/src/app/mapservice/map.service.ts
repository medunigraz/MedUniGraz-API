import { Injectable } from '@angular/core';
import { BASEMAP } from './mock-basemap02';
import { FLOORS } from './mock-floors';
import {ROOMS} from './mock-rooms';
import {DEMOROUTE} from './mock-route';
import {ROOMS_MAP} from './mock-roomGeoInformation'

import {Room} from '../base/room';
import { Observable } from 'rxjs';

@Injectable()
export class MapService {

  constructor() { }

  getBaseMapIntern(layer: number): Promise<Object> {
    if (layer == 0) {
      return Promise.resolve(BASEMAP);
    }
    return Promise.resolve(BASEMAP);
  }

  getBaseMap(layer: number): Promise<Object> {
    return new Promise<Object>(resolve =>
      setTimeout(resolve, 1000)) // delay 2 seconds
      .then(() => this.getBaseMapIntern(layer));
  }

  getFloors(): Promise<Array<string>> {
    return new Promise<Array<string>>(resolve =>
      setTimeout(resolve, 500)) // delay 2 seconds
      .then(() => Promise.resolve(FLOORS.reverse()));
  }

  getRoomMap(layer: number): Promise<Object> {
    return new Promise<Object>(resolve =>
      setTimeout(resolve, 500)) // delay 2 seconds
      .then(() => this.getRoomMapIntern(layer));
  }

  getRoomMapIntern(layer: number): Promise<Object> {
    if (layer == 0) {
      return Promise.resolve(ROOMS_MAP);
    }
    return Promise.resolve(ROOMS_MAP);
  }


  getRoute(): Promise<Object[]>
  {
    return new Promise<Array<string>>(resolve =>
      setTimeout(resolve, 300)) // delay 2 seconds
      .then(() => Promise.resolve(DEMOROUTE));
  }

  searchRoom(term: string): Observable<Room[]> {
    //https://angular.io/docs/ts/latest/tutorial/toh-pt6.html
    var rooms: Room[] = [];
    console.log('searchRoom...');

    if(term.length == 0)
    {
      return Observable.of(rooms);
    }

    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].name.startsWith(term)) {
        rooms.push(ROOMS[i]);
      }
    }

    return Observable.of(rooms);
  }
}
