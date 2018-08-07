/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainappService } from './mainapp.service';

describe('MainappService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainappService]
    });
  });

  it('should ...', inject([MainappService], (service: MainappService) => {
    expect(service).toBeTruthy();
  }));
});
