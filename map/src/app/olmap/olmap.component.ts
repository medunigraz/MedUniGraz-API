import { Component, OnInit, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import { MapPois } from './mapPois';
import { MapRoom } from './mapRoom';
import { MapFloor } from './mapFloor'
import { MapDoors } from './mapDoors'
import { MapRoute } from './mapRoute'
import { MapBackground } from './mapBackground'
import { MapLivePosition } from './mapLivePosition'

import {MdDialog, MdDialogRef} from '@angular/material';

import { OpenlayersHelper } from './openlayershelper';
import {RoomDialogComponent} from '../room-dialog/room-dialog.component'
import {Room} from '../base/room';
import {RoomDetail} from '../base/roomDetail';
import { Floor } from '../base/floor';
import { PoiType } from '../base/poitype';
import {Position} from '../base/position';

declare var ol: any;

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.css']
})
export class OlmapComponent implements OnInit {

  @ViewChild('mapDiv') public mapDiv: ElementRef;
  @ViewChild('roomPopup') public roomPopupDiv: ElementRef;
  @ViewChild('roomPopupText') public roomPopupText: ElementRef;

  @Output('onShowRoute') onShowRoute: EventEmitter<Room> = new EventEmitter();

  constructor(private dialog: MdDialog, private mapService: MapService) { }

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
    this.mapRoute = new MapRoute(this.mapService, this);
    this.mapLivePosition = new MapLivePosition(this.mapService);

    let interactions = ol.interaction.defaults({ altShiftDragRotate: false, pinchRotate: false });

    this.mapView = new ol.View({
      projection: 'EPSG:900913',
      center: ol.proj.fromLonLat([15.47, 47.0805]),
      //center: ol.extent.getCenter(extent),
      zoom: 18,
      maxZoom: 24,
      minZoom: 16//16
    });

