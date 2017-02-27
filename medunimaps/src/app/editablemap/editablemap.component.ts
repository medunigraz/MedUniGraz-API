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

import { MapWalls } from './mapWalls';
import { MapNodes } from './mapNodes';


declare var ol: any;

@Component({
  selector: 'app-editablemap',
  templateUrl: './editablemap.component.html',
  styleUrls: ['./editablemap.component.css']
})
export class EditablemapComponent implements OnInit {

  private _applicationMode: ApplicationMode = ApplicationMode.CreateDefault();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  private map: any;
  private baseMapLayer: any;
  private baseMapVectorSource: any;

  private mapWalls: MapWalls = null;
  private mapNodes: MapNodes = null;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.mapWalls = new MapWalls(this.mapService);
    this.mapNodes = new MapNodes(this.mapService);

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
        this.mapWalls.getLayer(),
        this.mapNodes.getLayer()
      ],
      overlays: [],
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:900913',
        center: ol.proj.fromLonLat([15.47, 47.0805]),
        //center: ol.extent.getCenter(extent),
        zoom: 18,
        maxZoom: 22,
        minZoom: 1//16
      })
    });

    this.mapWalls.updateData();
    this.mapNodes.updateData();

    this.map.on('pointermove', evt => this.mapMouseMoved(evt));
  }

  @Input()
  set applicationMode(applicationMode: ApplicationMode) {
    this._applicationMode = applicationMode;
    console.log("TestmapComponent::Set applicationMode - New App Mode: " + this._applicationMode.name);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log("KEYDOWN: " + event.keyCode);

    if (this._applicationMode.mode == ApplicationModeT.EDIT_PATHS && event.keyCode == 46) //Entf Key
    {
      console.log("KEYDOWN - Delete Edge " + event.keyCode + "#");
    }
  }

  mapMouseMoved(evt): void {
    if (evt.dragging) {
      return;
    }
    let pixel = this.map.getEventPixel(evt.originalEvent);
    if (this._applicationMode.mode == ApplicationModeT.EDIT_EDGES) {
      this.mapNodes.mouseMoved(pixel, this.map);
    }
  }

}
