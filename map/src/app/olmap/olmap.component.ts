import { Component, OnInit, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import { MapPois } from './mapPois';
import { MapRoom } from './mapRoom';
import { MapBuilding } from './mapBuilding'
import { MapDoors } from './mapDoors'

import {MdDialog, MdDialogRef} from '@angular/material';

import {RoomDialogComponent} from '../room-dialog/room-dialog.component'
import {Room} from '../base/room';


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

  private currentRoomMarker: Room = null;

  private mapPois: MapPois = null;
  private mapRoom: MapRoom = null;
  private mapBuilding: MapBuilding = null;
  private mapDoors: MapDoors = null;

  private mapView: any;

  ngOnInit() {
  }

  private map: any;

  ngAfterViewInit(): void {

    this.mapPois = new MapPois();
    this.mapRoom = new MapRoom(this.roomPopupDiv, this.roomPopupText, this, this.mapService);
    this.mapBuilding = new MapBuilding(this.mapService);
    this.mapDoors = new MapDoors();

    let interactions = ol.interaction.defaults({ altShiftDragRotate: false, pinchRotate: false });

    this.mapView = new ol.View({
      projection: 'EPSG:900913',
      center: ol.proj.fromLonLat([15.47, 47.0805]),
      //center: ol.extent.getCenter(extent),
      zoom: 18,
      maxZoom: 24,
      minZoom: 4//16
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
          source: new ol.source.OSM()
        }),
        this.mapBuilding.getLayer(),
        this.mapRoom.getLayer(),
        this.mapDoors.getLayer(),
        this.mapPois.getLayer()
      ],
      overlays: [this.mapRoom.getOverlay()],
      target: 'map',
      view: this.mapView
    });

    this.mapBuilding.showFloor(0);
    //this.mapDoors.showFloor(0);
    this.mapRoom.showFloor(1);

    this.map.on('click', evt => this.mapClicked(evt));
    this.map.on('pointermove', evt => this.mapMouseMoved(evt));
  }

  setFocus(): void {
    this.mapDiv.nativeElement.focus();
  }

  showRoom(roomResult: Room) {
    //console.log("OlmapComponent::showRoom: " + roomResult.id + "/" + roomResult.text);
    this.currentRoomMarker = roomResult;
    this.mapRoom.highlightRoom(roomResult.id, roomResult.text);
  }

  showRoute(from: number, to: number) {
    //console.log("OlmapComponent::showRoute: " + from + " --> " + to);
  }

  closePopup() {
    //console.log("OlmapComponent::closePopup");
    this.mapRoom.closePopup();
  }

  zoomToPosition(position: [number]) {
    if (position && position != undefined) {

      this.mapView.animate({
        zoom: 20,
        duration: 1000
      });

      this.mapView.animate({
        center: position,
        duration: 1000
      });

      //this.mapView.setCenter(position);

    }
  }

  openRoomDialog() {
    //console.log("OlmapComponent::openRoomDialog");

    let dialogRef: MdDialogRef<RoomDialogComponent>;

    dialogRef = this.dialog.open(RoomDialogComponent);
    dialogRef.afterClosed().subscribe(res => this.roomDialogClosed(res));
    this.setFocus();
  }

  roomDialogClosed(res: any) {
    console.log("OlmapComponent::openRoomDialogClosed: " + JSON.stringify(res));
    if (this.currentRoomMarker != null && res == "Navigate...") {
      //console.log("OlmapComponent::openRoomDialogClosed Emit Navigation Event!");
      this.onShowRoute.emit(this.currentRoomMarker);
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
