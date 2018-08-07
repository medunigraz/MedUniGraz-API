import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

import { Logger } from '../base/logger';

import { OlmapComponent } from './olmap.component'

declare var ol: any;

import ol_style_Style from 'ol/style/Style';
import ol_style_Fill from 'ol/style/Fill';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

export class MapDoors extends MapLayerBase {

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol_style_Style({
      fill: new ol_style_Fill({
        color: 'rgba(212, 209, 203,1.0)'
      })
    }));
    res.layer.set('maxResolution', 0.2);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showFloor(floorId: number) {
    //Logger.log("MapDoors::showFloor - " + floorId);
    //this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(this.getDummyDoors()));

    this.clear();
    this.subscribeNewRequest(
      this.mapService.getDoors(floorId).subscribe(
        doors => this.showDoors(doors),
        error => Logger.log("ERROR deleteNode: " + <any>error)));
  }

  private showDoors(features: any) {
    //Logger.log("MapDoors::showDoors");
    this.clear();
    this.layerSource.addFeatures((new ol_format_GeoJSON()).readFeatures(features));
  }

  private getDummyDoors(): any {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          'type': 'Feature', "id": 12, 'geometry': {
            "type": "Polygon",
            "coordinates": [
              [
                [1722150.9832473625, 5955259.831606609],
                [1722152.513480839, 5955262.780105258],
                [1722153.8944232445, 5955262.406877581],
                [1722152.924031284, 5955260.727353034],
                [1722150.9832473625, 5955259.831606609]
              ]
            ]
          },
          "properties": {
          }
        }]
    };
  }
}
