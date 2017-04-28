import { OpenlayersHelper } from './openlayershelper';
import { MapService } from '../mapservice/map.service';

import { MapLayerBase } from './mapLayerBase';
import {PoiType} from '../base/poitype'
import {Poi} from '../base/poi'


declare var ol: any;

export class MapPois extends MapLayerBase {

  private poitypes: PoiType[] = null;
  private currentPoiType: PoiType = null;
  private currentFloor: number = -1;

  private iconStyleMap: { [id: number]: any } = null;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    this.layerSource = new ol.source.Vector({
      features: []
    });

    this.layer = new ol.layer.Vector({
      source: this.layerSource
    });
  }

  public updateData(currentFloor: number): any {
    if (this.iconStyleMap) {
      this.clear();
      this.subscribeNewRequest(
        this.mapService.getPoiInstances(currentFloor).subscribe(
          buildings => this.showPois(buildings),
          error => console.log("ERROR deleteNode: " + <any>error)));
    }
  }

  public setPoiTypes(poiTypes: PoiType[]) {
    this.poitypes = poiTypes;
    this.iconStyleMap = {};

    for (let i = 0; i < poiTypes.length; i++) {
      let iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: poiTypes[i].iconurl
        }))
      });

      this.iconStyleMap[poiTypes[i].id] = iconStyle;
    }

    if (this.currentFloor >= 0) {
      this.updateData(this.currentFloor);
    }
  }

  public setCurrentSelectedPoiType(poiType: PoiType) {
    this.currentPoiType = poiType;
  }

  public setCurrentFloor(layer: number) {
    console.log("MapPois::setCurrentFloor");
    this.currentFloor = layer;
  }

  public mouseClicked(position: any, strgPressed: boolean, map: any) {
    if (strgPressed && this.currentPoiType && this.currentFloor >= 0) {

      let center = {
        "type": "Point",
        "coordinates": [position[0], position[1]]
      };

      this.mapService.addPoiInstance(this.currentFloor, center, this.currentPoiType.id).
        subscribe(
        node => this.updateAddPoi(node),
        error => console.log("ERROR: " + <any>error));
    }
  }

  private showPois(features: any) {
    console.log("MapPois::showPois");
    this.clear();

    this.showPoisWithStyles((new ol.format.GeoJSON()).readFeatures(features));

    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private showPoisWithStyles(olFeatures: any) {
    for (let i = 0; i < olFeatures.length; i++) {
      let id = olFeatures[i].getId();
      let poiTypeId = olFeatures[i].get("name");
      console.log("MapPois::showPoisWithStyles: " + id + "#" + poiTypeId);
      olFeatures[i].setStyle(this.iconStyleMap[poiTypeId]);
    }

    this.layerSource.addFeatures(olFeatures);
  }

  private updateAddPoi(poi: any) {
    console.log("MapPois::updateAddNode! - " + JSON.stringify(poi));

    this.showPoisWithStyles((new ol.format.GeoJSON()).readFeatures(poi));

    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(poi));
  }
}
