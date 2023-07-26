import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
import { BeaconEditMode, BeaconEditModes } from '../base/beaconeditmode';
import { Signal } from '../base/signal';
import { Beacon } from '../base/beacon';
import { EdgeWeight } from '../base/edgeweight';

import { MapLayerBase } from './mapLayerBase';
import { MapNodes } from './mapNodes';
import { MapDoors } from './mapDoors';
import { MapRoom } from './mapRoom';
import { MapFloor } from './mapFloor';
import { MapEdges } from './mapEdges';
import { MapEditEdges } from './mapEditEdges';
import { MapRoute } from './mapRoute';
import { MapPois } from './mapPois';
import { MapBeacons } from './mapBeacons';
import { OpenlayersHelper } from './openlayershelper';

import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { BeacondialogComponent } from '../beacondialog/beacondialog.component'

import ol_Map from 'ol/Map';
import ol_layer_Tile from 'ol/layer/Tile';
import ol_source_OSM from 'ol/source/OSM';
import ol_View from 'ol/View';

import { defaults as defaultControls } from 'ol/control';
import { fromLonLat as ol_proj_fromLonLat } from 'ol/proj';

const maxNumberOfBeaconOverlays: number = 100;

@Component({
  selector: 'app-editablemap',
  templateUrl: './editablemap.component.html',
  styleUrls: ['./editablemap.component.css']
})
export class EditablemapComponent implements OnInit {

  //private _applicationMode: ApplicationMode = ApplicationMode.CreateDefault();

  @ViewChild('beaconPopups') public beaconPopUps: ElementRef;

  @Output() selectedBeaconEvt = new EventEmitter<Beacon>();

  public beaconOverlays: number[] = null;

  constructor(private dialog: MatDialog,
    private mapServiceHttp: MapHttpService,
    private mapService: MapService) {
    this.beaconOverlays = new Array(maxNumberOfBeaconOverlays);
    for (let i = 0; i < maxNumberOfBeaconOverlays; i++) {
      this.beaconOverlays[i] = i;
    }
  }

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
  private mapBeacons: MapBeacons = null;

  private ctlPressed: boolean = false;

  private lastFloor: Floor = undefined;


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
    this.mapBeacons = new MapBeacons(this.dialog, this.mapService, this.beaconPopUps, this);

