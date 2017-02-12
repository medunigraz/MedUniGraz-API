/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapservicehttpService } from './mapservicehttp.service';

describe('MapservicehttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapservicehttpService]
    });
  });

  it('should ...', inject([MapservicehttpService], (service: MapservicehttpService) => {
    expect(service).toBeTruthy();
  }));
});
