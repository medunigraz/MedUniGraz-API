import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MapService } from '../mapservice/map.service';
import { Floor } from '../base/floor';

@Injectable()
export class MapHttpService extends MapService {

  private baseUrl = '/v1'
  private roomUrl = this.baseUrl + '/geo/rooms/';  // URL to web API
  private edgeUrl = this.baseUrl + '/geo/edges/';
  private nodeUrl = this.baseUrl + '/geo/nodes/';
  private floorUrl = this.baseUrl + '/geo/floors/';
  private routeUrl = this.baseUrl + '/geo/routing/edges/';

  constructor(private http: Http) {
    super();
  }

  getRoomMap(layer: number): Observable<Object> {
    return this.http.get(this.roomUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationEdges(layer: number): Observable<Object> {
    return this.http.get(this.edgeUrl + '?floor=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationNodes(layer: number): Observable<Object> {
    return this.http.get(this.nodeUrl + '?floor=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFloors(): Observable<Floor[]> {
    return this.http.get(this.floorUrl)
      .map(this.extractDataFloors)
      .catch(this.handleError);
  }

  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    console.log("Get Route HTTP!");
    return this.http.get(this.routeUrl + '?from=' + sourceNodeId + '&to=' + destinationNodeId)
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

    console.log("Send Edge: " + JSON.stringify(data));

    return this.http.post(this.edgeUrl, data, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  addNode(floor: number, center: any): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let data = {
      "floor": floor,
      "center": JSON.stringify(center)
    }

    console.log("Send Node: " + JSON.stringify(data));

    return this.http.post(this.nodeUrl, data, options)
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

  updateEdge(edge: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("Update Edge: " + id + "::" + JSON.stringify(edge));

    return this.http.put(this.edgeUrl + id + "/", edge, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }

  updateNode(node: any, id: number): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("Update Node: " + id + "::" + JSON.stringify(node));

    return this.http.put(this.nodeUrl + id + "/", node, options)
      .map(this.extractDataAdd)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    console.log("RESPONSE DATA...");
    let body = res.json();

    console.log("RESPONSE DATA: " + JSON.stringify(body));

    if (body.results) {
      return body.results || {};
    }
    return body || {};
  }

  private extractDataAdd(res: Response) {
    let body = res.json();

    console.log("RESPONSE DATA: " + JSON.stringify(body));

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
