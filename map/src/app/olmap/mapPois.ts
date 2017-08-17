import { MapService } from '../mapservice/map.service';
import { OpenlayersHelper } from './openlayershelper';
import { MapLayerBase } from './mapLayerBase';
import { PoiType } from '../base/poitype'
import { Poi } from '../base/poi'

declare var ol: any;

export class MapPois extends MapLayerBase {

  private poitypes: PoiType[] = null;

  private iconStyleMap: { [id: number]: any } = null;
  private iconMarkerMap: { [id: number]: any } = null;
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
      source: this.layerSource,
      renderOrder: function(f1: any, f2: any) {
        //console.log("...." + f1.get("orderIndex") + "/" + f2.get("orderIndex"));
        if (f1.get("orderIndex") > f2.get("orderIndex")) {
          return 1;
        }
        return -1;
      }
    });
  }

  public setPoiTypes(poiTypes: PoiType[]) {

    //console.log("MapPois::setPoiTypes...");

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
    if (!this.poiInstances || !this.iconStyleMap || !this.activeIconsMap) {
      return;
    }

    this.clear();

    //console.log("MapPois::updatePois: " + JSON.stringify(this.poiInstances.length));

    let orderIndex = 0;

    for (let i = 0; i < this.poiInstances.length; i++) {
      let id = this.poiInstances[i].getId();
      let poiTypeId = this.poiInstances[i].get("name");

      if (this.activeIconsMap[poiTypeId]) {
        //console.log("MapPois::updatePois Add Poi: " + id);
        let markerfeature = this.poiInstances[i].clone();

        markerfeature.setStyle(this.iconMarkerMap[poiTypeId]);
        markerfeature.set("orderIndex", orderIndex);
        orderIndex++;
        this.layerSource.addFeature(markerfeature);

        this.poiInstances[i].setStyle(this.iconStyleMap[poiTypeId]);
        this.poiInstances[i].set("orderIndex", orderIndex);
        orderIndex++;
        this.layerSource.addFeature(this.poiInstances[i]);

      }
    }
  }

  private initIconStypeMap() {

    if (!this.poitypes) {
      return;
    }

    this.iconStyleMap = {};
    this.iconMarkerMap = {};

    for (let i = 0; i < this.poitypes.length; i++) {

      //let iconStyle = new ol.style.Style({
      //  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
      //    anchor: [0.5, 1],
      //    anchorXUnits: 'fraction',
      //    anchorYUnits: 'fraction',
      //    src: this.poitypes[i].icon
      //  }))
      //});

      let iconStyle = new ol.style.Style({
        text: new ol.style.Text({
          text: this.poitypes[i].fontKey,
          font: 'normal 30px medfont',
          textBaseline: 'Bottom',
          //offsetY: -12,
          offsetY: -8,
          fill: new ol.style.Fill({
            color: 'white',
          })
        })
      });

      this.iconStyleMap[this.poitypes[i].id] = iconStyle;

      let markerStyle = new ol.style.Style({
        text: new ol.style.Text({
          //text: 'l',
          text: 'm',
          //font: 'normal 44px medfont',
          font: 'normal 40px medfont',
          textBaseline: 'Bottom',
          offsetY: 0,
          fill: new ol.style.Fill({
            color: this.poitypes[i].color,
          })
        })
      });

      this.iconMarkerMap[this.poitypes[i].id] = markerStyle;
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
