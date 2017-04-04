import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

declare var ol: any;

export class MapRoom {

  private layer: any;
  private layerSource: any;

  private overlay: any;

  constructor(public roomPopupDiv: ElementRef) {
    this.Initialize();
  }

  private Initialize(): void {
    this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
      element: this.roomPopupDiv.nativeElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    //this.overlay.setPosition(ol.proj.fromLonLat([15.470230579376215, 47.0812626175388]));
  }

  public showRoom(id: number) {
    this.overlay.setPosition(ol.proj.fromLonLat([15.470230579376215, 47.0812626175388]));
  }

  public getLayer(): any {
    return this.layer;
  }

  public getOverlay(): any {
    return this.overlay;
  }

  closePopup() {
    this.overlay.setPosition(undefined);
    return false;
  }

}
