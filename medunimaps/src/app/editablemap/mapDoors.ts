import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

declare var ol: any;

export class MapDoors extends MapLayerBase {

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(212, 209, 203,1.0)'
      })
    }));
    res.layer.set('maxResolution', 0.2);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floorId: number) {
    console.log("MapDoors::showFloor - " + floorId);
    //this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(this.getDummyDoors()));

    this.clear();
    this.mapService.getDoors(floorId).subscribe(
      doors => this.showDoors(doors),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  private clear() {
    this.layerSource.clear();
  }

  private showDoors(features: any) {
    console.log("MapDoors::showDoors");
    this.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
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
