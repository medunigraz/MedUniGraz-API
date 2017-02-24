import { MapService } from '../mapservice/map.service';

declare var ol: any;

export class MapWalls {
  private layer: any;
  private layerSource: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': []
    };

    console.log('Create Wall layer source!');
    this.layerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: 1
        })
      })
    };

    this.layer = new ol.layer.Vector({
      source: this.layerSource,
      style: styleFunction
    });
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getBaseMap(0).then(basemap => this.showWalls(basemap));
  }

  private showWalls(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }
}
