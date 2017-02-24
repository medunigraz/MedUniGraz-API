/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditablemapComponent } from './editablemap.component';

describe('EditablemapComponent', () => {
  let component: EditablemapComponent;
  let fixture: ComponentFixture<EditablemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditablemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditablemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
