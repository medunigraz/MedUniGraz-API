import { Component, OnInit } from '@angular/core';
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
  selectedFloor: Floor;

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.updateData();
  }

  public updateData(): any {

    this.mapService.getFloors().subscribe(
      floors => this.updateFloors(floors),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  onSelect(floor: Floor): void {
    this.selectedFloor = floor;
    console.log("Floor: " + floor);
  }

  updateFloors(floors: Floor[]) {
    this.floorList = floors;

    for (let floor of this.floorList) {
      if (floor.name = 'EG') {
        this.selectedFloor = floor;
        return;
      }
    }

    if (this.floorList.length > 0) {
      this.selectedFloor = this.floorList[0];
    }
  }
}
