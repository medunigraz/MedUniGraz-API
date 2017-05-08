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

  private pois: PoiType[] = PoiType.getDemoData();

  @Output() poiTypesChangedEvt = new EventEmitter<PoiType[]>();

  constructor(private mapService: MapService) { }

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
      this.poiTypesChangedEvt.emit(this.pois);
    }
    //console.log("SidemenuComponent::updatePOIs() " + JSON.stringify(this.pois));
  }

  selectedChanged() {
    if (this.pois) {
      this.poiTypesChangedEvt.emit(this.pois);
    }
    //console.log("SidemenuComponent::selectedChanged() " + JSON.stringify(this.pois));
  }

  close() {
    console.log("SidemenuComponent::close()");
  }
}
