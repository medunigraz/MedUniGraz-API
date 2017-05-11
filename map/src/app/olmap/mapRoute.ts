import { MapService } from '../mapservice/map.service';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapRouteStyles } from './mapRouteStyles';

declare var ol: any;

export class MapRoute extends MapLayerBase {

  private currentStartNodeId: number = -1;
  private currentLevelId: number = -1;
  private createRoute: boolean = false;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let styleFunction = function(feature, currentFloor) {
      let style: any = null;
      try {
        let source = feature.get("source_node").properties.level;
        let destination = feature.get("destination_node").properties.level;

        if (source == currentFloor || destination == currentFloor) {
          style = MapRouteStyles.routeCurrentFloor;
        }
      }
      catch (e) {
      }
      if (style) {
        return style;
      }
      else {
        return MapRouteStyles.routeHiddenFloor;
      }
    };

    let res = OpenlayersHelper.CreateBasicLayer(feature => styleFunction(feature, this.currentLevelId));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showRoute(sourceNodeId: number, destinationNodeId: number) {
    if (sourceNodeId >= 0 && destinationNodeId >= 0) {
      console.log("MapRoute::generateRoute From: " + sourceNodeId + " to " + destinationNodeId);

      this.subscribeNewRequest(
        this.mapService.getRoute(sourceNodeId, destinationNodeId).
          subscribe(
          route => this.updateRoute(route),
          error => console.log("ERROR: " + <any>error)));
    }
  }

  public clear() {
    this.layerSource.clear();
  }

  public setCurrentLevel(level: number) {
    this.currentLevelId = level;
    this.layerSource.refresh();
  }

  private updateRoute(route: any) {
    console.log("MapRoute::update Route");
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(route));
  }

}
