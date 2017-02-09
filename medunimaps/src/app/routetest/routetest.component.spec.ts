/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoutetestComponent } from './routetest.component';

describe('RoutetestComponent', () => {
  let component: RoutetestComponent;
  let fixture: ComponentFixture<RoutetestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutetestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutetestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
