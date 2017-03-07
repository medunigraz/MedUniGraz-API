import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';
import { Point } from '../base/point'

import { OpenlayersHelper } from './openlayershelper';

declare var ol: any;

export class MapRoute {
  private layer: any;
  private layerSource: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'green',
        width: 3
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;

  }

  public setNewStartPos(nodeId: Number) {
  }


  public clear() {
    this.layerSource.clear();
  }

  public getLayer(): any {
    return this.layer;
  }

  private routeUpdated(edge: any) {
    //Nothing todo
  }

}
