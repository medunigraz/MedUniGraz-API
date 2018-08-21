import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

import { Floor } from '../base/floor';

import ol_style_Style from 'ol/style/Style';
import ol_style_Fill from 'ol/style/Fill';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

export class MapRoom extends MapLayerBase {

  private level: Floor = undefined;
  private multiLevelMode: boolean = false;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol_style_Style({
      /*stroke: new ol.style.Stroke({
        color: 'red',
        width: 0
      }),*/
      fill: new ol_style_Fill({
        color: 'rgba(96,96,255,1)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floor: Floor, multiLayer: boolean) {

    this.level = floor;

    this.clear();

    this.multiLevelMode = multiLayer;

    this.subscribeNewRequest(
      this.mapService.getRooms(this.level.id).subscribe(
        rooms => this.showRooms(rooms),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  private showRooms(features: any): void {
    //console.log("MapRoom::showRooms");
    this.clear();

    let olFeatures = (new ol_format_GeoJSON()).readFeatures(features);
    this.layerSource.addFeatures(olFeatures);

    if (this.multiLevelMode) {
      this.subscribeNewRequest(
        this.mapService.getRooms(this.level.floorAbove).subscribe(
          rooms => this.showRoomsAbove(rooms),
          error => console.log("ERROR deleteNode: " + <any>error)));
    }
  }

  private showRoomsAbove(features: any): void {
    //console.log("MapRoom::showRoomsAbove");
    let ol_features = (new ol_format_GeoJSON()).readFeatures(features);
    for (let i = 0; i < ol_features.length; i++) {
      //let coord = ol_features[i].getGeometry().getCoordinates();
      //ol.coordinate.add(coord, 10, 0);
      ol_features[i].getGeometry().translate(150, 0);
    }
    this.layerSource.addFeatures(ol_features);

    this.subscribeNewRequest(
      this.mapService.getRooms(this.level.floorBelow).subscribe(
        rooms => this.showRoomsBelow(rooms),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  private showRoomsBelow(features: any): void {
    let ol_features = (new ol_format_GeoJSON()).readFeatures(features);
    for (let i = 0; i < ol_features.length; i++) {
      //let coord = ol_features[i].getGeometry().getCoordinates();
      //ol.coordinate.add(coord, 10, 0);
      ol_features[i].getGeometry().translate(-150, 0);
    }
    this.layerSource.addFeatures(ol_features);
  }

  private getDummyRoom(): any {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          'type': 'Feature', "id": 12, 'geometry': {
            "type": "Polygon",
            "coordinates": [
              [[1722195.294385298, 5955266.126823761], [1722204.811691066, 5955261.3495094925],
              [1722202.1244517902, 5955255.975030941], [1722192.6071460224, 5955260.90163628],
              [1722195.294385298, 5955266.126823761]]
            ]
          },
          "properties": {
          }
        }]
    };
  }
}
