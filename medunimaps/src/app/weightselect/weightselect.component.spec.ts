import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightselectComponent } from './weightselect.component';

describe('WeightselectComponent', () => {
  let component: WeightselectComponent;
  let fixture: ComponentFixture<WeightselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
