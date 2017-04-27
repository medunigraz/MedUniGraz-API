import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

declare var ol: any;

export class MapRoom extends MapLayerBase {

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      /*stroke: new ol.style.Stroke({
        color: 'red',
        width: 0
      }),*/
      fill: new ol.style.Fill({
        color: 'rgba(96,96,255,1)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floorid: number) {
    this.clear();
    this.subscribeNewRequest(
      this.mapService.getRooms(floorid).subscribe(
        rooms => this.showRooms(rooms),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  private showRooms(features: any): void {
    //console.log("MapRoom::showRooms");
    this.clear();

    let olFeatures = (new ol.format.GeoJSON()).readFeatures(features);
    this.layerSource.addFeatures(olFeatures);
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
