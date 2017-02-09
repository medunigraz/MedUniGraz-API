/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapcontrollerserviceService } from './mapcontrollerservice.service';

describe('MapcontrollerserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapcontrollerserviceService]
    });
  });

  it('should ...', inject([MapcontrollerserviceService], (service: MapcontrollerserviceService) => {
    expect(service).toBeTruthy();
  }));
});
