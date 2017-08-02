import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeaconinfoComponent } from './beaconinfo.component';

describe('BeaconinfoComponent', () => {
  let component: BeaconinfoComponent;
  let fixture: ComponentFixture<BeaconinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeaconinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
