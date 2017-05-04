import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { HostListener } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';
import { MODIFY_EDGE_MINSTARTPOINT_DISTANCE } from '../base/globalconstants';
import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';

import { MapLayerBase } from './mapLayerBase';
import { MapNodes } from './mapNodes';
import { MapDoors } from './mapDoors';
import { MapRoom } from './mapRoom';
import { MapFloor } from './mapFloor';
import { MapEdges } from './mapEdges';
import { MapEditEdges } from './mapEditEdges';
import { MapRoute } from './mapRoute';
import { MapPois } from './mappois';
import { OpenlayersHelper } from './openlayershelper';


declare var ol: any;

@Component({
  selector: 'app-editablemap',
  templateUrl: './editablemap.component.html',
  styleUrls: ['./editablemap.component.css']
})
export class EditablemapComponent implements OnInit {

  //private _applicationMode: ApplicationMode = ApplicationMode.CreateDefault();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  private map: any;
  private baseMapLayer: any;
  private baseMapVectorSource: any;

  private mapNodes: MapNodes = null;
  private mapDoors: MapDoors = null;
  private mapRooms: MapRoom = null;
  private mapFloor: MapFloor = null;
  private mapEdges: MapEdges = null;
  private mapEditEdges: MapEditEdges = null;
  private mapRoute: MapRoute = null;
  private mapPois: MapPois = null;

  private ctlPressed: boolean = false;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.mapFloor = new MapFloor(this.mapService);
    this.mapDoors = new MapDoors(this.mapService);
    this.mapRooms = new MapRoom(this.mapService);
    this.mapEdges = new MapEdges(this.mapService);
    this.mapEditEdges = new MapEditEdges(this.mapService);
    this.mapRoute = new MapRoute(this.mapService);
    this.mapNodes = new MapNodes(this.mapService, this.mapEditEdges, this.mapEdges, this.mapRoute);
    this.mapPois = new MapPois(this.mapService);

    this.map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      //interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        this.mapFloor.getLayer(),
        this.mapRooms.getLayer(),
        this.mapDoors.getLayer(),
        this.mapNodes.getLayer(),
        this.mapEditEdges.getLayer(),
        this.mapEdges.getLayer(),
        this.mapRoute.getLayer(),
        this.mapPois.getLayer()
      ],
      overlays: [],
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:900913',
        center: ol.proj.fromLonLat([15.47, 47.0805]),
        //center: ol.extent.getCenter(extent),
        zoom: 18,
        maxZoom: 24,
        minZoom: 1//16
      })
    });

    this.mapNodes.extendMap(this.map);

    this.map.on('click', evt => this.mapClicked(evt));
    this.map.on('pointermove', evt => this.mapMouseMoved(evt));
  }

  @Input()
  set applicationMode(applicationMode: ApplicationMode) {
    OpenlayersHelper.CurrentApplicationMode = applicationMode;
    console.log("EditAbleMapComponent::Set applicationMode - New App Mode: " + OpenlayersHelper.CurrentApplicationMode.name);
    this.updateLayers();
  }

  @Input()
  set currentFloor(currentFloor: Floor) {
    console.log("EditAbleMapComponent::Set currentFloor - New Floor: " + JSON.stringify(currentFloor));
    if (currentFloor && currentFloor.id >= 0) {
      this.mapFloor.updateData(currentFloor.id);
      this.mapRooms.updateData(currentFloor.id);
      this.mapDoors.updateData(currentFloor.id);
      this.mapEdges.updateData(currentFloor.id);
      this.mapNodes.updateData(currentFloor.id);
      this.mapRoute.setCurrentFloor(currentFloor.id);

      this.mapPois.setCurrentFloor(currentFloor.id);
      this.mapPois.updateData(currentFloor.id);
    }
  }

  @Input()
  set currentPoiType(poitype: PoiType) {
    if (poitype) {
      console.log("EditAbleMapComponent::Set currentPoiType: " + JSON.stringify(poitype));
      this.mapPois.setCurrentSelectedPoiType(poitype);
    }
  }

  @Input()
  set poiTypes(poitypes: PoiType[]) {
    if (poitypes) {
      console.log("EditAbleMapComponent::Set poiTypes: " + JSON.stringify(poitypes));
      this.mapPois.setPoiTypes(poitypes);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    //console.log("KEYDOWN: " + event.keyCode);

    if (event.keyCode == 17 && !this.ctlPressed) {
      this.ctlPressed = true;
      this.mapNodes.ctlPressed();
    }

    if (event.keyCode == 16) {
      this.mapRoute.shiftPressed();
    }
  }

  /*
    @HostListener('window:keypress', ['$event'])
    keyboardKeyPress(event: KeyboardEvent) {
      console.log("KEYPRESS: " + event.keyCode);
    }*/

  @HostListener('window:keyup', ['$event'])
  keyboardKeyUp(event: KeyboardEvent) {
    //console.log("KEYUP: " + event.keyCode);

    if (event.keyCode == 17) {
      this.ctlPressed = false;
      this.mapNodes.ctlReleased();
    }

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES && event.keyCode == 46) //Entf Key
    {
      this.mapNodes.deleteSelectedNodes();
      this.mapEdges.deleteSelectedEdges();
    }

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_POIS && event.keyCode == 46) //Entf Key
    {
      this.mapPois.deleteSelectedPoi();
    }

    if (event.keyCode == 16) {
      this.mapRoute.shiftReleased();
    }

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES && event.keyCode == 88) { //x Key
      this.mapRoute.clear();
    }
  }

  mapMouseMoved(evt): void {
    //if (evt.dragging) {
    //  return;
    //}
    let pixel = this.map.getEventPixel(evt.originalEvent);
    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES) {
      this.mapNodes.mouseMoved(pixel, evt.coordinate, this.map);
    }
  }

  mapClicked(evt): void {
    //console.log("mapClicked called");

    //let lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    //console.log("Coord: " + lonlat);
    console.log("Coord Org: " + evt.coordinate + " strg: " + evt.originalEvent.ctrlKey + " shift: " + evt.originalEvent.shiftKey);
    let pixel = this.map.getEventPixel(evt.originalEvent);

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES) {
      this.mapNodes.mouseClicked(evt.coordinate, this.map);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_POIS) {
      this.mapPois.mouseClicked(evt.coordinate, pixel, evt.originalEvent.ctrlKey, evt.originalEvent.shiftKey, this.map);
    }
  }

  private updateLayers() {
    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES) {
      this.setLayerActive(this.mapEdges, true);
      this.setLayerActive(this.mapEditEdges, true);
      this.setLayerActive(this.mapNodes, true);
      this.setLayerActive(this.mapRoute, true);

      this.setLayerActive(this.mapPois, false);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_POIS) {
      this.setLayerActive(this.mapEdges, false);
      this.setLayerActive(this.mapEditEdges, false);
      this.setLayerActive(this.mapNodes, false);
      this.setLayerActive(this.mapRoute, false);

      this.setLayerActive(this.mapPois, true);
    }
  }

  private setLayerActive(layer: MapLayerBase, active: boolean) {
    if (layer) {
      layer.setActive(active);
    }
  }

}