    this.map = new ol_Map({
      controls: defaultControls({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      //interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol_layer_Tile({
          source: new ol_source_OSM()
        }),
        this.mapFloor.getLayer(),
        this.mapRooms.getLayer(),
        this.mapDoors.getLayer(),
        this.mapNodes.getLayer(),
        this.mapBeacons.getLayer(),
        this.mapEditEdges.getLayer(),
        this.mapEdges.getLayer(),
        this.mapRoute.getLayer(),
        this.mapPois.getMarkerLayer(),
        this.mapPois.getLayer()

      ],
      overlays: [],
      target: 'map',
      view: new ol_View({
        projection: 'EPSG:900913',
        center: ol_proj_fromLonLat([15.47, 47.0805]),
        //center: ol.extent.getCenter(extent),
        zoom: 18,
        maxZoom: 24,
        minZoom: 1,//16
        constrainResolution: true
      })
    });

    this.mapNodes.extendMap(this.map);

    this.map.on('click', evt => this.mapClicked(evt));
    this.map.on('pointermove', evt => this.mapMouseMoved(evt));
    this.updateLayers();
  }

  @Input()
  set applicationMode(applicationMode: ApplicationMode) {
    OpenlayersHelper.CurrentApplicationMode = applicationMode;
    console.log("EditAbleMapComponent::Set applicationMode - New App Mode: " + OpenlayersHelper.CurrentApplicationMode.name);

    if (this.mapEdges) {
      this.mapEdges.setWeightMode(OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_WEIGHTS);
    }

    this.updateLayers();

    this.currentFloor = this.lastFloor;
  }

  @Input()
  set currentFloor(currentFloor: Floor) {
    console.log("EditAbleMapComponent::Set currentFloor - New Floor: " + JSON.stringify(currentFloor));

    this.lastFloor = currentFloor;

    if (currentFloor && currentFloor.id >= 0) {
      this.mapFloor.updateData(currentFloor.id);
      this.mapRooms.updateData(currentFloor, OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES);
      this.mapDoors.updateData(currentFloor.id);
      this.mapEdges.updateData(currentFloor, OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES);
      this.mapNodes.updateData(currentFloor, OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES);
      this.mapRoute.setCurrentFloor(currentFloor.id);
      this.mapBeacons.updateData(currentFloor.id);
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

  @Input()
  set beaconEditMode(mode: BeaconEditMode) {
    if (mode) {
      this.mapBeacons.setBeaconEditMode(mode);
    }
  }

  @Input()
  set setBeaconSignals(signals: Signal[]) {
    if (signals) {
      this.mapBeacons.setBeaconSignals(signals);
    }
  }

  @Input()
  set deleteBeacon(beacon: Beacon) {
    if (this.mapBeacons) {
      this.mapBeacons.deleteBeacon(beacon);
    }
  }

  @Input()
  set currentEdgeWeight(edgeWeight: EdgeWeight) {
    if (edgeWeight) {
      console.log("EditAbleMapComponent::Set currentEdgeWeight: " + JSON.stringify(edgeWeight));
      this.mapEdges.setCurrentEdgeWeight(edgeWeight);
    }
  }

  @Input()
  set edgeWeights(edgeWeights: EdgeWeight[]) {
    if (edgeWeights) {
      console.log("EditAbleMapComponent::Set edgeWeights: " + JSON.stringify(edgeWeights));
      this.mapEdges.setEdgeWeights(edgeWeights);
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
    console.log("KEYUP: " + event.keyCode);

    if (event.keyCode == 17) {
      this.ctlPressed = false;
      this.mapNodes.ctlReleased();
    }

    if ((OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
      OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES
    )
      && event.keyCode == 46) //Entf Key
    {
      console.log("Delete selected Edges and Nodes...");
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

    if ((OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
      OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES
    )
      && event.keyCode == 88) { //x Key
      this.mapRoute.clear();
    }
  }

  public addOverlay(overlay: any) {
    this.map.addOverlay(overlay);
  }

  public setSelectedBeacon(beacon: Beacon) {
    this.selectedBeaconEvt.emit(beacon);
  }

  mapMouseMoved(evt): void {
    //if (evt.dragging) {
    //  return;
    //}
    let pixel = this.map.getEventPixel(evt.originalEvent);
    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
      OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES) {
      this.mapNodes.mouseMoved(pixel, evt.coordinate, this.map);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_WEIGHTS) {
      this.mapEdges.updateMouseMoved(pixel, this.map, true);
    }
  }

  mapClicked(evt): void {
    //console.log("mapClicked called");

    //let lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    //console.log("Coord: " + lonlat);
    console.log("Coord Org: " + evt.coordinate + " strg: " + evt.originalEvent.ctrlKey + " shift: " + evt.originalEvent.shiftKey);
    let pixel = this.map.getEventPixel(evt.originalEvent);

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
      OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES) {
      this.mapNodes.mouseClicked(evt.coordinate, this.map);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_POIS) {
      this.mapPois.mouseClicked(evt.coordinate, pixel, evt.originalEvent.ctrlKey, evt.originalEvent.shiftKey, this.map);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_BEACONS) {
      this.mapBeacons.mouseClicked(evt.coordinate, pixel, this.map);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_WEIGHTS) {
      this.mapEdges.updateMouseClicked(this.map);
    }
  }

  private updateLayers() {

    this.setLayerActive(this.mapEdges, false);
    this.setLayerActive(this.mapEditEdges, false);
    this.setLayerActive(this.mapNodes, false);
    this.setLayerActive(this.mapRoute, false);

    this.setLayerActive(this.mapPois, false);

    this.setLayerActive(this.mapBeacons, false);

    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
      OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES) {
      this.setLayerActive(this.mapEdges, true);
      this.setLayerActive(this.mapEditEdges, true);
      this.setLayerActive(this.mapNodes, true);
      this.setLayerActive(this.mapRoute, true);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_POIS) {
      this.setLayerActive(this.mapPois, true);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_BEACONS) {
      this.setLayerActive(this.mapBeacons, true);
    }
    else if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_WEIGHTS) {
      this.setLayerActive(this.mapEdges, true);
    }
  }

  private setLayerActive(layer: MapLayerBase, active: boolean) {
    if (layer) {
      layer.setActive(active);
    }
  }

}
