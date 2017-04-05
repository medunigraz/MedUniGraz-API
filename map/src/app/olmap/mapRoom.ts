import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

import {OlmapComponent} from './olmap.component'

declare var ol: any;

export class MapRoom {

  private layer: any;
  private layerSource: any;

  private overlay: any;

  private currentOverlayText: string = "";

  private currentOverlayPosition: [number];

  constructor(public roomPopupDiv: ElementRef, public roomContentSpan: ElementRef, private mapComponent: OlmapComponent) {
    this.Initialize();
  }

  private Initialize(): void {
    this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
      element: this.roomPopupDiv.nativeElement,
      autoPan: false
    }));

    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(128,0,255,0.5)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showRoom(id: number, text: string) {
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

  closePopup() {
    this.currentOverlayPosition = undefined;
    this.overlay.setPosition(this.currentOverlayPosition);
    return false;
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
