import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

declare var ol: any;

export class MapFloor extends MapLayerBase {

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(64,64,64,1.0)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floorid: number) {

    this.clear();
    this.subscribeNewRequest(
      this.mapService.getFloors(floorid).subscribe(
        buildings => this.showFloors(buildings),
        error => console.log("ERROR deleteNode: " + <any>error)));

    //this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(this.getDummyFloor()));
  }

  private showFloors(features: any) {
    console.log("MapFloors::showFloors");
    this.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private getDummyFloor(): any {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          'type': 'Feature', "id": 12, 'geometry': {
            "type": "Polygon",
            "coordinates": [
              [
                [1722127.851590177, 5955257.966158812],
                [1722184.2836149659, 5955368.142969113],
                [1722202.4971256119, 5955359.185504861],
                [1722195.33115421, 5955345.450726341],
                [1722198.914139911, 5955343.360651349],
                [1722177.4162257058, 5955302.156315789],
                [1722173.2360757214, 5955303.649226498],
                [1722145.169354398, 5955249.307276702],
                [1722127.851590177, 5955257.966158812]
              ]
            ]
          },
          "properties": {
          }
        }]
    };
  }
}
