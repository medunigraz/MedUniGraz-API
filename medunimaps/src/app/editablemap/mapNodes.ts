import { MapService } from '../mapservice/map.service';

import { OpenlayersHelper } from './openlayershelper';

declare var ol: any;

export class MapNodes {
  private layer: any;
  private layerSource: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let image = new ol.style.Circle({
      radius: 4,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'green', width: 2 })
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        image: image
      })
    };

    let res = OpenlayersHelper.CreateBasicLayer(styleFunction);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationNodes(0).subscribe(nodes => this.showNodes(nodes));
  }

  private showNodes(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private initSelection() {
    /*
    let selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
      });*/
  }
}
