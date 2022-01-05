
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
//import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poiType';
import { SearchResult } from '../base/searchresult';
import { MAX_NUM_OF_AUTOCOMPLETE_RESULTS, API_BASE_URL } from '../base/globalconstants';

import { Logger } from '../base/logger';



@Injectable()
export class MapService {

  private baseUrl = API_BASE_URL + '/v1/';
  private searchUrl = this.baseUrl + 'api/autocomplete/';
  private roomUrl = this.baseUrl + 'geo/rooms/';
  private doorUrl = this.baseUrl + 'geo/doors/';
  private floorUrl = this.baseUrl + 'geo/floors/';
  private levelUrl = this.baseUrl + 'geo/level/';
  private routeUrl = this.baseUrl + 'geo/routing/edges/';
  private poiTypeUrl = this.baseUrl + 'geo/pointofinterest/';
  private poiInstanceUrl = this.baseUrl + 'geo/pointofinterestinstance/';
  private livePosUrl = this.baseUrl + 'positioning/locate/';
  private orgUnitUrl = this.baseUrl + 'structure/organization/';
  private additionalBuildingUrl = this.baseUrl + 'geo/buildings/';
  constructor(private http: HttpClient) { }

  getRooms(layer: number): Observable<Object> {
    //Logger.log("MapService::getRooms: " + layer);
    return this.http.get(this.roomUrl + '?level=' + layer).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getRoomByID(id: number): Observable<Object> {
    return this.http.get(this.roomUrl + '?campusonline=' + id).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getFloors(layer: number): Observable<Object> {
    return this.http.get(this.floorUrl + '?level=' + layer).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getAdditionalBuildings(): Observable<Object> {
    return this.http.get(this.additionalBuildingUrl).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getAdditionalBuildingById(id: number): Observable<Object> {
    return this.http.get(this.additionalBuildingUrl + '?campusonline=' + id).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getDoors(layer: number): Observable<Object> {
    return this.http.get(this.doorUrl + '?level=' + layer).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getFloorNames(): Observable<Floor[]> {
    return this.http.get(this.levelUrl).pipe(
      map(this.extractDataLevels),
      catchError(this.handleError),);
  }

  getPoiTypes(): Observable<PoiType[]> {
    return this.http.get(this.poiTypeUrl).pipe(
      map(this.extractDataPoiTypes),
      catchError(this.handleError),);
  }

  getPoiInstances(layer: number): Observable<Object> {
    return this.http.get(this.poiInstanceUrl + '?level=' + layer).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  search(term: string, limit: number): Observable<{ data: SearchResult[]; nexturl: string; }> {
    let url = this.searchUrl + '?limit=' + limit + '&q=' + term;
    Logger.log("MapService::search " + url);
    return this.http.get(url).pipe(
      map(this.extractDataSearch),
      catchError(this.handleError),);
  }

  searchFromUrl(url: string): Observable<{ data: SearchResult[]; nexturl: string; }> {
    Logger.log("MapService::search " + url);
    return this.http.get(url).pipe(
      map(this.extractDataSearch),
      catchError(this.handleError),);
  }


  getRoute(sourceNodeId: number, destinationNodeId: number): Observable<Object> {
    let url = this.routeUrl + '?from=' + sourceNodeId + '&to=' + destinationNodeId;
    Logger.log("MapService::getRoute " + url)

    return this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getLivePos(urlString: string): Observable<Object> {

    return this.http.get(this.livePosUrl + '?' + urlString).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  getOrgUnits(): Observable<Object> {
    return this.http.get(this.orgUnitUrl).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }

  private extractData(res: any) {
    //Logger.log("RESPONSE DATA...");
    let body = res;

    //Logger.log("RESPONSE DATA: " + JSON.stringify(body));

    if (body.results) {             //For multiple pages
      return body.results || {};
    }
    return body || {};
  }

  private extractDataLevels(res: any) {
    let body = res;
    if (body.results) {
      body = body.results;
    }
    let floors: Floor[] = [];
    for (let obj of body) {
      floors.push(new Floor(obj));
    }
    return floors;
  }

  private extractDataPoiTypes(res: any) {
    let body = res;
    if (body.results) {
      body = body.results;
    }
    //Logger.log("RESPONSE DATA POITYPES: " + JSON.stringify(body));
    let poitypes: PoiType[] = [];
    for (let obj of body) {
      poitypes.push(new PoiType(obj));
    }
    return poitypes;
  }

  private extractDataSearch(res: any) {
    let body = res;
    let nextUrl = body.next;
    if (body.results) {
      body = body.results;
    }
    //Logger.log("RESPONSE DATA POITYPES: " + JSON.stringify(body));
    let searchResults: SearchResult[] = [];
    let i = 0;
    for (let obj of body) {
      searchResults.push(SearchResult.createFromRestObj(obj));
      i++;
      if (i >= MAX_NUM_OF_AUTOCOMPLETE_RESULTS) {
        break;
      }
    }
    let obj =
      {
        data: searchResults,
        nexturl: nextUrl
      }
    return obj;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    errMsg = error.message ? error.message : error.toString();
    /*
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    */
    console.error("handleError: " + errMsg);
    return observableThrowError(errMsg);
  }

}
