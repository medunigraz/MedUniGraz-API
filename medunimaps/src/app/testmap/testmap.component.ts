import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { MapService } from '../mapservice/map.service';

import { RouteMap } from "./routemap"
import { RoomMap } from "./roommap"

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

  constructor(private mapService: MapService) { }

  testString = 'Hi';
  //ol: any;
  map: any;
  poiLayer: any;
  baseMapLayer: any;

  baseMapVectorSource: any; //ol.source.Vector;

  routemap: RouteMap;
  roommap: RoomMap;

  roomOverlay: any;
  roomPopup: any;
  //content = document.getElementById('popup-content');
  //closer = document.getElementById('popup-closer');
  ngAfterViewInit(): void {
    console.log("INIT!!!");
    this.testString += '.................';

    this.loadPOIs();
    this.loadBaseMap();
    this.createOverlay();

    this.routemap = new RouteMap();
    this.routemap.Initialize();

    this.roommap =  new RoomMap();
    this.roommap.Initialize();

    var extent = [0, 0, 51200, 25600];
    var projection = new ol.proj.Projection({
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
      //controls: [],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        this.poiLayer,
        this.baseMapLayer,
        this.routemap.getRouteLayer(),
        this.routemap.getHiddenRouteLayer(),
        this.roommap.getRoomLayer()
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

    this.mapService.getRoomMap(0).then(rooms => this.showRooms(rooms));
  }

  ngOnInit(): void {

  }

  loadPOIs(): void {
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

  showRoute(route: Object[])
  {
    //console.log("showRoute called" + this.testString);
    this.routemap.showRoute(route);
  }

  hideRoute()
  {
    //console.log("hideRoute called");
    this.routemap.hideRoute();
  }

  showRooms(rooms: Object)
  {
    this.roommap.showRooms(rooms);
  }

  mapMouseMoved(evt): void {
    if (evt.dragging) {
       return;
     }
     let pixel = this.map.getEventPixel(evt.originalEvent);
     this.roommap.mouseMoved(pixel, this.map);


  }

  mapClicked(evt): void {
    //console.log("mapClicked called");

    var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    //console.log("Coord: " + lonlat);
    console.log("Coord Org: " + evt.coordinate);

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
