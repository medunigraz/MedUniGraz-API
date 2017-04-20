import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import {MapRoomStyles} from './mapRoomStyles'

import {OlmapComponent} from './olmap.component'

declare var ol: any;

export class MapRoom {

  private layer: any;
  private layerSource: any;

  private overlay: any;

  private currentOverlayText: string = "";
  private currentOverlayPosition: [number];

  private styleManager = new MapRoomStyles();

  private currentHighlightedRoom: any = null;
  private currentSelectedRoom: any = null;

  constructor(public roomPopupDiv: ElementRef, public roomContentSpan: ElementRef, private mapComponent: OlmapComponent, private mapService: MapService) {
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
    this.mapService.getRooms(floorid).subscribe(
      rooms => this.showRooms(rooms),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  public highlightRoom(id: number, text: string) {
    this.currentOverlayText = text;
    this.roomContentSpan.nativeElement.innerHTML = this.currentOverlayText;
    this.currentOverlayPosition = [1722195.294385298, 5955266.126823761];
    this.overlay.setPosition(this.currentOverlayPosition);
    this.mapComponent.zoomToPosition(this.currentOverlayPosition);
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(this.getDummyRoom()));
  }

  public getLayer(): any {
    return this.layer;
  }

  public getOverlay(): any {
    return this.overlay;
  }

  public setHighlightedRoom(roomFeature: any) {
    if (this.currentHighlightedRoom) {
      if (!this.isRoomSelected(this.currentHighlightedRoom)) {
        this.currentHighlightedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentHighlightedRoom.getId(), false, false));
      }
    }

    this.currentHighlightedRoom = roomFeature;
    if (this.currentHighlightedRoom) {
      if (!this.isRoomSelected(this.currentHighlightedRoom)) {
        this.currentHighlightedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentHighlightedRoom.getId(), true, false));
      }
    }
  }

  public setSelectedRoom(roomFeature: any) {
    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentSelectedRoom.getId(), false, false));
    }

    this.currentSelectedRoom = roomFeature;
    if (this.currentSelectedRoom) {
      this.currentSelectedRoom.setStyle(this.styleManager.getStyleForRoom(this.currentSelectedRoom.getId(), false, true));
    }
  }

  private isRoomSelected(roomFeature: any) {
    if (!roomFeature || !this.currentSelectedRoom) {
      return false;
    }



    return roomFeature.getId() == this.currentSelectedRoom.getId()
  }

  closePopup() {
    this.currentOverlayPosition = undefined;
    this.overlay.setPosition(this.currentOverlayPosition);
    return false;
  }

  private clear() {
    this.layerSource.clear();
  }

  private showRooms(features: any): void {
    console.log("MapRoom::showRooms");
    this.clear();

    let olFeatures = (new ol.format.GeoJSON()).readFeatures(features);

    for (let i = 0; i < olFeatures.length; i++) {
      let id = olFeatures[i].getId();
      console.log("MapRoom::showRoom: " + id);
      olFeatures[i].setStyle(this.styleManager.getStyleForRoom(id, false, false));
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
