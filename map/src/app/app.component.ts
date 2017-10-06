import { ViewChild, Component, OnInit } from '@angular/core';
import { Floor } from './base/floor';
import { OlmapComponent } from './olmap/olmap.component'
import { SearchcontrolComponent } from './searchcontrol/searchcontrol.component'
import { FloorcontrolComponent } from './floorcontrol/floorcontrol.component'
import { MainappService } from './mainappservice/mainapp.service';
import { SidemenuComponent } from './sidemenu/sidemenu.component'
import { PositionComponent } from './position/position.component'
import { MapService } from './mapservice/map.service';

import { FloorList } from './base/floorlist';
import { Room } from './base/room';
import { RouteNodes } from './base/routeNodes';
import { PoiType } from './base/poitype';
import { Position } from './base/position';

import { Logger } from './base/logger';

declare var globalURLParamRoomID: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') public sideNav: SidemenuComponent;
  @ViewChild('mapComp') public mapComponent: OlmapComponent;
  @ViewChild('searchBoxComp') public searchBoxComponent: SearchcontrolComponent;
  @ViewChild('floorComp') public floorControlComponent: FloorcontrolComponent;
  @ViewChild('positionComp') public positionComponent: PositionComponent;

  private isSideMenuOpenend: boolean = false;
  currentFloor: Floor = Floor.getDefaultFloor();
  private poiTypes: PoiType[] = null;
  private floors: FloorList = null;

  private livePosStatus = false;

  private liveRoute: RouteNodes = undefined;

  constructor(
    private mainAppService: MainappService, private mapService: MapService
  ) {
    mainAppService.changeEmitted$.subscribe(
      room => {
        Logger.log("AppComponent - Room from URL..." + room.text);
        this.searchBoxComponent.showRoomCalled(room);
      });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (globalURLParamRoomID) {
      Logger.log("AppComponent::ngOnInit init - " + globalURLParamRoomID);
      this.mapService.getRoomByID(globalURLParamRoomID).subscribe(
        rooms => this.roomRecieved(rooms),
        error => Logger.log("ERROR getRoomByID: " + <any>error));
    }
  }

  roomRecieved(roomFeatures: any) {
    Logger.log("AppComponent::roomsRecieved - " + JSON.stringify(roomFeatures));
    if (roomFeatures.features) {
      if (roomFeatures.features.length > 0) {
        let roomFeature = roomFeatures.features[0];
        //Logger.log("RouteCompComponent::roomRecieved - " + JSON.stringify(roomFeature));
        let room = Room.createFromRestObj(roomFeature);
        this.searchBoxComponent.showRoomCalled(room);
      }
    }
  }

  floorsReceived(floors: FloorList): void {
    if (floors) {
      //Logger.log("AppComponent --- floorsReceived: " + JSON.stringify(floors));
      this.floors = floors;
      this.mapComponent.setFloorList(floors);
    }
  }


  floorChanged(floor: Floor): void {
    if (floor) {
      Logger.log("AppComponent --- floorChanged: " + floor.name);
      this.currentFloor = floor;
    }
  }

  roomSelected(room: Room): void {
    Logger.log("AppComponent --- roomSelected: " + JSON.stringify(room) + "###Floor: " + JSON.stringify(this.currentFloor));

    if (room.level >= 0 && this.currentFloor.id != room.level) {
      this.floorControlComponent.currentFloorFromId(room.level);
    }

    this.mapComponent.showRoom(room);
  }

  routeSelected(route: RouteNodes): void {
    Logger.log("AppComponent --- routeSelected: " + JSON.stringify(route) + "###Floor: " + JSON.stringify(this.currentFloor));

    this.liveRoute = undefined;

    if (route) {
      if (route.start) {
        this.positionComponent.stopLivePositioning();

        if (this.currentFloor.id != route.start.level) {
          this.floorControlComponent.currentFloorFromId(route.start.level);
        }

        this.mapComponent.showRoute(route.start.id, route.end.id, undefined);
      }
      else {
        this.positionComponent.startLivePositioning();
        this.liveRoute = route;
      }
    }
    else {
      this.positionComponent.stopLivePositioning();
      this.mapComponent.clearRoute();
    }
  }


  openSideMenu(open: boolean): void {

    Logger.log("AppComponent --- open Side Menu..." + open);
    this.isSideMenuOpenend = open;
    this.sideNav.open();
  }

  sideNavClosed() {
    Logger.log("AppComponent --- Side Nav closed");
    this.mapComponent.setFocus();
  }

  showRouteCalled(destinationRoom: Room) {
    //Logger.log('AppComponent::showRouteCalled: ' + result.text);
    this.searchBoxComponent.showRouteCalled(destinationRoom);
  }

  highlightRouteLevelsCalled(levels: number[]) {
    //Logger.log("AppComponent::highlightRouteLevels!!!");
    this.floorControlComponent.highlightLevels(levels);
  }

  poiTypesChanged(poiTypes: PoiType[]) {
    if (poiTypes) {
      //Logger.log("AppComponent --- poiTypesChanged: " + poiTypes.length);
      this.poiTypes = poiTypes;
      this.mapComponent.updatePoiTypes(this.poiTypes);
    }
  }

  livePosStatusChanged(status: boolean) {
    //Logger.log("AppComponent --- livePosStatusChanged: " + status);
    this.livePosStatus = status;
    this.searchBoxComponent.setLivePosAvailable(this.livePosStatus);
  }

  livePositionChanged(livePos: Position) {
    //Logger.log("AppComponent --- livePositionChanged: " + JSON.stringify(livePos));

    if (livePos && this.mapComponent.allowZoomToLivePos()) {
      if (livePos.level != this.currentFloor.id) {
        this.floorControlComponent.currentFloorFromId(livePos.level);
      }
    }

    if (this.liveRoute) {
      this.mapComponent.showRoute(undefined, this.liveRoute.end.id, livePos);
    }
    else {
      this.mapComponent.showLivePosition(livePos);
    }
  }

}
