import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Floor } from '../base/floor';

@Component({
  selector: 'app-floorcontrol',
  templateUrl: './floorcontrol.component.html',
  styleUrls: ['./floorcontrol.component.css']
})
export class FloorcontrolComponent implements OnInit {

  floorList: Floor[] = [];
  selectedFloor: Floor = null;

  @Output() currentFloorEvt = new EventEmitter<Floor>();

  constructor() { }

  ngOnInit() {
    this.updateData();
  }

  public updateData(): any {

    Observable.of([
      new Floor({
        "id": 1,
        "name": "OG3",
        "building": 1
      }),
      new Floor({
        "id": 1,
        "name": "OG2",
        "building": 1
      }),
      new Floor({
        "id": 1,
        "name": "OG1",
        "building": 1
      }),
      new Floor({
        "id": 2,
        "name": "EG",
        "building": 1
      })
    ]).subscribe(
      floors => this.updateFloors(floors),
      error => console.log("ERROR deleteNode: " + <any>error));

  }

  onSelect(floor: Floor): void {
    this.selectFloor(floor);
    //console.log("Floor: " + JSON.stringify(floor));
  }

  updateFloors(floors: Floor[]) {
    this.floorList = floors;

    for (let floor of this.floorList) {
      if (floor.name == 'EG') {
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