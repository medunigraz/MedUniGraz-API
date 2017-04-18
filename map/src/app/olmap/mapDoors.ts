import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

import {OlmapComponent} from './olmap.component'

declare var ol: any;

export class MapDoors {

  private layer: any;
  private layerSource: any;

  constructor() {
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(128,128,128,0.5)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showFloor(id: number) {
    console.log("MapDoors::showFloor - " + id);
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(this.getDummyDoors()));
  }

  public getLayer(): any {
    return this.layer;
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
