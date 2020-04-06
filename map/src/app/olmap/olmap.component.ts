import { Component, OnInit, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { Observable ,  Subscription ,  timer } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

import { MapPois } from './mapPois';
import { MapRoom } from './mapRoom';
import { MapFloor } from './mapFloor'
import { MapDoors } from './mapDoors'
import { MapRoute } from './mapRoute'
import { MapBackground } from './mapBackground'
import { MapLivePosition } from './mapLivePosition'

import { OrgUnitHandler } from './orgunithandler'


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import {MatIconRegistry} from '@angular/material/icon';
import { OpenlayersHelper } from './openlayershelper';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component'

import { FloorList } from '../base/floorlist';
import { MAX_NUMBER_OF_ROUTELEVEL_OVERLAYS } from '../base/globalconstants'
import { Room } from '../base/room';
import { RoomDetail } from '../base/roomDetail';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';
import { Position } from '../base/position';
import { RouteLevelChange } from '../base/routeLevelChange';

import { Logger } from '../base/logger';

import ol_View from 'ol/View';
import ol_Map from 'ol/Map';
import ol_layer_Tile from 'ol/layer/Tile';
import ol_source_OSM from 'ol/source/OSM';

import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import { fromLonLat as ol_proj_fromLonLat } from 'ol/proj';

declare var ol: any;

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.css']
})
export class OlmapComponent implements OnInit {

  @ViewChild('mapDiv', { static: true }) public mapDiv: ElementRef;
  @ViewChild('roomPopup', { static: true }) public roomPopupDiv: ElementRef;
  @ViewChild('roomPopupText', { static: true }) public roomPopupText: ElementRef;
  @ViewChild('levelPopups', { static: true }) public levelPopups: ElementRef;

  @Output('onShowRoute') onShowRoute: EventEmitter<Room> = new EventEmitter();
  @Output('onHighlightRouteLevels') onHighlightRouteLevels: EventEmitter<number[]> = new EventEmitter();
  @Output('onCurrentFloorObject') onCurrentFloorObject: EventEmitter<Floor> = new EventEmitter();

  public routeLevelOverlays: number[] = null;

  constructor(private dialog: MatDialog, private mapService: MapService, private deviceService: DeviceDetectorService) {

    this.routeLevelOverlays = new Array(MAX_NUMBER_OF_ROUTELEVEL_OVERLAYS);
    for (let i = 0; i < MAX_NUMBER_OF_ROUTELEVEL_OVERLAYS; i++) {
      this.routeLevelOverlays[i] = i;
    }
  }

  private zoomToLivePosTimerSubscription: Subscription;

  private orgUnitHandler: OrgUnitHandler = null;

  private mapPois: MapPois = null;
  private mapRoom: MapRoom = null;
  private mapFloor: MapFloor = null;
  private mapDoors: MapDoors = null;
  private mapRoute: MapRoute = null;
  private mapBackground: MapBackground = null;
  private mapLivePosition: MapLivePosition = null;

  private mapView: any;

  private currentLevel: Floor = null;

  private lastViewChangeStart: number = -2;
  private lastViewChangeEnd: number = -1;
  private lastMapUpdate: number = -1;
  private lastPositionReceived: number = -1;
  private lastShowRoom: number = -1;

  ngOnInit() {
  }

  private map: any;

  ngAfterViewInit(): void {
    this.mapBackground = new MapBackground(this.mapService);
    this.mapPois = new MapPois(this.mapService);
    this.mapRoom = new MapRoom(this.roomPopupDiv, this.roomPopupText, this, this.mapService);
    this.mapFloor = new MapFloor(this.mapService);
    this.mapDoors = new MapDoors(this.mapService);
    this.mapRoute = new MapRoute(this.mapService, this.levelPopups, this);
    this.mapLivePosition = new MapLivePosition(this.mapService);

    this.orgUnitHandler = new OrgUnitHandler(this.mapService, this.mapRoom);

    let interactions = defaultInteractions({ altShiftDragRotate: false, pinchRotate: false });

    this.mapView = new ol_View({
      projection: 'EPSG:900913',
      center: ol_proj_fromLonLat([15.47, 47.0805]),
      //center: ol.extent.getCenter(extent),
      zoom: 18,
      maxZoom: 24,
      minZoom: 16//16
    });

    this.map = new ol_Map({
      controls: defaultControls({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      interactions: interactions,
      //interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol_layer_Tile({
          source: this.getTileSource()
        }),
        //this.mapBackground.getLayer(), //TODO
        this.mapFloor.getLayer(),
        this.mapRoom.getLayer(),
        this.mapDoors.getLayer(),
        this.mapRoute.getLayer(),
        this.mapPois.getLayer(),
        this.mapLivePosition.getLayer()
      ],
      overlays: [this.mapRoom.getOverlay()],
      target: 'map',
      view: this.mapView
    });

