import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import {HostListener} from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';
import { MODIFY_EDGE_MINSTARTPOINT_DISTANCE } from '../base/globalconstants';
import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { RouteMap } from "./routemap"
import { RoomMap } from "./roommap"
import { NavigationMap } from "./navigationedges"

declare var ol: any;

//https://openlayers.org/en/latest/examples/icon.html
//https://openlayers.org/en/latest/examples/vector-layer.html
//http://openlayers.org/en/v3.4.0/examples/popup.html
//https://scotch.io/tutorials/routing-angular-2-single-page-apps-with-the-component-router

//https://github.com/angular/angular-cli

//https://github.com/angular/material2/blob/master/docs/theming.md


@Component({
  selector: 'app-testmap',
  templateUrl: './testmap.component.html',
  styleUrls: ['./testmap.component.css']
})
@Injectable()
export class TestmapComponent implements OnInit, AfterViewInit {

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  private _applicationMode: ApplicationMode = ApplicationMode.CreateDefault();

  testString = 'Hi';
  //ol: any;
  map: any;
  poiLayer: any;
  baseMapLayer: any;

  baseMapVectorSource: any; //ol.source.Vector;

  routemap: RouteMap;
  roommap: RoomMap;
  navigationmap: NavigationMap;

  roomOverlay: any;
  roomPopup: any;

  select: any;
  modify: any;

  //content = document.getElementById('popup-content');
  //closer = document.getElementById('popup-closer');
  ngAfterViewInit(): void {
    console.log("INIT!!!");

    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.testString += '.................';

    this.loadPOIs();
    this.loadBaseMap();
    this.createOverlay();

    this.select = new ol.interaction.Select({
      wrapX: false,
      /*
      layers: function(layer) {
          return false;
          //return this.allowOLSelection(layer);
        }*/
      layers: (layer => this.allowOLSelection(layer))
    });

    this.routemap = new RouteMap();
    this.routemap.Initialize();

    this.navigationmap = new NavigationMap(this.mapService);
    this.navigationmap.Initialize(this.select);

    this.roommap = new RoomMap();
    this.roommap.Initialize(this.navigationmap);

    this.modify = new ol.interaction.Modify({
      features: this.select.getFeatures(),
      condition: (evt => this.allowOLModify(evt))
    });

    let extent = [0, 0, 51200, 25600];
    let projection = new ol.proj.Projection({
      code: 'static-image',
      units: 'pixels',
      imageExtent: extent
    });

    this.map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        this.poiLayer,
        this.baseMapLayer,
        this.routemap.getRouteLayer(),
        this.routemap.getHiddenRouteLayer(),
        this.roommap.getRoomLayer(),
        this.navigationmap.getEdgeLayer(),
        this.navigationmap.getEdgePathLayer()
      ],
      overlays: [this.roomOverlay],
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

    this.map.on('click', evt => this.mapClicked(evt));
    this.map.on('pointermove', evt => this.mapMouseMoved(evt));

    //this.mapService.getRoomMap(0).then(rooms => this.showRooms(rooms));
    this.mapService.getRoomMap(0).subscribe(rooms => this.showRooms(rooms));
    this.mapService.getNavigationEdges(0).subscribe(edges => this.showNavigationEdges(edges));

