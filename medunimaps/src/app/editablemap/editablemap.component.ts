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
  baseMapVectorSource: any;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.loadBaseMap();

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
        this.baseMapLayer
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

    this.mapService.getRoomMap(0).subscribe(rooms => this.showRooms(rooms));

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

  loadBaseMap(): void {

    let geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            [1722183.8736183767, 5955368.127460353],
            [1722202.0871290227, 5955358.871413959],
            [1722195.2197397628, 5955345.435217581]
          ]]
        }
      }]
    };

    this.baseMapVectorSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.1)'
        })
      })
    };

    this.baseMapLayer = new ol.layer.Vector({
      source: this.baseMapVectorSource,
      style: styleFunction
    });

    //this.heroService.getHeroesSlowly().then(heroes => this.heroesList = heroes);
    this.mapService.getBaseMap(0).then(basemap => this.updateBaseMap(basemap));
  }

  updateBaseMap(baseMap): void {
    this.baseMapVectorSource.clear();
    this.baseMapVectorSource.addFeatures((new ol.format.GeoJSON()).readFeatures(baseMap));
  }

  showRooms(rooms: Object) {
    //this.roommap.showRooms(rooms);
  }
}
