import { ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapRouteStyles } from './mapRouteStyles';

import { Floor } from '../base/floor';
import { FloorList } from '../base/floorlist';

import { OlmapComponent } from './olmap.component'

declare var ol: any;

export class MapRoute extends MapLayerBase {

  private currentStartNodeId: number = -1;
  private currentLevelId: number = -1;
  private createRoute: boolean = false;

  private lastOverlaysUsed = 0;
  private levelOverlays: any[] = null;
  private levelIconFields: any[] = null;
  private levelArrowFields: any[] = null;
  private levelTextFields: any[] = null;

  private currentRoute: any[] = undefined;

  private floorList: FloorList = undefined;

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

  public setFloorList(floorList: FloorList) {
    if (floorList) {
      console.log("MapRoute::setFloorList num of floors: " + floorList.getLength());
      this.floorList = floorList;
    }
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
    this.mapComponent.highlightRouteLevels([]);
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

    if (this.currentRoute && this.currentRoute.length > 1) {

      let node1SourceId = this.currentRoute[0].get("source");
      let node1DestinationId = this.currentRoute[0].get("destination");
      let node2SourceId = this.currentRoute[1].get("source");
      let node2DestinationId = this.currentRoute[1].get("destination");

      let startNode = this.currentRoute[0].get("source_node");
      if (node1SourceId == node2SourceId || node1SourceId == node2DestinationId) {
        startNode = this.currentRoute[0].get("destination_node");
      }
      console.log("MapRoute::createLevelOverlays!");

      this.resetRouteOverlays();

      let i = 0;
      let lastNode = startNode;
      let currentNode = undefined;

      let lastStartLevel = -1;
      let lastCategory = -1;

      let levels = [];
      levels.push(startNode["properties"]["level"]);

      while (i < this.currentRoute.length) {
        currentNode = this.getNextNode(lastNode, this.currentRoute[i]);
        let category = this.currentRoute[i].get("category");

        let startLevel = lastNode["properties"]["level"];
        let endLevel = currentNode["properties"]["level"];

        if (lastStartLevel >= 0 && startLevel != endLevel) //warte ob mehr übergänge
        {
          //...
        }
        else if (lastStartLevel >= 0 && startLevel == endLevel) //warte ob mehr übergänge
        {
          this.addNewMarker(lastStartLevel, startLevel, lastNode, lastCategory);
          if (levels.indexOf(startLevel) < 0) {
            levels.push(startLevel);
          }
          lastStartLevel = -1;
        }
        else if (startLevel != endLevel) {  //Neuer Übergang
          lastStartLevel = startLevel;
          lastCategory = category;
        }
        else {
          lastStartLevel = -1;
        }

        //console.log("MapRoute::createLevelOverlays - cat: " + category + " source: " + startLevel + " destination: " + endLevel + " i" + i);

        lastNode = currentNode;
        i++;
      }

      if (lastStartLevel >= 0) {
        this.addNewMarker(lastStartLevel, lastNode["properties"]["level"], lastNode, lastCategory);
      }

      console.log("MapRoute::createLevelOverlays used Levels: " + JSON.stringify(levels));
      this.mapComponent.highlightRouteLevels(levels);
    }
  }

  private getNextNode(node1: any, edge: any) {
    let node1Id = node1["id"];

    let sourceId = edge.get("source");
    let destinationId = edge.get("destination");

    if (node1Id == sourceId) {
      return edge.get("destination_node");
    }

    return edge.get("source_node");
  }

  private addNewMarker(startLevel: number, endLevel: number, endNode: any, category: number) {


    console.log("MapRoute::addNewMarker Level: " + startLevel + " --> " + endLevel + " # " + JSON.stringify(endNode));
    if (this.floorList) {
      let pos = endNode["geometry"]["coordinates"];

      let iconstring = 'icon-treppe_a';
      if (category == 3) {
        iconstring = 'icon-aufzug';
      }

      let arrowstring = 'icon-pfeil_unten';
      if (this.floorList.isFloorAbove(endLevel, startLevel)) {
        arrowstring = 'icon-pfeil_oben';
      }

      let text = this.floorList.getFloorbyId(endLevel).name;

      this.addLevelOverlay(pos, text, iconstring, arrowstring);
    }
  }

  private addLevelOverlay(position: number[], text: string, icon: string, arrow: string) {

    console.log("MapRoute::addLevelOverlay " + text + " - " + icon + " # " + JSON.stringify(position));

    if (this.lastOverlaysUsed < this.levelOverlays.length) {
      console.log("MapRoute::addLevelOverlay -> " + this.lastOverlaysUsed);
      this.levelOverlays[this.lastOverlaysUsed].setPosition(position);
      this.levelTextFields[this.lastOverlaysUsed].innerHTML = text;
      this.levelIconFields[this.lastOverlaysUsed].className = 'levelOverlayIcon ' + icon;
      this.levelArrowFields[this.lastOverlaysUsed].className = 'levelOverlayIconArrow ' + arrow;

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
    this.levelArrowFields = new Array(elemCount);
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
      this.levelArrowFields[i] = innerDiv.children[1];
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
