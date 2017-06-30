import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MapService } from '../mapservice/map.service';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';

@Injectable()
export class MapHttpService extends MapService {

  private baseUrl = '/v1';
  private roomUrl = this.baseUrl + '/geo/rooms/';  // URL to web API
  private edgeUrl = this.baseUrl + '/geo/edges/';
  private floorUrl = this.baseUrl + '/geo/floors/';
  private nodeUrl = this.baseUrl + '/geo/nodes/';
  private doorUrl = this.baseUrl + '/geo/doors/';
  private levelUrl = this.baseUrl + '/geo/level/';
  private routeUrl = this.baseUrl + '/geo/routing/edges/';
  private poiTypeUrl = this.baseUrl + '/geo/pointofinterest/';
  private poiInstanceUrl = this.baseUrl + '/geo/pointofinterestinstance/';
  private beaconUrl = this.baseUrl + '/positioning/beacons/';

  constructor(private http: Http) {
    super();
  }

  getRooms(layer: number): Observable<Object> {
    return this.http.get(this.roomUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationEdges(layer: number): Observable<Object> {
    return this.http.get(this.edgeUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationNodes(layer: number): Observable<Object> {
    return this.http.get(this.nodeUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFloorNames(): Observable<Floor[]> {
    return this.http.get(this.levelUrl)
      .map(this.extractDataFloors)
      .catch(this.handleError);
  }

  getDoors(layer: number): Observable<Object> {
    //return this.http.get(this.roomUrl + '?floor=' + layer)
    return this.http.get(this.doorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFloors(layer: number): Observable<Object> {
    //return this.http.get(this.roomUrl + '?floor=' + layer)
    return this.http.get(this.floorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    console.log("Get Route HTTP!");
    return this.http.get(this.routeUrl + '?from=' + sourceNodeId + '&to=' + destinationNodeId)
      .map(this.extractData)
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

  getBeacons(layer: number): Observable<Object> {
    return this.http.get(this.beaconUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addEdge(source: number, destination: number, length: number, path: any): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let data = {
      "source": source,
      "destination": destination,
      "path": JSON.stringify(path),
      "length": length
    }

    //console.log("Send Edge: " + JSON.stringify(data));

    return this.http.post(this.edgeUrl, data, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  addNode(floor: number, center: any): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "center": JSON.stringify(center)
    }

    console.log("Send Node: " + JSON.stringify(data));

    return this.http.post(this.nodeUrl, data, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  addPoiInstance(floor: number, center: any, poitypeid: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "name": poitypeid,
      "center": JSON.stringify(center)
    }

    console.log("Send PoiInstance: " + JSON.stringify(data));

    return this.http.post(this.poiInstanceUrl, data, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  addBeacon(floor: number, center: any, mac: string, name: string): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "mac": mac,
      "name": name,
      "position": JSON.stringify(center),
      "active": true
    }

    console.log("Send Beacon: " + JSON.stringify(data));

    return this.http.post(this.beaconUrl, data, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  deleteNode(id: number): Observable<Object> {
    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });

    return this.http.delete(this.nodeUrl + id + "/", options)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);
  }

  deleteEdge(id: number): Observable<Object> {

    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });

    return this.http.delete(this.edgeUrl + id + "/", options)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);
  }

  deletePoi(id: number): Observable<Object> {
    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });

    return this.http.delete(this.poiInstanceUrl + id + "/", options)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);
  }

  deleteBeacon(id: number): Observable<Object> {
    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });

    return this.http.delete(this.beaconUrl + id + "/", options)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);
  }

  updateEdge(edge: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //console.log("Update Edge: " + id + "::" + JSON.stringify(edge));

    return this.http.put(this.edgeUrl + id + "/", edge, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  updateNode(node: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //console.log("Update Node: " + id + "::" + JSON.stringify(node));

    return this.http.put(this.nodeUrl + id + "/", node, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  updatePoi(node: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //console.log("Update Poi: " + id + "::" + JSON.stringify(node));

    return this.http.put(this.poiInstanceUrl + id + "/", node, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  updateBeacon(beacon: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    //console.log("Update Poi: " + id + "::" + JSON.stringify(node));

    return this.http.put(this.beaconUrl + id + "/", beacon, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    //console.log("RESPONSE DATA...");
    let body = res.json();

    //console.log("RESPONSE DATA: " + JSON.stringify(body));

    if (body.results) {
      return body.results || {};
    }
    return body || {};
  }

  private extractDataAdd(res: Response) {
    let body = res.json();

    //console.log("RESPONSE DATA: " + JSON.stringify(body));

    return body || {};
  }

  private extractDataDel(res: Response, id: number) {
    //console.log("RESPONSE DATA org: " + JSON.stringify(res));
    return { id: id };
  }

  private extractDataFloors(res: Response) {
    let body = res.json();
    if (body.results) {
      body = body.results;
    }
    console.log("RESPONSE DATA FLOORS: " + JSON.stringify(body));
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
