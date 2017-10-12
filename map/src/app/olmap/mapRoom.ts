import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

import { OlmapComponent } from './olmap.component'

import { Room } from '../base/room';
import { RoomDetail } from '../base/roomDetail';

import { OrgUnit } from '../base/orgunit';
import { OrgUnitList } from '../base/orgunitlist';

import { Logger } from '../base/logger';


declare var ol: any;

export class MapRoom extends MapLayerBase {

  private overlay: any;

  private defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(128,128,128,1)'
    })
  });

  private currentOverlayText: string = "";
  private currentOverlayPosition: number[];

  private currentHighlightedRoom: any = null;
  private currentSelectedRoom: any = null;
  private currentMarkedRoom: RoomDetail = null;

  private currentLevel: number = -1;

  private roomToHighlight: Room = null;

  private roomFeatures: any = undefined;
  private orgUnits: OrgUnitList = undefined;

  private waitForRooms: boolean = false;

  constructor(public roomPopupDiv: ElementRef, public roomContentSpan: ElementRef, private mapComponent: OlmapComponent, private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
      element: this.roomPopupDiv.nativeElement,
      autoPan: false
    }));

    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      /*stroke: new ol.style.Stroke({
        color: 'red',
        width: 0
      }),*/
      fill: new ol.style.Fill({
        color: 'rgba(0,0,0,1)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showFloor(floorid: number) {
    this.clear();
    this.closePopup();
    this.roomFeatures = undefined;
    this.currentLevel = floorid;
    this.waitForRooms = true;

    this.subscribeNewRequest(
      this.mapService.getRooms(floorid).subscribe(
        rooms => this.roomsReceived(rooms),
        error => Logger.log("ERROR deleteNode: " + <any>error)));
  }

  public orgUnitsReceived(orgUnits: OrgUnitList) {
    this.orgUnits = orgUnits;
    if (this.roomFeatures) {
      this.showRooms(this.roomFeatures);
    }
  }

  public markRoomDummyRoom() {
    let feature = this.layerSource.getFeatureById(266);
    if (feature) {
      this.setSelectedRoom(feature);
    }
  }

  public markRoomFromSearch(room: Room) {
    Logger.log("MapRoom::Mark room from Search: " + JSON.stringify(room));
    this.roomToHighlight = null;
    if (room.level != this.currentLevel || this.waitForRooms) {
      Logger.log("MapRoom::Mark room from Search; Wait for Level change... " + JSON.stringify(room));
      this.roomToHighlight = room;
    }
    else {
      Logger.log("MapRoom::Mark room from Search -> correct Level " + JSON.stringify(room));
      Logger.log("MapRoom::Mark room from Search -> find feature " + room.id);
      let feature = this.layerSource.getFeatureById(room.id);
      if (feature) {
        Logger.log("MapRoom::Mark room from Search -> found feature " + room.id);
        this.setSelectedRoom(feature);
      }
      else if (room.virtualAddress) {
        this.setSelectedRoom(null);
        this.markRoom(RoomDetail.CreateFromVirtualAddress(room));
      }
      /*
      else
      {
        Logger.log("MapRoom::Mark room from Search; Wait for receive rooms... " + JSON.stringify(room));
        this.roomToHighlight = room;
      }*/
    }
  }

  public markRoom(room: RoomDetail) {

    if (room) {

      Logger.log("MapRoom::Mark room: " + room.id + " category: " + room.coCategory);

      this.currentMarkedRoom = room;
      this.currentOverlayText = room.getRoomMarkerText();
      this.roomContentSpan.nativeElement.innerHTML = this.currentOverlayText;
      this.currentOverlayPosition = (room.marker);
      this.overlay.setPosition(this.currentOverlayPosition);
      this.mapComponent.zoomToPosition(room.center);
    }
  }

  public getMarkedRoom(): RoomDetail {
    return this.currentMarkedRoom;
  }

  public getOverlay(): any {
    return this.overlay;
  }

  public setHighlightedRoom(roomFeature: any) {
    if (this.currentHighlightedRoom) {
      if (!this.isRoomSelected(this.currentHighlightedRoom)) {
        this.currentHighlightedRoom.setStyle(this.getStyleForRoom(RoomDetail.getOrgId(this.currentHighlightedRoom), RoomDetail.getCategoryId(this.currentHighlightedRoom), false, false));
      }
    }

    if (RoomDetail.isRoomFeatureSelectAble(roomFeature)) {
      this.currentHighlightedRoom = roomFeature;
    }
    else {
      this.currentHighlightedRoom = null;
    }

    if (this.currentHighlightedRoom) {
      if (!this.isRoomSelected(this.currentHighlightedRoom)) {
        this.currentHighlightedRoom.setStyle(this.getStyleForRoom(RoomDetail.getOrgId(this.currentHighlightedRoom), RoomDetail.getCategoryId(this.currentHighlightedRoom), true, false));
      }
    }
  }

  public setSelectedRoom(roomFeature: any) {
    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.getStyleForRoom(RoomDetail.getOrgId(this.currentSelectedRoom), RoomDetail.getCategoryId(this.currentSelectedRoom), false, false));
    }

    if (RoomDetail.isRoomFeatureSelectAble(roomFeature)) {
      this.currentSelectedRoom = roomFeature;
    }
    else {
      this.currentSelectedRoom = null;
    }

    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.getStyleForRoom(RoomDetail.getOrgId(this.currentSelectedRoom), RoomDetail.getCategoryId(this.currentSelectedRoom), false, true));
      let roomDetail = new RoomDetail(this.currentSelectedRoom, this.currentLevel);
      if (this.orgUnits) {
        roomDetail.coOrganization = this.orgUnits.getName(roomDetail.orgId);
      }
      this.markRoom(roomDetail);
    }
    else {
      this.closePopup();
    }
  }
  private isRoomSelected(roomFeature: any) {
    if (!roomFeature || !this.currentSelectedRoom) {
      return false;
    }

    return roomFeature.getId() == this.currentSelectedRoom.getId();
  }

  closePopup() {
    this.currentOverlayPosition = undefined;
    this.overlay.setPosition(this.currentOverlayPosition);
    return false;
  }

  private roomsReceived(features: any): void {
    this.roomFeatures = features;
    if (this.orgUnits) {
      this.showRooms(features);
    }
  }

  private showRooms(features: any): void {
    //Logger.log("MapRoom::showRooms");
    this.clear();
    this.closePopup();

    let olFeatures = (new ol.format.GeoJSON()).readFeatures(features);

    for (let i = 0; i < olFeatures.length; i++) {
      let id = olFeatures[i].getId();
      //Logger.log("MapRoom::showRoom: " + id + "#" + JSON.stringify(olFeatures[i].getGeometry().getExtent()));
      olFeatures[i].setStyle(this.getStyleForRoom(RoomDetail.getOrgId(olFeatures[i]), RoomDetail.getCategoryId(olFeatures[i]), false, false));
    }

    this.layerSource.addFeatures(olFeatures);
    this.waitForRooms = false;

    if (this.roomToHighlight) {
      this.markRoomFromSearch(this.roomToHighlight);
    }
  }

  private getStyleForRoom(orgId: number, categoryId: number, isHighlighted: boolean, isSelected: boolean): any {
    if (this.orgUnits) {
      return this.orgUnits.getStyleForRoom(orgId, categoryId, isHighlighted, isSelected);
    }
    return this.defaultStyle;
  }

  private getDummyRoom(): any {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          'type': 'Feature', "id": 12, 'geometry': {
            "type": "Polygon",
            "coordinates": [
              [[1722195.294385298, 5955266.126823761], [1722204.811691066, 5955261.3495094925],
              [1722202.1244517902, 5955255.975030941], [1722192.6071460224, 5955260.90163628],
              [1722195.294385298, 5955266.126823761]]
            ]
          },
          "properties": {
          }
        }]
    };
  }
}
