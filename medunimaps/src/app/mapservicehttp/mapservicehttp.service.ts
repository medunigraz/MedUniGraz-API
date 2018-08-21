import { Injectable } from '@angular/core';

//import { Http, Response } from '@angular/http';
//import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { EMPTY } from 'rxjs'
import { map, filter } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/map';
import { of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { MapService } from '../mapservice/map.service';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';
import { API_BASE_URL } from '../base/globalconstants';
import { EdgeWeight } from '../base/edgeweight';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class MapHttpService extends MapService {

  private baseUrl = API_BASE_URL + '/v1/';
  private roomUrl = this.baseUrl + 'geo/rooms/';  // URL to web API
  private edgeUrl = this.baseUrl + 'geo/edges/';
  private floorUrl = this.baseUrl + 'geo/floors/';
  private nodeUrl = this.baseUrl + 'geo/nodes/';
  private doorUrl = this.baseUrl + 'geo/doors/';
  private levelUrl = this.baseUrl + 'geo/level/';
  private routeUrl = this.baseUrl + 'geo/routing/edges/';
  private poiTypeUrl = this.baseUrl + 'geo/pointofinterest/';
  private poiInstanceUrl = this.baseUrl + 'geo/pointofinterestinstance/';
  private edgeWeightTypeUrl = this.baseUrl + 'geo/edgecategory/';
  private beaconUrl = this.baseUrl + 'positioning/beacons/';

  //private requestOptions = {
  //  params: new HttpParams()
  //};

  constructor(protected http: HttpClient, private oauthService: OAuthService) {
    super();
    //this.requestOptions.params.set('Authorization', "Bearer " + this.oauthService.getAccessToken());
    //this.requestOptions.params.set("Content-Type", "application/json");
  }

  getRooms(layer: number): Observable<Object> {
    /*
    return this.http.get(this.roomUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
*/
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.roomUrl + '?level=' + layer, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getRooms', []))
      );
  }

  getNavigationEdges(layer: number): Observable<Object> {

    //var headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});

    //const requestOptions = {
    //  params: new HttpParams()
    //};

    //let options = new RequestOptions({ headers: headers });
    //let options = requestOptions;
    //requestOptions.params.set('Authorization', "Bearer " + this.oauthService.getAccessToken());

    /*
        return this.http.get(this.edgeUrl + '?level=' + layer, this.requestOptions)
          .map(this.extractData)
          .catch(this.handleError);
          */

    //return EMPTY;

    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.edgeUrl + '?level=' + layer, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getNavigationEdges', []))
      );
  }

  getNavigationNodes(layer: number): Observable<Object> {
    //var headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    /*
        return this.http.get(this.nodeUrl + '?level=' + layer, this.requestOptions)
          .map(this.extractData)
          .catch(this.handleError);
          */

    //this.requestOptions.params.set('Authorization', "Bearer " + this.oauthService.getAccessToken());
    //this.requestOptions.params.set("Content-Type", "application/json");

    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    //console.log("MapService::getNavigationNodes() - OPTIONS: " + JSON.stringify(rqOptions));
    //console.log("MapService::getNavigationNodes() - VALID: " + this.oauthService.hasValidAccessToken());
    //console.log("MapService::getNavigationNodes() - TOKEN: " + JSON.stringify(this.oauthService.getAccessToken()));

    return this.http.get<Object>(this.nodeUrl + '?level=' + layer, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getNavigationNodes', []))
      );
  }

  getFloorNames(): Observable<Floor[]> {
    /*
    return this.http.get(this.levelUrl)
      .map(this.extractDataFloors)
      .catch(this.handleError);
      */

    //console.log("MapService::getFloorNames() - ");

    return this.http.get<Object>(this.levelUrl)
      .pipe(
      map(res => this.extractDataFloors(res)),
      catchError(this.handleError('getFloorNames', []))
      );

    //return EMPTY;
  }

  getDoors(layer: number): Observable<Object> {
    /*
    //return this.http.get(this.roomUrl + '?floor=' + layer)
    return this.http.get(this.doorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.doorUrl + '?level=' + layer, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getDoors', []))
      );
  }

  getFloors(layer: number): Observable<Object> {
    /*
    //return this.http.get(this.roomUrl + '?floor=' + layer)
    return this.http.get(this.floorUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
      */
    return this.http.get<Object>(this.floorUrl + '?level=' + layer)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getFloors', []))
      );

    //return this.http.get<Object>(this.floorUrl + '?level=' + layer);
  }

  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    /*
    console.log("Get Route HTTP!");
    return this.http.get(this.routeUrl + '?from=' + sourceNodeId + '&to=' + destinationNodeId)
      .map(this.extractData)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.routeUrl + '?from=' + sourceNodeId + '&to=' + destinationNodeId, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getRoute', []))
      );
  }

  getPoiTypes(): Observable<PoiType[]> {
    /*
    return this.http.get(this.poiTypeUrl)
      .map(this.extractDataPoiTypes)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.poiTypeUrl, rqOptions)
      .pipe(
      map(res => this.extractDataPoiTypes(res)),
      catchError(this.handleError('getPoiTypes', []))
      );
  }

  getEdgeWeightTypes(): Observable<EdgeWeight[]> {

    //var headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    /*
        return this.http.get<EdgeWeight[]>(this.edgeWeightTypeUrl, this.requestOptions)
          .pipe(
          catchError(this.handleError)
          );

          */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.edgeWeightTypeUrl, rqOptions)
      .pipe(
      map(res => this.extractDataEdgeWeightTypes(res)),
      catchError(this.handleError('getEdgeWeightTypes', []))
      );

    //return this.http.get(this.edgeWeightTypeUrl, this.requestOptions)
    //  .map(this.extractDataEdgeWeightTypes)
    //  .catch(this.handleError);
  }

  getPoiInstances(layer: number): Observable<Object> {
    /*
    return this.http.get(this.poiInstanceUrl + '?level=' + layer)
      .map(this.extractData)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.get<Object>(this.poiInstanceUrl + '?level=' + layer, rqOptions)
      .pipe(
      map(res => this.extractData(res)),
      catchError(this.handleError('getPoiInstances', []))
      );
  }

  getBeacons(layer: number): Observable<Object> {
    //var headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });
    /*
    return this.http.get(this.beaconUrl + '?level=' + layer, this.requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
      */

    /*
  let rqOptions = {
    headers: new HttpHeaders({
      "Authorization": "Bearer " + this.oauthService.getAccessToken(),
      "Content-Type": "application/json"
    })
  };

  return this.http.get<Object>(this.beaconUrl + '?level=' + layer, rqOptions)
    .pipe(
    map(res => this.extractData(res)),
    catchError(this.handleError('getBeacons', []))
  );*/

    return EMPTY;
  }

  addEdge(source: number, destination: number, length: number, path: any): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    let data = {
      "category": 1,
      "source": source,
      "destination": destination,
      "path": JSON.stringify(path),
      "length": length
    }

    //console.log("Send Edge: " + JSON.stringify(data));

    /*

    return this.http.post(this.edgeUrl, data, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */

    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.post<Object>(this.edgeUrl, data, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('addEdge', []))
      );
  }

  addNode(floor: number, center: any): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "center": JSON.stringify(center)
    }

    console.log("Send Node: " + JSON.stringify(data));

    /*
    return this.http.post(this.nodeUrl, data, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.post<Object>(this.nodeUrl, data, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('addNode', []))
      );
  }

  addPoiInstance(floor: number, center: any, poitypeid: number): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "name": poitypeid,
      "center": JSON.stringify(center)
    }

    console.log("Send PoiInstance: " + JSON.stringify(data));

    /*

    return this.http.post(this.poiInstanceUrl, data, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.post<Object>(this.poiInstanceUrl, data, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('addPoiInstance', []))
      );
  }

  addBeacon(floor: number, center: any, name: string): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    let data = {
      "level": floor,
      "name": name,
      "position": JSON.stringify(center),
      "active": true
    }

    console.log("Send Beacon: " + JSON.stringify(data));

    /*

    return this.http.post(this.beaconUrl, data, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.post<Object>(this.beaconUrl, data, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('addBeacon', []))
      );
  }

  deleteNode(id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});

    //let options = new RequestOptions({
    //  headers: headers,
    //});

    /*

    return this.http.delete(this.nodeUrl + id + "/", this.requestOptions)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);

      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.delete<Object>(this.nodeUrl + id + "/", rqOptions)
      .pipe(
      map(res => this.extractDataDel(res, id)),
      catchError(this.handleError('deleteNode', []))
      );
  }

  deleteEdge(id: number): Observable<Object> {

    //let headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});

    //let options = new RequestOptions({
    //  headers: headers,
    //});

    /*

    return this.http.delete(this.edgeUrl + id + "/", this.requestOptions)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);

      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.delete<Object>(this.edgeUrl + id + "/", rqOptions)
      .pipe(
      map(res => this.extractDataDel(res, id)),
      catchError(this.handleError('deleteEdge', []))
      );
  }

  deletePoi(id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});

    //let options = new RequestOptions({
    //  headers: headers,
    //});

    /*

    return this.http.delete(this.poiInstanceUrl + id + "/", this.requestOptions)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);

      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.delete<Object>(this.poiInstanceUrl + id + "/", rqOptions)
      .pipe(
      map(res => this.extractDataDel(res, id)),
      catchError(this.handleError('deletePoi', []))
      );
  }

  deleteBeacon(id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});

    //let options = new RequestOptions({
    //  headers: headers,
    //});

    /*

    return this.http.delete(this.beaconUrl + id + "/", this.requestOptions)
      .map(response => this.extractDataDel(response, id))
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.delete<Object>(this.beaconUrl + id + "/", rqOptions)
      .pipe(
      map(res => this.extractDataDel(res, id)),
      catchError(this.handleError('deleteBeacon', []))
      );
  }

  updateEdge(edge: any, id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    //console.log("Update Edge: " + id + "::" + JSON.stringify(edge));

    /*

    return this.http.put(this.edgeUrl + id + "/", edge, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    return EMPTY;
  }

  updateNode(node: any, id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    //console.log("Update Node: " + id + "::" + JSON.stringify(node));

    /*

    return this.http.put(this.nodeUrl + id + "/", node, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.put<Object>(this.nodeUrl + id + "/", node, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('updateNode', []))
      );
  }

  updatePoi(node: any, id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    //console.log("Update Poi: " + id + "::" + JSON.stringify(node));

    /*

        return this.http.put(this.poiInstanceUrl + id + "/", node, this.requestOptions)
          .map(this.extractDataAdd)
          .catch(this.handleError);
          */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.put<Object>(this.poiInstanceUrl + id + "/", node, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('updatePoi', []))
      );
  }

  updateBeacon(beacon: any, id: number): Observable<Object> {
    //let headers = new Headers({
    //  "Content-Type": "application/json",
    //  "Authorization": "Bearer " + this.oauthService.getAccessToken()
    //});
    //let options = new RequestOptions({ headers: headers });

    //console.log("Update Poi: " + id + "::" + JSON.stringify(node));

    /*

    return this.http.put(this.beaconUrl + id + "/", beacon, this.requestOptions)
      .map(this.extractDataAdd)
      .catch(this.handleError);
      */
    let rqOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + this.oauthService.getAccessToken(),
        "Content-Type": "application/json"
      })
    };

    return this.http.put<Object>(this.beaconUrl + id + "/", beacon, rqOptions)
      .pipe(
      map(res => this.extractDataAdd(res)),
      catchError(this.handleError('updateBeacon', []))
      );
  }


  private extractData(res: any) {
    //console.log("RESPONSE DATA...");

    //let body = res.json();
    let body = res;

    //console.log("RESPONSE DATA: " + JSON.stringify(body));

    if (body.results) {
      return body.results || {};
    }
    return body || {};

  }

  private extractDataAdd(res: any) {

    //let body = res.json();
    let body = res;

    //console.log("RESPONSE DATA: " + JSON.stringify(body));

    return body || {};

  }

  private extractDataDel(res: any, id: number) {
    //console.log("RESPONSE DATA org: " + JSON.stringify(res));
    return { id: id };
  }

  private extractDataFloors(res: any) {
    //let body = res.json();
    let body = res;
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

  private extractDataPoiTypes(res: any) {

    //let body = res.json();
    let body = res;
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

  private extractDataEdgeWeightTypes(res: any) {

    //let body = res.json();
    let body = res;
    if (body.results) {
      body = body.results;
    }
    console.log("RESPONSE DATA EDGEWEIGHTS: " + JSON.stringify(body));
    let edgeweights: EdgeWeight[] = [];
    for (let obj of body) {
      edgeweights.push(new EdgeWeight(obj));
    }
    return edgeweights;

  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /*
    private handleError(error: HttpErrorResponse) {
      //private handleError(error: HttpResponse<Object> | any) {
      /*
      // In a real world app, we might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof HttpResponse) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
      console.error("handleError: " + errMsg);
      return Observable.throw(errMsg);

}
  */

}