    this.mapBackground.showBackground();

    this.map.on('click', evt => this.mapClicked(evt));

    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
    }
    else {
      this.map.on('pointermove', evt => this.mapMouseMoved(evt));
    }

    this.map.on('movestart', evt => this.changeViewStart(evt));
    this.map.on('moveend', evt => this.changeViewEnd(evt));

    this.mapLivePosition.setMap(this.map);
  }

  private changeViewStart(evt: any) {
    //Logger.log("MapComponent::changeView Start!!! " + Date.now());
    this.lastViewChangeStart = Date.now();
  }

  private changeViewEnd(evt: any) {
    //Logger.log("MapComponent::changeView End!!!" + Date.now());
    this.lastViewChangeEnd = Date.now();
  }

  private getTileSource(): any {

    let options = {
      url: 'https://map.medunigraz.at/tiles/openstreetmap/{z}/{x}/{y}.png'
    };

    return new ol_source_OSM(options);

    /*
        let tilegrid = new ol.tilegrid.WMTS({
          origin: [-20037508.3428, 20037508.3428],
          extent: [977650, 5838030, 1913530, 6281290],

          resolutions: [
            156543.03392811998,
            78271.51696419998,
            39135.758481959994,
            19567.879241008,
            9783.939620504,
            4891.969810252,
            2445.984905126,
            1222.9924525644,
            611.4962262807999,
            305.74811314039994,
            152.87405657047998,
            76.43702828523999,
            38.21851414248,
            19.109257071295996,
            9.554628535647998,
            4.777314267823999,
            2.3886571339119995,
            1.1943285669559998,
            0.5971642834779999,
            0.29858214174039993//,
            //0.14929107086936
          ],
          matrixIds: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19"//,
            //"20"
          ]
        });

        let IS_CROSS_ORIGIN = "anonymous";
        let sm = ol.proj.get("EPSG:3857");
        let templatepng =
          "{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png";
        let urlsbmappng = [
          "//maps1.wien.gv.at/basemap/" + templatepng,
          "//maps2.wien.gv.at/basemap/" + templatepng,
          "//maps3.wien.gv.at/basemap/" + templatepng,
          "//maps4.wien.gv.at/basemap/" + templatepng
        ];

        return new ol.source.WMTS({
          //url: 'https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml',
          tilePixelRatio: 1,
          projection: sm,
          layer: "bmapgrau",
          style: "normal",
          matrixSet: 'google3857',
          urls: urlsbmappng,
          //crossOrigin: IS_CROSS_ORIGIN,
          requestEncoding: ("REST"),
          tileGrid: tilegrid
        });*/
  }

  public highlightRouteLevels(levels: number[]) {

    this.onHighlightRouteLevels.emit(levels);
  }

  public addOverlay(overlay: any) {
    this.map.addOverlay(overlay);
  }

  @Input()
  set currentFloor(currentFloor: Floor) {

    Logger.log("MapComponent::Set currentFloor - New Floor: " + JSON.stringify(currentFloor));

    if (currentFloor && currentFloor.id >= 0) {
      this.lastMapUpdate = Date.now();
      this.currentLevel = currentFloor;
      this.mapFloor.showFloor(currentFloor.id);
      this.mapDoors.showFloor(currentFloor.id);
      this.mapRoom.showFloor(currentFloor.id);
      this.mapPois.showFloor(currentFloor.id);
      this.mapRoute.setCurrentLevel(currentFloor.id);
      this.mapLivePosition.setCurrentLevel(currentFloor.id);
    }
  }

  public setFloorList(floorList: FloorList) {
    this.mapRoute.setFloorList(floorList);
  }

  public updatePoiTypes(poitypes: PoiType[]) {
    if (poitypes) {
      //Logger.log("MapComponent::Set poiTypes: " + JSON.stringify(poitypes));
      this.mapPois.setPoiTypes(poitypes);
    }
  }

  public allowZoomToLivePos() {
    let zoomToPos: boolean = false;
    let currentTimeStamp: number = Date.now();
    //Logger.log("MapComponent::showLivePosition Zoom to livePos # lastMapUpdate: " + (currentTimeStamp - this.lastMapUpdate));
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastMapUpdate < 2500) //Always zoom to pos after level change
    {
      //Logger.log("MapComponent::showLivePosition ALLOW  Zoom to livePos # lastMapUpdate ");
      zoomToPos = true;
    }
    //Logger.log("MapComponent::showLivePosition Zoom to livePos # ?? " + (currentTimeStamp - this.lastViewChangeEnd) + "#(" + this.lastViewChangeEnd + "/" + this.lastViewChangeStart + ")");
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastViewChangeEnd > 1000) //Zoom to pos if no map drag happend in the last 1sec
    {
      //Logger.log("MapComponent::showLivePosition ALLOW  Zoom to livePos # lastDrag ");
      zoomToPos = true;
    }/*
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastPositionReceived > 5000 && currentTimeStamp - this.lastViewChangeEnd > 2000) {
      //Logger.log("MapComponent::showLivePosition ALLOW Zoom to livePos # lastPositionReceived");
      zoomToPos = true;
    }*/

    if (this.lastShowRoom > 0 && Date.now() - this.lastShowRoom < 2000) { //Ignore pos for same time after mark room
      Logger.log("MapComponent::showLivePosition BLOCK Zoom to livePos # lastShowRoom" + this.lastShowRoom);
      zoomToPos = false;
    }
    Logger.log("MapComponent::showLivePosition  ######### " + zoomToPos);
    return zoomToPos;
  }

  public showLivePosition(livePos: Position) {
    this.mapLivePosition.showLivePosition(livePos);

    if (this.allowZoomToLivePos() && livePos) {
      this.zoomToPosition([livePos.x, livePos.y]);
    }

    this.lastPositionReceived = Date.now();
  }

  public showLivePosOnRoute(livePos: Position) {
    this.mapLivePosition.showLivePosition(livePos);

    if (this.allowZoomToLivePos() && livePos) {
      this.zoomToPosition([livePos.x, livePos.y]);
    }

    this.lastPositionReceived = Date.now();
  }

  setFocus(): void {
    this.mapDiv.nativeElement.focus();
  }

  showRoom(roomResult: Room) {
    Logger.log("OLMap::showRoom: " + JSON.stringify(roomResult));
    this.mapRoom.markRoomFromSearch(roomResult);
    this.lastShowRoom = Date.now();
  }

  showRoute(from: number, to: number, livePos: Position) {
    //Logger.log("OlmapComponent::showRoute: " + from + " --> " + to);
    this.mapRoute.showRoute(from, to, livePos);
    if (!livePos) {
      this.lastShowRoom = Date.now();
    }
  }


  clearRoute() {
    Logger.log("OlmapComponent::clearRoute");
    this.mapRoute.clearRoute();
  }

  closePopup() {
    //Logger.log("OlmapComponent::closePopup");
    this.mapRoom.closePopup();
  }

  zoomToGeomtry(extent: any) {
    let timerO = timer(250);

    if (this.zoomToLivePosTimerSubscription != null) {
      this.zoomToLivePosTimerSubscription.unsubscribe();
      this.zoomToLivePosTimerSubscription = null;
    }

    this.zoomToLivePosTimerSubscription = timerO.subscribe(t => {
      this.zoomToGeometryEvt(extent);
    });
  }

  zoomToGeometryEvt(extent: any) {
    if (extent) {
      let options = {
        padding: [40, 10, 10, 10],
        duration: 500
      }

      if (this.mapView) {
        this.mapView.fit(extent, options);
      }
    }
  }

  zoomToPosition(position: number[]) {
    Logger.log("OlmapComponent::zoomToPosition");
    let timerO = timer(250);

    if (this.zoomToLivePosTimerSubscription != null) {
      this.zoomToLivePosTimerSubscription.unsubscribe();
      this.zoomToLivePosTimerSubscription = null;
    }

    this.zoomToLivePosTimerSubscription = timerO.subscribe(t => {
      this.zoomToPositionEvt(position);
    });

    Logger.log("OlmapComponent::zoomToPosition END");
  }

  zoomToPositionEvt(position: number[]) {
    Logger.log("OlmapComponent::zoomToPosition EVENT");
    if (position && position != undefined) {

      let destinationZoom = 20;

      if (destinationZoom > this.map.getView().getZoom()) {
        this.mapView.animate({
          zoom: destinationZoom,
          center: position,
          duration: 500
        });
      }
      else {
        this.mapView.animate({
          center: position,
          duration: 500
        });
      }
      //this.mapView.setCenter(position);
    }
  }

  openRoomDialog() {
    //Logger.log("OlmapComponent::openRoomDialog");

    let dialogRef: MatDialogRef<RoomDialogComponent>;
    let room = this.mapRoom.getMarkedRoom();

    if (room) {
      dialogRef = this.dialog.open(RoomDialogComponent);
      dialogRef.componentInstance.currentRoom = room;
      dialogRef.afterClosed().subscribe(res => this.roomDialogClosed(res));
    }
    this.setFocus();
  }

  roomDialogClosed(res: any) {
    Logger.log("OlmapComponent::openRoomDialogClosed: " + JSON.stringify(res));
    let currentMarkedRoom = this.mapRoom.getMarkedRoom();
    if (currentMarkedRoom != null && res == "Navigate...") {
      Logger.log("OlmapComponent::openRoomDialogClosed Emit Navigation Event!");
      this.onShowRoute.emit(currentMarkedRoom.getSimpleRoom());
    }
  }

  private mapMouseMoved(evt): void {
    let pixel = this.map.getEventPixel(evt.originalEvent);
    let roomFeature = this.getRoomForPos(pixel);
    this.mapRoom.setHighlightedRoom(roomFeature);
  }

  private mapClicked(evt): void {
    let pixel = this.map.getEventPixel(evt.originalEvent);
    Logger.log("Coord Org: " + evt.coordinate + " Pixel: " + pixel);

    let roomFeature = this.getRoomForPos(pixel);
    if (roomFeature) {
      Logger.log("OlmapComponent::mapClicked: Room Clicked: " + roomFeature.getId());
    }
    this.mapRoom.setSelectedRoom(roomFeature);


    let doorFeature = this.getDoorForPos(pixel);
    if (doorFeature) {
      Logger.log("OlmapComponent::mapClicked: Door Clicked: " + doorFeature.getId());
    }

    //let view = this.map.getView();
    //Logger.log("OlmapComponent::mapClicked: CurrentResolution: " + view.getResolution());
  }

  private getRoomForPos(posPixel: any) {
    let options = {
      layerFilter: (layer => this.testLayerRooms(layer))
    }
    let feature = this.map.forEachFeatureAtPixel(posPixel, function(feature) {
      return feature;
    }, options);

    //if (feature != null) {
    //  Logger.log("Found room: " + feature.getId());
    //}

    return feature;
  }

  private testLayerRooms(layer: any) {
    return this.mapRoom.getLayer() === layer;
  }

  private getDoorForPos(posPixel: any) {
    let options = {
      layerFilter: (layer => this.testLayerDoors(layer))
    }
    let feature = this.map.forEachFeatureAtPixel(posPixel, function(feature) {
      return feature;
    }, options);

    return feature;
  }

  onSelectFloor(floor: Floor) {
    this.currentFloor = floor;
    this.onCurrentFloorObject.emit(floor);

  }

  private testLayerDoors(layer: any) {
    return this.mapDoors.getLayer() === layer;
  }

}
