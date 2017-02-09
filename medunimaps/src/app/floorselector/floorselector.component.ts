import { Component, OnInit } from '@angular/core';
import { MapService } from '../mapservice/map.service';

@Component({
  selector: 'app-floorselector',
  templateUrl: './floorselector.component.html',
  styleUrls: ['./floorselector.component.css']
})
export class FloorselectorComponent implements OnInit {

  floorList = [];
  selectedFloor: String;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.getFloors().then(floors => this.updateFloors(floors));
  }

  onSelect(floor: String): void {
    this.selectedFloor = floor;
    console.log("Floor: " + floor);
  }

  updateFloors(floors) {
    this.floorList = floors;
    if (this.floorList.length > 0) {
      this.selectedFloor = this.floorList[0];
    }
  }
}
