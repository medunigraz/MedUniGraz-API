import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { Floor } from '../base/floor';
import {PoiType} from '../base/poiType';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  private baseUrl = '/v1'
  private searchUrl = this.baseUrl + '/geo/autocomplete/';
  private roomUrl = this.baseUrl + '/geo/rooms/';
  private doorUrl = this.baseUrl + '/geo/doors/';
  private floorUrl = this.baseUrl + '/geo/floors/';
  private levelUrl = this.baseUrl + '/geo/level/';
  private routeUrl = this.baseUrl + '/geo/routing/edges/';
  private poiTypeUrl = this.baseUrl + '/geo/pointofinterest/';
  private poiInstanceUrl = this.baseUrl + '/geo/pointofinterestinstance/';

  constructor(private http: Http) { }

  getRooms(layer: number): Observable<Object> {
    return this.http.get(this.roomUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFloors(layer: number): Observable<Object> {
    return this.http.get(this.floorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDoors(layer: number): Observable<Object> {
    return this.http.get(this.doorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFloorNames(): Observable<Floor[]> {
    return this.http.get(this.levelUrl)
      .map(this.extractDataLevels)
      .catch(this.handleError);
  }

  getPoiTypes(): Observable<PoiType[]> {
    return this.http.get(this.poiTypeUrl)
      .map(this.extractDataPoiTypes)
      .catch(this.handleError);
  }

  getPoiInstances(layer: number): Observable<Object> {
    return this.http.get(this.poiInstanceUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    //console.log("RESPONSE DATA...");
    let body = res.json();

    //console.log("RESPONSE DATA: " + JSON.stringify(body));

    if (body.results) {             //For multiple pages
      return body.results || {};
    }
    return body || {};
  }

  private extractDataLevels(res: Response) {
    let body = res.json();
    if (body.results) {
      body = body.results;
    }
    let floors: Floor[] = [];
    for (let obj of body) {
      floors.push(new Floor(obj));
    }
    return floors;
  }

  private extractDataPoiTypes(res: Response) {
    let body = res.json();
    if (body.results) {
      body = body.results;
    }
    console.log("RESPONSE DATA POITYPES: " + JSON.stringify(body));
    let poitypes: PoiType[] = [];
    for (let obj of body) {
      poitypes.push(new PoiType(obj));
    }
    return poitypes;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error("handleError: " + errMsg);
    return Observable.throw(errMsg);
  }

}
