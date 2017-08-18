import { ViewChild, Component } from '@angular/core';
import { Floor } from './base/floor';
import { OlmapComponent } from './olmap/olmap.component'
import { SearchcontrolComponent } from './searchcontrol/searchcontrol.component'
import { FloorcontrolComponent } from './floorcontrol/floorcontrol.component'
import { MainappService } from './mainappservice/mainapp.service';

import { MdSidenav } from '@angular/material';

import { FloorList } from './base/floorlist';
import { Room } from './base/room';
import { RouteNodes } from './base/routeNodes';
import { PoiType } from './base/poitype';
import { Position } from './base/position';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('sidenav') public sideNav: MdSidenav;
  @ViewChild('mapComp') public mapComponent: OlmapComponent;
  @ViewChild('searchBoxComp') public searchBoxComponent: SearchcontrolComponent;
  @ViewChild('floorComp') public floorControlComponent: FloorcontrolComponent;

  private isSideMenuOpenend: boolean = false;
  currentFloor: Floor = Floor.getDefaultFloor();

  private poiTypes: PoiType[] = null;

  private floors: FloorList = null;

  constructor(
    private mainAppService: MainappService
  ) {
    mainAppService.changeEmitted$.subscribe(
      room => {
        console.log("AppComponent - Room from URL..." + room.text);
        this.searchBoxComponent.showRoomCalled(room);
      });
  }


  floorsReceived(floors: FloorList): void {
    if (floors) {
      //console.log("AppComponent --- floorsReceived: " + JSON.stringify(floors));
      this.floors = floors;
      this.mapComponent.setFloorList(floors);
    }
  }


  floorChanged(floor: Floor): void {
    if (floor) {
      console.log("AppComponent --- floorChanged: " + floor.name);
      this.currentFloor = floor;
    }
  }

  roomSelected(room: Room): void {
    console.log("AppComponent --- roomSelected: " + JSON.stringify(room) + "###Floor: " + JSON.stringify(this.currentFloor));

    if (this.currentFloor.id != room.level) {
      this.floorControlComponent.currentFloorFromId(room.level);
    }

    this.mapComponent.showRoom(room);
  }

  routeSelected(route: RouteNodes): void {
    console.log("AppComponent --- routeSelected: " + JSON.stringify(route) + "###Floor: " + JSON.stringify(this.currentFloor));

    if (route) {
      if (this.currentFloor.id != route.start.level) {
        this.floorControlComponent.currentFloorFromId(route.start.level);
      }

      this.mapComponent.showRoute(route.start.id, route.end.id);
    }
    else {
      this.mapComponent.clearRoute();
    }
  }

  openSideMenu(open: boolean): void {

    console.log("AppComponent --- open Side Menu..." + open);
    this.isSideMenuOpenend = open;
    this.sideNav.open();
  }

  sideNavClosed() {
    console.log("AppComponent --- Side Nav closed");
    this.mapComponent.setFocus();
  }

  showRouteCalled(destinationRoom: Room) {
    //console.log('AppComponent::showRouteCalled: ' + result.text);
    this.searchBoxComponent.showRouteCalled(destinationRoom);
  }

  highlightRouteLevelsCalled(levels: number[]) {
    console.log("AppComponent::highlightRouteLevels!!!");
    this.floorControlComponent.highlightLevels(levels);
  }

  poiTypesChanged(poiTypes: PoiType[]) {
    if (poiTypes) {
      //console.log("AppComponent --- poiTypesChanged: " + poiTypes.length);
      this.poiTypes = poiTypes;
      this.mapComponent.updatePoiTypes(this.poiTypes);
    }
  }

  livePositionChanged(livePos: Position) {
    //console.log("AppComponent --- livePositionChanged: " + JSON.stringify(livePos));



    if (livePos && this.mapComponent.allowZoomToLivePos()) {
      if (livePos.level != this.currentFloor.id) {
        this.floorControlComponent.currentFloorFromId(livePos.level);
      }
    }

    this.mapComponent.showLivePosition(livePos);
  }

}
