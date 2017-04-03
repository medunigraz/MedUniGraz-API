import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  private baseUrl = '/v1'
  private searchUrl = this.baseUrl + '/geo/autocomplete/';  // URL to web API

  constructor() { }

}
