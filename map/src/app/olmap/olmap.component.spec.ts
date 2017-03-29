/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OlmapComponent } from './olmap.component';

describe('OlmapComponent', () => {
  let component: OlmapComponent;
  let fixture: ComponentFixture<OlmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
