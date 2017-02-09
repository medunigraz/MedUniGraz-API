/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FloorselectorComponent } from './floorselector.component';

describe('FloorselectorComponent', () => {
  let component: FloorselectorComponent;
  let fixture: ComponentFixture<FloorselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
