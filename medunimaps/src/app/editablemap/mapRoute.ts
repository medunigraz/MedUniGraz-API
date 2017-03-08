import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';
import { Point } from '../base/point'

import { OpenlayersHelper } from './openlayershelper';
import { MapRouteStyles } from './mapRouteStyles';

declare var ol: any;

export class MapRoute {
  private layer: any;
  private layerSource: any;

  private currentStartNodeId: number = -1;
  private createRoute: boolean = false;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {

    let styleFunction = function(feature) {
      return MapRouteStyles.routeCurrentFloor;
      //return MapRouteStyles.routeHiddenFloor;
    };

    let res = OpenlayersHelper.CreateBasicLayer(styleFunction);
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

      this.mapService.getRoute(this.currentStartNodeId, destinationNode).
        subscribe(
        route => this.updateRoute(route),
        error => console.log("ERROR: " + <any>error));
    }
  }


  public clear() {
    this.layerSource.clear();
  }

  public getLayer(): any {
    return this.layer;
  }

  private updateRoute(route: any) {
    console.log("MapRoute::update Route");
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(route));
  }

}
