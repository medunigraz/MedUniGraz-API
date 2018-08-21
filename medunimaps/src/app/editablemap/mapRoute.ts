import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';
import { Point } from '../base/point'

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapRouteStyles } from './mapRouteStyles';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

export class MapRoute extends MapLayerBase {

  private currentStartNodeId: number = -1;
  private currentFloorId: number = -1;
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

    let res = OpenlayersHelper.CreateBasicLayer(feature => styleFunction(feature, this.currentFloorId));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public setNewStartPos(nodeId: number) {
    this.currentStartNodeId = nodeId;
  }

  public shiftPressed() {
    this.createRoute = true;
  }

  public shiftReleased() {
    this.createRoute = false;
  }

  public doShowRoute(): boolean {
    return this.createRoute;
  }

  public generateRoute(destinationNode: number) {
    if (this.currentStartNodeId >= 0 && destinationNode >= 0) {
      console.log("MapRoute::generateRoute From: " + this.currentStartNodeId + " to " + destinationNode);

      this.subscribeNewRequest(
        this.mapService.getRoute(this.currentStartNodeId, destinationNode).
          subscribe(
          route => this.updateRoute(route),
          error => console.log("ERROR: " + <any>error)));
    }
  }

  public clear() {
    this.layerSource.clear();
  }

  public setCurrentFloor(floor: number) {
    this.currentFloorId = floor;
    this.layerSource.refresh();
  }

  private updateRoute(route: any) {
    console.log("MapRoute::update Route");
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol_format_GeoJSON()).readFeatures(route));
  }

}