    this.select.on('select', evt => this.selectionChanged(evt));
  }

  ngOnInit(): void {

  }

  @Input()
  set applicationMode(applicationMode: ApplicationMode) {
    if (this.select) {
      //console.log("Clear selection..." + this.select.getFeatures().getArray().length);
      let selected_collection = this.select.getFeatures();

      if (this._applicationMode.mode == /*ApplicationModeT.EDIT_PATHS*/ ApplicationModeT.EDIT_NODES &&
        selected_collection.getArray().length > 0) {
        this.navigationmap.updateEdges(selected_collection.getArray());
      }

      selected_collection.clear();
    }
    if (this.roommap) {
      this.roommap.Clear();
    }

    this._applicationMode = applicationMode;

    console.log("TestmapComponent::Set applicationMode - New App Mode: " + this._applicationMode.name);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log("KEYDOWN: " + event.keyCode);

    if (this._applicationMode.mode == /*ApplicationModeT.EDIT_PATHS*/ ApplicationModeT.EDIT_NODES && event.keyCode == 46) //Entf Key
    {
      console.log("KEYDOWN - Delete Edge " + event.keyCode + "#" + this.select.getFeatures().getArray().length);
      this.navigationmap.deleteSelectedEdge();
      let selected_collection = this.select.getFeatures();
      selected_collection.clear();
    }

  }

  allowOLSelection(layer: any): boolean {
    //layer.set('dummy', 'xxxsaef');
    //console.log("allowOLSelection..." + JSON.stringify(layer.get('dummy')));
    //console.log("allowOLSelection... isSelectable ..." + JSON.stringify(layer.get('isSelectable')));

    if (layer.get('isSelectable') && this._applicationMode.mode == /*ApplicationModeT.EDIT_PATHS*/ ApplicationModeT.EDIT_NODES) {
      return true;
    }
    return false;
  }

  selectionChanged(evt: any): void {

    let selectedFeatures = evt.selected;
    let deselectedFeatures = evt.deselected;

    //console.log("Selection changed:  newFeatures: " + selectedFeatures.length +
    //  "  unselectedFeatures: " + deselectedFeatures.length +
    //  "  mode: " + this._applicationMode.name);

    if (deselectedFeatures.length > 0) {
      this.navigationmap.updateEdges(deselectedFeatures);
    }
  }

  allowOLModify(evt: any) {
    if (this._applicationMode.mode == /*ApplicationModeT.EDIT_PATHS*/ ApplicationModeT.EDIT_NODES) {
      let selectedFeatures = this.select.getFeatures().getArray();

      //console.log("allowOLModify: Length: " + selectedFeatures.length);

      if (selectedFeatures.length > 0) {
        for (let feature of selectedFeatures) {
          let geometry = feature.getGeometry();
          let startPoint = geometry.getFirstCoordinate();
          let endPoint = geometry.getLastCoordinate();

          //console.log("allowOLModify: " + JSON.stringify(evt.coordinate) +
          //  "::" + JSON.stringify(startPoint) +
          //  "::" + JSON.stringify(endPoint) +
          //  "d1:" + this.getDistance(startPoint, evt.coordinate) +
          //  "d2:" + this.getDistance(endPoint, evt.coordinate)
          //);

          if (this.getDistance(startPoint, evt.coordinate) < MODIFY_EDGE_MINSTARTPOINT_DISTANCE ||
            this.getDistance(endPoint, evt.coordinate) < MODIFY_EDGE_MINSTARTPOINT_DISTANCE) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private getDistance(p1: number[], p2: number[]): number {
    let xdiff = p2[0] - p1[0];
    let ydiff = p2[1] - p1[1];
    return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
  }

  private loadPOIs(): void {
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([15.470230579376215, 47.0812626175388])),
      name: 'Test Point',
      description: 'dummy description'
    });

    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/testicon.png'
      }))
    });
    iconFeature.setStyle(iconStyle);

    let vectorSource = new ol.source.Vector({
      features: [iconFeature]
    });

    this.poiLayer = new ol.layer.Vector({
      source: vectorSource
    });
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

  createOverlay(): void {
    this.roomPopup = document.getElementById('roomPopup');
    console.log(this.roomPopup);

    this.roomOverlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
      element: this.roomPopup,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    //this.roomOverlay.setPosition([0, 0]);
  }

  showRoute(route: Object[]) {
    //console.log("showRoute called" + this.testString);
    this.routemap.showRoute(route);
  }

  hideRoute() {
    //console.log("hideRoute called");
    this.routemap.hideRoute();
  }

  showRooms(rooms: Object) {
    this.roommap.showRooms(rooms);
  }

  showNavigationEdges(edges: Object) {
    this.navigationmap.showEdges(edges);
  }

  mapMouseMoved(evt): void {
    if (evt.dragging) {
      return;
    }
    let pixel = this.map.getEventPixel(evt.originalEvent);
    if (this._applicationMode.mode == ApplicationModeT.EDIT_NODES) {
      this.roommap.mouseMoved(pixel, this.map);
    }
  }

  mapClicked(evt): void {
    //console.log("mapClicked called");

    var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    //console.log("Coord: " + lonlat);
    console.log("Coord Org: " + evt.coordinate + " strg: " + evt.originalEvent.ctrlKey);
    console.log("Number of selected features: " + this.select.getFeatures().getArray().length);

    if (this._applicationMode.mode == ApplicationModeT.EDIT_NODES) {
      if (evt.originalEvent.ctrlKey) {
        this.roommap.mouseClickedCtrl(evt.coordinate, this.map);
      }
      else {
        this.roommap.mouseClicked(evt.coordinate, this.map);
      }
    }


    var coordinate = evt.coordinate;
    //var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

    //this.roomOverlay.setPosition(coordinate);

    /*
      var feature = this.map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });


      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        console.log("Feature Coord: " + coordinates);
      }
      else {
        var coordinates = feature.getGeometry().getCoordinates();
        console.log("Map Coord: " + coordinates);
      }*/
  }
}
