import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable ,  of } from 'rxjs';

import { MapService } from '../mapservice/map.service';


import { Floor } from '../base/floor';
import { FloorList } from '../base/floorlist';
import { Room } from '../base/room';
import { RouteNodes } from '../base/routeNodes';

import { Logger } from '../base/logger';

@Component({
  selector: 'app-floorcontrol',
  templateUrl: './floorcontrol.component.html',
  styleUrls: ['./floorcontrol.component.css']
})
export class FloorcontrolComponent implements OnInit {

  floorList: Floor[] = [];
  selectedFloor: Floor = null;

  @Output() currentFloorEvt = new EventEmitter<Floor>();
  @Output() floorsReceivedEvt = new EventEmitter<FloorList>();

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.updateData();
  }

  public updateData(): any {

    this.mapService.getFloorNames().subscribe(
      floors => this.updateFloors(floors),
      error => Logger.log("ERROR deleteNode: " + <any>error));
  }

  onSelect(floor: Floor): void {
    this.selectFloor(floor);
    //Logger.log("Floor: " + JSON.stringify(floor));
  }

  updateFloors(floors: Floor[]) {
    this.floorList = floors;

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

      //Logger.log("FloorselectorComponent::updateFloors Floor: " + JSON.stringify(this.floorList[i]));
    }

    this.floorsReceivedEvt.emit(new FloorList(this.floorList));

    for (let floor of this.floorList) {
      if (floor.name.startsWith('EG')) {
        this.selectFloor(floor);
        //Logger.log("FloorselectorComponent::updateFloors Select Floor: " + JSON.stringify(floor));
        return;
      }
    }

    if (this.floorList.length > 0) {
      this.selectFloor(this.floorList[0]);
      //Logger.log("FloorselectorComponent::updateFloors Select Floor: " + JSON.stringify(this.selectedFloor));
    }
  }

  currentFloorFromId(floorId: number) {
    //Logger.log("FloorcontrolComponent::Set currentFloor - New Floor: " + JSON.stringify(floorId));

    if (this.floorList) {
      for (let floor of this.floorList) {
        if (floor.id == floorId) {
          this.selectFloor(floor);
          return;
        }
      }
    }
  }

  selectFloor(floor: Floor) {
    //Logger.log("FloorcontrolComponent::Set currentFloor - Select floor: " + JSON.stringify(floor));
    this.selectedFloor = floor;

    for (let i = 0; i < this.floorList.length; i++) {
      if (this.floorList[i].id != this.selectedFloor.id) {
        this.floorList[i].resetSelected();
      }
      else {
        this.floorList[i].setSelected();
      }
    }

    this.currentFloorEvt.emit(this.selectedFloor);
  }

  public highlightLevels(levels) {

    //Logger.log("FloorcontrolComponent::highlightLevels! " + JSON.stringify(levels));

    if (!levels) {
      levels = [];
    }

    for (let i = 0; i < this.floorList.length; i++) {
      if (levels.indexOf(this.floorList[i].id) < 0) {
        this.floorList[i].resetHighlight();
      }
      else {
        this.floorList[i].setHighlighted();
      }
    }
  }

  private loadDemoFloors() {
    of([
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
      error => Logger.log("ERROR deleteNode: " + <any>error));
  }

}
