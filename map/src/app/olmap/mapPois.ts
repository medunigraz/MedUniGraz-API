import { MapService } from '../mapservice/map.service';
import { OpenlayersHelper } from './openlayershelper';
import { MapLayerBase } from './mapLayerBase';
import {PoiType} from '../base/poitype'
import {Poi} from '../base/poi'

declare var ol: any;

export class MapPois extends MapLayerBase {

  private poitypes: PoiType[] = null;

  private iconStyleMap: { [id: number]: any } = null;
  private activeIconsMap: { [id: number]: boolean } = null;

  private poiInstances: any = null;

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

  public setPoiTypes(poiTypes: PoiType[]) {

    console.log("MapPois::setPoiTypes...");

    this.poitypes = poiTypes;

    if (!this.iconStyleMap) {
      this.initIconStypeMap();
    }
    this.updateActivePois();
    this.updatePois();
  }

  public showFloor(currentFloor: number): any {
    //console.log("MapPois::showFloor: " + JSON.stringify(currentFloor));
    this.clear();
    this.subscribeNewRequest(
      this.mapService.getPoiInstances(currentFloor).subscribe(
        poiinstances => this.poisReceived(poiinstances),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  public poisReceived(features: any) {
    //console.log("MapPois::poisReceived: " + JSON.stringify(features));
    this.poiInstances = (new ol.format.GeoJSON()).readFeatures(features);
    this.updatePois();
  }

  private updatePois() {
    this.clear();

    if (!this.poiInstances || !this.iconStyleMap || !this.activeIconsMap) {
      return;
    }

    //console.log("MapPois::updatePois: " + JSON.stringify(this.poiInstances.length));
    for (let i = 0; i < this.poiInstances.length; i++) {
      let id = this.poiInstances[i].getId();
      let poiTypeId = this.poiInstances[i].get("name");

      if (this.activeIconsMap[poiTypeId]) {
        //console.log("MapPois::updatePois Add Poi: " + id);
        this.poiInstances[i].setStyle(this.iconStyleMap[poiTypeId]);
        this.layerSource.addFeature(this.poiInstances[i]);
      }
    }
  }

  private initIconStypeMap() {

    if (!this.poitypes) {
      return;
    }

    this.iconStyleMap = {};

    for (let i = 0; i < this.poitypes.length; i++) {
      let iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: this.poitypes[i].icon
        }))
      });

      this.iconStyleMap[this.poitypes[i].id] = iconStyle;
    }
  }

  private updateActivePois() {
    if (!this.poitypes) {
      return;
    }

    this.activeIconsMap = {};
    for (let i = 0; i < this.poitypes.length; i++) {
      this.activeIconsMap[this.poitypes[i].id] = this.poitypes[i].isActive;
    }
  }
}
