import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { MapService } from '../mapservice/map.service';

import {PoiType} from '../base/poiType';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  public pois: PoiType[] = [];

  @Output() poiTypesChangedEvt = new EventEmitter<PoiType[]>();

  constructor(private mapService: MapService) { }

  public isOpened = false;

  ngOnInit() {
    this.updateData();
  }

  public updateData(): any {
    this.mapService.getPoiTypes().subscribe(
      poiTypes => this.updatePOIs(poiTypes),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  updatePOIs(poiTypeList: PoiType[]) {
    if (poiTypeList) {
      this.pois = poiTypeList;
      this.groupPois();
      this.ungroupPois(); //Set Active State to group master
      this.poiTypesChangedEvt.emit(this.pois);
    }
    //console.log("SidemenuComponent::updatePOIs() " + JSON.stringify(this.pois));
  }

  selectedChanged() {
    if (this.pois) {
      this.ungroupPois();
      this.poiTypesChangedEvt.emit(this.pois);
    }
    //console.log("SidemenuComponent::selectedChanged() " + JSON.stringify(this.pois));
  }

  close() {
    console.log("SidemenuComponent::close()");
    this.isOpened = false;
  }

  open() {
    console.log("SidemenuComponent::open()");
    this.isOpened = true;
  }

  private groupPois() {

    let stairIndex = -1;

    for (let i = 0; i < this.pois.length; i++) {
      if (this.pois[i].name == 'Stiege') {
        stairIndex = i;
      }
    }

    if (stairIndex >= 0) {
      for (let i = 0; i < this.pois.length; i++) {
        if (i != stairIndex && this.pois[i].name.startsWith('Stiege')) {
          this.pois[i].isVisible = false;
          this.pois[i].groupIndex = stairIndex;
        }
      }
    }
  }

  private ungroupPois() {
    for (let i = 0; i < this.pois.length; i++) {
      if (this.pois[i].groupIndex >= 0 && this.pois[i].groupIndex) {
        this.pois[i].isActive = this.pois[this.pois[i].groupIndex].isActive;
      }
    }
  }
}
