import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import {PoiType} from '../base/poiType';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  private pois: PoiType[] = PoiType.getDemoData();

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
    }
    //console.log("SidemenuComponent::updatePOIs() " + JSON.stringify(this.pois));
  }

  close() {
    console.log("SidemenuComponent::close()");
  }
}
