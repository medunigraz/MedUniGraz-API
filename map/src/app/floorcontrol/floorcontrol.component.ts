import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MapService } from '../mapservice/map.service';

import { Floor } from '../base/floor';
import {Room} from '../base/room';
import {RouteNodes} from '../base/routeNodes';

@Component({
  selector: 'app-floorcontrol',
  templateUrl: './floorcontrol.component.html',
  styleUrls: ['./floorcontrol.component.css']
})
export class FloorcontrolComponent implements OnInit {

  floorList: Floor[] = [];
  selectedFloor: Floor = null;

  @Output() currentFloorEvt = new EventEmitter<Floor>();

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.updateData();
  }

  public updateData(): any {

    this.mapService.getFloorNames().subscribe(
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

  currentFloorFromId(floorId: number) {
    console.log("FloorcontrolComponent::Set currentFloor - New Floor: " + JSON.stringify(floorId));

    if (this.floorList) {
      for (let floor of this.floorList) {
        if (floor.id == floorId) {
          this.selectFloor(floor);
          return;
        }
      }
    }
  }

  private selectFloor(floor: Floor) {
    this.selectedFloor = floor;
    this.currentFloorEvt.emit(this.selectedFloor);
  }

  private loadDemoFloors() {
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

}
