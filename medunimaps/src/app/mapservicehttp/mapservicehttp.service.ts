import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { MapService } from '../mapservice/map.service';

@Injectable()
export class MapHttpService extends MapService {

  private roomUrl = '/geo/rooms/';  // URL to web API
  private edgeUrl = '/geo/edges/';
  private nodeUrl = '/geo/nodes/';

  constructor(private http: Http) {
    super();
  }

  getRoomMap(layer: number): Observable<Object> {
    return this.http.get(this.roomUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationEdges(layer: number): Observable<Object> {
    return this.http.get(this.edgeUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getNavigationNodes(layer: number): Observable<Object> {
    return this.http.get(this.nodeUrl)
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

  private extractData(res: Response) {
    console.log("RESPONSE DATA...");
    let body = res.json();

    console.log("RESPONSE DATA: " + JSON.stringify(body));

    return body.results || {};
  }

  private extractDataAdd(res: Response) {
    let body = res.json();

    console.log("RESPONSE DATA: " + JSON.stringify(body));

    return body || {};
  }

  private extractDataDel(res: Response, id: number) {
    console.log("RESPONSE DATA org: " + JSON.stringify(res));
    return { id: id };
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
