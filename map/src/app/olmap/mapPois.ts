import { MapService } from '../mapservice/map.service';
import { OpenlayersHelper } from './openlayershelper';
import { MapLayerBase } from './mapLayerBase';
import { PoiType } from '../base/poiType'
import { Poi } from '../base/poi'

import { Logger } from '../base/logger';


import ol_style_Style from 'ol/style/Style';
import ol_style_Fill from 'ol/style/Fill';
import ol_style_Text from 'ol/style/Text';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

import ol_source_Vector from 'ol/source/Vector';
import ol_layer_Vector from 'ol/layer/Vector';

import ol_Feature from 'ol/Feature';
import ol_geom_Point from 'ol/geom/Point';
import ol_geom_Circle from 'ol/geom/Circle';
import ol_style_Stroke from 'ol/style/Stroke';

declare var ol: any;

//http://openlayers.org/en/latest/examples/icon.html
//new Version!

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

    this.layerSource = new ol_source_Vector({
      features: []
    });

    this.layer = new ol_layer_Vector({
      source: this.layerSource,
      renderOrder: function(f1: any, f2: any) {

        //Logger.log("...." + f1.get("orderIndex") + "/" + f2.get("orderIndex"));
        if (f1.get("orderIndex") > f2.get("orderIndex")) {
          return 1;
        }
        return -1;
      }
    });
  }

  public setPoiTypes(poiTypes: PoiType[]) {

    Logger.log("MapPois::setPoiTypes...");

    this.poitypes = poiTypes;

    if (!this.iconStyleMap) {
      this.initIconStypeMap();
    }
    this.updateActivePois();
    this.updatePois();

  }

  public showFloor(currentFloor: number): any {
    //Logger.log("MapPois::showFloor: " + JSON.stringify(currentFloor));

    this.clear();
    this.subscribeNewRequest(
      this.mapService.getPoiInstances(currentFloor).subscribe(
        poiinstances => this.poisReceived(poiinstances),
        error => Logger.log("ERROR deleteNode: " + <any>error)));
  }

  public poisReceived(features: any) {
    //Logger.log("MapPois::poisReceived: " + JSON.stringify(features));
    this.poiInstances = (new ol_format_GeoJSON()).readFeatures(features);
    this.updatePois();
  }

  private updatePois() {
    if (!this.poiInstances || !this.iconStyleMap || !this.activeIconsMap) {
      Logger.log("MapPois::updatePois: ... No POIS... ");
      return;
    }

    this.clear();

    Logger.log("MapPois::updatePois: " + JSON.stringify(this.poiInstances.length));


    let orderIndex = 0;

    for (let i = 0; i < this.poiInstances.length; i++) {
      let id = this.poiInstances[i].getId();
      let poiTypeId = this.poiInstances[i].get("name");


      if (this.activeIconsMap[poiTypeId]) {
        //Logger.log("MapPois::updatePois Add Poi: " + id);
        //Logger.log("        MapPois::updatePois Add Poi: " + JSON.stringify(this.iconMarkerMap[poiTypeId]));
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

      let iconStyle = new ol_style_Style({
        text: new ol_style_Text({
          text: this.poitypes[i].fontKey,
          font: 'normal 30px medfont',
          textBaseline: 'bottom',
          //offsetY: -12,
          offsetY: -8,
          fill: new ol_style_Fill({
            color: 'white',
          })
        })
      });

      this.iconStyleMap[this.poitypes[i].id] = iconStyle;

      let markerStyle = new ol_style_Style({
        text: new ol_style_Text({
          //text: 'l',
          text: 'm',
          //font: 'normal 44px medfont',
          font: 'normal 40px medfont',
          textBaseline: 'bottom',
          offsetY: 0,
          fill: new ol_style_Fill({
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
