import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { Floor } from '../base/floor';
import { USEHTTPSERVICE } from '../base/globalconstants';

@Component({
  selector: 'app-floorselector',
  templateUrl: './floorselector.component.html',
  styleUrls: ['./floorselector.component.css']
})
export class FloorselectorComponent implements OnInit {

  floorList: Floor[] = [];
  selectedFloor: Floor = null;

  @Output() currentFloorEvt = new EventEmitter<Floor>();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.updateData();
  }

  public updateData(): any {

    this.mapService.getFloorNames().subscribe(
      floors => this.updateFloors(floors),
      error => console.log("ERROR getFloorNames: " + <any>error));
  }

  onSelect(floor: Floor): void {
    this.selectFloor(floor);
    //console.log("Floor: " + JSON.stringify(floor));
  }

  updateFloors(floors: Floor[]) {
    this.floorList = floors;

    console.log("FloorselectorComponent::updateFloors Floors: " + JSON.stringify(this.floorList));
    console.log("FloorselectorComponent::updateFloors Floors: COUNT: " + this.floorList.length);

    for (let i = 0; i < this.floorList.length; i++) {
      if (i == 0) {
        this.floorList[i].floorAbove = -1;
      }
      else {
        this.floorList[i].floorAbove = this.floorList[i - 1].id;
      }

      if (i == (this.floorList.length - 1)) {
        this.floorList[i].floorBelow = -1;
      }
      else {
        this.floorList[i].floorBelow = this.floorList[i + 1].id;
      }

      console.log("FloorselectorComponent::updateFloors Floor: " + this.floorList[i].name);
      console.log("   FloorselectorComponent::updateFloors Floor: " + JSON.stringify(this.floorList[i]));
    }

    for (let floor of this.floorList) {
      if (floor.name.startsWith('EG')) {
        this.selectFloor(floor);
        //console.log("FloorselectorComponent::updateFloors Select Floor: " + JSON.stringify(floor));
        return;
      }
    }

    if (this.floorList.length > 0) {
      this.selectFloor(this.floorList[0]);
      //console.log("FloorselectorComponent::updateFloors Select Floor: " + JSON.stringify(this.selectedFloor));
    }
  }

  private selectFloor(floor: Floor) {
    this.selectedFloor = floor;
    this.currentFloorEvt.emit(this.selectedFloor);
  }
}
