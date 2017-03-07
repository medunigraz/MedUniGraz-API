import { MapService } from '../mapservice/map.service';
import { OpenlayersHelper } from './openlayershelper';

declare var ol: any;

export class MapWalls {
  private layer: any;
  private layerSource: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 1
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(floorId: number): any {
    this.mapService.getBaseMap(floorId).then(basemap => this.showWalls(basemap));
  }

  private showWalls(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }
}
