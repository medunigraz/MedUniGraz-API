import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';

import {Position} from '../base/position';

declare var ol: any;

export class MapLivePosition extends MapLayerBase {

  private circle: any;
  private circleFeature: any;

  private positionVisible: boolean = false;

  constructor() {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 1)'
      })
    }));

    this.circle = new ol.geom.Circle([0, 0], 4);
    this.circleFeature = new ol.Feature(this.circle);

    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showLivePosition(livePos: Position) {
    console.log("MapLivePosition::showLivePosition..." + JSON.stringify(livePos));

    if (!livePos) {
      this.clear();
      this.positionVisible = false;
    }
    else {
      if (!this.positionVisible) {
        this.AddPositionFeature();
      }
      this.circle.setCenter([livePos.x, livePos.y]);
    }
  }

  private AddPositionFeature() {
    this.layerSource.addFeature(this.circleFeature);
    this.positionVisible = true;
  }

}