    this.map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      interactions: interactions,
      //interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol.layer.Tile({
          source: this.getTileSource()
        }),
        this.mapBackground.getLayer(),
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
    this.map.on('pointermove', evt => this.mapMouseMoved(evt));

    this.map.on('movestart', evt => this.changeViewStart(evt));
    this.map.on('moveend', evt => this.changeViewEnd(evt));

    this.mapLivePosition.setMap(this.map);
  }

  private changeViewStart(evt: any) {
    console.log("MapComponent::changeView Start!!! " + Date.now());
    this.lastViewChangeStart = Date.now();
  }

  private changeViewEnd(evt: any) {
    console.log("MapComponent::changeView End!!!" + Date.now());
    this.lastViewChangeEnd = Date.now();
  }

  private getTileSource(): any {
    return new ol.source.OSM();

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

  @Input()
  set currentFloor(currentFloor: Floor) {
    console.log("MapComponent::Set currentFloor - New Floor: " + JSON.stringify(currentFloor));

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

  public updatePoiTypes(poitypes: PoiType[]) {
    if (poitypes) {
      //console.log("MapComponent::Set poiTypes: " + JSON.stringify(poitypes));
      this.mapPois.setPoiTypes(poitypes);
    }
  }

  public allowZoomToLivePos() {
    let zoomToPos: boolean = false;
    let currentTimeStamp: number = Date.now();
    //console.log("MapComponent::showLivePosition Zoom to livePos # lastMapUpdate: " + (currentTimeStamp - this.lastMapUpdate) +
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastMapUpdate < 2500) //Always zoom to pos after level change
    {
      //console.log("MapComponent::showLivePosition ALLOW  Zoom to livePos # lastMapUpdate ");
      zoomToPos = true;
    }
    //console.log("MapComponent::showLivePosition Zoom to livePos # ?? " + (currentTimeStamp - this.lastViewChangeEnd) + "#(" + this.lastViewChangeEnd + "/" + this.lastViewChangeStart + ")");
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastViewChangeEnd > 5000) //Zoom to pos if no map drag happend in the last 5sec
    {
      //console.log("MapComponent::showLivePosition ALLOW  Zoom to livePos # lastDrag ");
      zoomToPos = true;
    }
    if (this.lastViewChangeEnd >= this.lastViewChangeStart && currentTimeStamp - this.lastPositionReceived > 5000 && currentTimeStamp - this.lastViewChangeEnd > 2000) {
      //console.log("MapComponent::showLivePosition ALLOW Zoom to livePos # lastPositionReceived");
      zoomToPos = true;
    }

    if (this.lastShowRoom > 0 && Date.now() - this.lastShowRoom < 5000) { //Ignore pos for same time after mark room
      //console.log("MapComponent::showLivePosition BLOCK Zoom to livePos # lastShowRoom");
      zoomToPos = false;
    }
    //console.log("MapComponent::showLivePosition  ######### " + zoomToPos);
    return zoomToPos;
  }

  public showLivePosition(livePos: Position) {
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
    console.log("OLMap::showRoom: " + JSON.stringify(roomResult));
    this.lastShowRoom = Date.now();
    this.mapRoom.markRoomFromSearch(roomResult);
  }

  showRoute(from: number, to: number) {
    console.log("OlmapComponent::showRoute: " + from + " --> " + to);
    this.lastShowRoom = Date.now();
    this.mapRoute.showRoute(from, to);
  }

  clearRoute() {
    console.log("OlmapComponent::clearRoute");
    this.mapRoute.clear();
  }

  closePopup() {
    //console.log("OlmapComponent::closePopup");
    this.mapRoom.closePopup();
  }

  zoomToGeomtry(extent: any) {
    if (extent) {
      let options = {
        padding: [1, 1, 1, 1],
        duration: 500
      }

      if (this.mapView) {
        this.mapView.fit(extent, options);
      }
    }
  }

  zoomToPosition(position: number[]) {
    if (position && position != undefined) {

      let destinationZoom = 20;

      if (destinationZoom > this.map.getView().getZoom()) {
        this.mapView.animate({
          zoom: destinationZoom,
          duration: 500
        });
      }

      this.mapView.animate({
        center: position,
        duration: 500
      });
      //this.mapView.setCenter(position);
    }
  }

  openRoomDialog() {
    //console.log("OlmapComponent::openRoomDialog");

    let dialogRef: MdDialogRef<RoomDialogComponent>;
    let room = this.mapRoom.getMarkedRoom();

    if (room) {
      dialogRef = this.dialog.open(RoomDialogComponent);
      dialogRef.componentInstance.currentRoom = room;
      dialogRef.afterClosed().subscribe(res => this.roomDialogClosed(res));
    }
    this.setFocus();
  }

  roomDialogClosed(res: any) {
    console.log("OlmapComponent::openRoomDialogClosed: " + JSON.stringify(res));
    let currentMarkedRoom = this.mapRoom.getMarkedRoom();
    if (currentMarkedRoom != null && res == "Navigate...") {
      console.log("OlmapComponent::openRoomDialogClosed Emit Navigation Event!");
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
    console.log("Coord Org: " + evt.coordinate + " Pixel: " + pixel);

    let roomFeature = this.getRoomForPos(pixel);
    this.mapRoom.setSelectedRoom(roomFeature);

    let view = this.map.getView();
    //console.log("OlmapComponent::mapClicked: CurrentResolution: " + view.getResolution());
  }

  private getRoomForPos(posPixel: any) {
    let options = {
      layerFilter: (layer => this.testLayerRooms(layer))
    }
    let feature = this.map.forEachFeatureAtPixel(posPixel, function(feature) {
      return feature;
    }, options);

    //if (feature != null) {
    //  console.log("Found room: " + feature.getId());
    //}

    return feature;
  }

  private testLayerRooms(layer: any) {
    return this.mapRoom.getLayer() === layer;
  }

}
