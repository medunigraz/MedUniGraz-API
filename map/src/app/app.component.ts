import { ViewChild, Component } from '@angular/core';
import { Floor } from './base/floor';
import {OlmapComponent} from './olmap/olmap.component'
import {SearchcontrolComponent} from './searchcontrol/searchcontrol.component'

import {MdSidenav } from '@angular/material/sidenav'

import {Room} from './base/room';
import { PoiType } from './base/poitype';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('sidenav') public sideNav: MdSidenav;
  @ViewChild('mapComp') public mapComponent: OlmapComponent;
  @ViewChild('searchBoxComp') public searchBoxComponent: SearchcontrolComponent;

  private isSideMenuOpenend: boolean = false;
  currentFloor: Floor = Floor.getDefaultFloor();

  private poiTypes: PoiType[] = null;

  floorChanged(floor: Floor): void {
    if (floor) {
      console.log("AppComponent --- floorChanged: " + floor.name);
      this.currentFloor = floor;
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

  poiTypesChanged(poiTypes: PoiType[]) {
    if (poiTypes) {
      //console.log("AppComponent --- poiTypesChanged: " + poiTypes.length);
      this.poiTypes = poiTypes;
      this.mapComponent.updatePoiTypes(this.poiTypes);
    }
  }

}
