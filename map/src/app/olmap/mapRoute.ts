import { ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapRouteStyles } from './mapRouteStyles';

import { OlmapComponent } from './olmap.component'

declare var ol: any;

export class MapRoute extends MapLayerBase {

  private currentStartNodeId: number = -1;
  private currentLevelId: number = -1;
  private createRoute: boolean = false;

  private lastOverlaysUsed = 0;
  private levelOverlays: any[] = null;
  private levelIconFields: any[] = null;
  private levelTextFields: any[] = null;

  private currentRoute: any[] = undefined;

  constructor(private mapService: MapService, private levelPopUpBaseElem: ElementRef, private mapComponent: OlmapComponent) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let styleFunction = function(feature, currentFloor) {
      let style: any = null;
      try {
        let source = feature.get("source_node").properties.level;
        let destination = feature.get("destination_node").properties.level;

        if (source == currentFloor || destination == currentFloor) {
          style = MapRouteStyles.routeCurrentFloor;
        }
      }
      catch (e) {
      }
      if (style) {
        return style;
      }
      else {
        return MapRouteStyles.routeHiddenFloor;
      }
    };

    let res = OpenlayersHelper.CreateBasicLayer(feature => styleFunction(feature, this.currentLevelId));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showRoute(sourceNodeId: number, destinationNodeId: number) {
    if (sourceNodeId >= 0 && destinationNodeId >= 0) {
      console.log("MapRoute::generateRoute From: " + sourceNodeId + " to " + destinationNodeId);

      this.subscribeNewRequest(
        this.mapService.getRoute(sourceNodeId, destinationNodeId).
          subscribe(
          route => this.updateRoute(route),
          error => console.log("ERROR: " + <any>error)));
    }
  }

  public clearRoute() {
    this.resetRouteOverlays();
    this.clear();
  }

  public setCurrentLevel(level: number) {
    this.currentLevelId = level;
    this.layerSource.refresh();
  }

  private updateRoute(route: any) {
    console.log("MapRoute::update Route");
    this.layerSource.clear();

    let o_features = (new ol.format.GeoJSON()).readFeatures(route);
    this.currentRoute = o_features;

    this.layerSource.addFeatures(o_features);

    this.createLevelOverlays();

    this.mapComponent.zoomToGeomtry(this.layerSource.getExtent());

  }

  private createLevelOverlays() {
    console.log("MapRoute::createLevelOverlays...");

    if (!this.levelOverlays) {
      this.initRouteOverlays();
    }

    console.log("MapRoute::createLevelOverlays.");

    if (this.currentRoute && this.currentRoute.length > 0) {
      console.log("MapRoute::createLevelOverlays!");

      this.resetRouteOverlays();
      this.addLevelOverlay([1722185.0474149939, 5955308.177118387], "OG2");
    }
  }

  private addLevelOverlay(position: number[], text: string) {
    this.lastOverlaysUsed = 0;
    if (this.lastOverlaysUsed < this.levelOverlays.length) {
      this.levelOverlays[this.lastOverlaysUsed].setPosition(position);
      this.levelTextFields[this.lastOverlaysUsed].innerHTML = text;
      this.levelIconFields[this.lastOverlaysUsed].className = 'levelOverlayIcon icon-aufzug';

      this.lastOverlaysUsed++;
    }
  }

  private resetRouteOverlays() {

    if (!this.levelOverlays) {
      return;
    }

    for (let i = 0; i < this.levelOverlays.length && i <= this.lastOverlaysUsed; i++) {
      this.levelOverlays[i].setPosition(undefined);
      this.levelTextFields[i].innerHTML = "";
    }
    this.lastOverlaysUsed = 0;
  }

  private initRouteOverlays() {

    let base = this.levelPopUpBaseElem.nativeElement;
    //console.log("MapBeacons::initBeaconOverlays: " + JSON.stringify(this.beaconPopUpBaseElem.nativeElement));
    let childs = base.children;
    let elemCount = childs.length;
    console.log("MapRoute::initLevelOverlays: " + elemCount);
    this.levelOverlays = new Array(elemCount);
    this.levelTextFields = new Array(elemCount);
    this.levelIconFields = new Array(elemCount);

    let overlayDivs = [];

    for (let i = 0; i < elemCount; i++) {

      let OverlayDiv = childs[i].children[0];
      overlayDivs.push(OverlayDiv);
      //console.log("MapRoute::initLevelOverlays: NEW OVERLAY " + i + "#" + OverlayDiv.className + "#");
      //console.log("MapRoute::initLevelOverlays: " + JSON.stringify(OverlayDiv));
      let innerDiv = OverlayDiv.children[0];
      //console.log("MapRoute::initLevelOverlays: " + JSON.stringify(innerDiv));
      this.levelIconFields[i] = innerDiv.children[0];
      let span = innerDiv.children[2];
      //console.log("MapRoute::initLevelOverlays: " + innerDiv.children.length);
      this.levelTextFields[i] = span;
    }

    for (let i = 0; i < overlayDivs.length; i++) {
      //new ol.Overlay(/** @type {olx.OverlayOptions} */({
      this.levelOverlays[i] = new ol.Overlay(({
        element: overlayDivs[i],
        autoPan: false
      }));

      this.mapComponent.addOverlay(this.levelOverlays[i]);
    }
  }

}
