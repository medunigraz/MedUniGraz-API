import { MapService } from '../mapservice/map.service';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';

declare var ol: any;

export class MapBackground extends MapLayerBase {

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(199, 199, 180,1.0)'
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showBackground() {
    //console.log("MapRoute::showBackground...");
    this.updateBackground(this.getDummyBackground());
    /*
    this.subscribeNewRequest(
      this.mapService.getBackground().
        subscribe(
        background => this.updateBackground(background),
        error => console.log("ERROR: " + <any>error)));
        */
  }

  public clear() {
    this.layerSource.clear();
  }

  private updateBackground(background: any) {
    //console.log("MapBackground::updateBackground");
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(background));
  }

  private getDummyBackground(): any {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          'type': 'Feature', "id": 12, 'geometry': {
            "type": "Polygon",
            "coordinates": [
              [[1722058.0195873233, 5955111.3343933625],
              [1722035.327344551, 5955120.889021898],
              [1722154.7602012467, 5955359.754735289],
              [1722235.9745437996, 5955412.902356518],
              [1722265.23559369, 5955402.153399416],
              [1722261.6526079893, 5955365.726378124],
              [1722215.0737938778, 5955256.445314247],
              [1722177.4524440188, 5955180.605450246],
              [1722135.053779892, 5955151.344400356],
              [1722075.337351544, 5955121.486186181]]
            ]
          },
          "properties": {
          }
        }]
    };
  }
}
