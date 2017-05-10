import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import {MapRoomStyles} from './mapRoomStyles'
import { MapLayerBase } from './mapLayerBase';

import {OlmapComponent} from './olmap.component'

import {Room} from '../base/room';
import {RoomDetail} from '../base/roomDetail';

declare var ol: any;

export class MapRoom extends MapLayerBase {

  private overlay: any;

  private currentOverlayText: string = "";
  private currentOverlayPosition: number[];

  private styleManager = new MapRoomStyles();

  private currentHighlightedRoom: any = null;
  private currentSelectedRoom: any = null;
  private currentMarkedRoom: RoomDetail = null;

  private currentLevel: number = -1;

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
    this.currentLevel = floorid;
    this.subscribeNewRequest(
      this.mapService.getRooms(floorid).subscribe(
        rooms => this.showRooms(rooms),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  public markRoomDummyRoom() {
    let feature = this.layerSource.getFeatureById(266);
    if (feature) {
      this.setSelectedRoom(feature);
    }
  }

  public markRoom(room: RoomDetail) {
    console.log("MapRoom::Mark room: " + room.id + " category: " + room.coCategory);

    this.currentMarkedRoom = room;
    this.currentOverlayText = room.text;
    this.roomContentSpan.nativeElement.innerHTML = this.currentOverlayText;
    this.currentOverlayPosition = (room.marker);
    this.overlay.setPosition(this.currentOverlayPosition);
    this.mapComponent.zoomToPosition(room.center);
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
        this.currentHighlightedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentHighlightedRoom.getId(), RoomDetail.getCategoryId(this.currentHighlightedRoom), false, false));
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
        this.currentHighlightedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentHighlightedRoom.getId(), RoomDetail.getCategoryId(this.currentHighlightedRoom), true, false));
      }
    }
  }

  public setSelectedRoom(roomFeature: any) {
    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentSelectedRoom.getId(), RoomDetail.getCategoryId(this.currentSelectedRoom), false, false));
    }

    if (RoomDetail.isRoomFeatureSelectAble(roomFeature)) {
      this.currentSelectedRoom = roomFeature;
    }
    else {
      this.currentSelectedRoom = null;
    }

    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentSelectedRoom.getId(), RoomDetail.getCategoryId(this.currentSelectedRoom), false, true));
      this.markRoom(new RoomDetail(this.currentSelectedRoom, this.currentLevel));
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

  private showRooms(features: any): void {
    //console.log("MapRoom::showRooms");
    this.clear();
    this.closePopup();

    let olFeatures = (new ol.format.GeoJSON()).readFeatures(features);

    for (let i = 0; i < olFeatures.length; i++) {
      let id = olFeatures[i].getId();
      //console.log("MapRoom::showRoom: " + id);
      olFeatures[i].setStyle(this.styleManager.getStyleForRoom(id, RoomDetail.getCategoryId(olFeatures[i]), false, false));
    }

    this.layerSource.addFeatures(olFeatures);
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
