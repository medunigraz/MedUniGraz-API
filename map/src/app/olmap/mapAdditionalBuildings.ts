import { OpenlayersHelper } from './openlayershelper';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { MapLayerBase } from './mapLayerBase';

import { OlmapComponent } from './olmap.component'

import { Logger } from '../base/logger';

declare var ol: any;

import ol_style_Style from 'ol/style/Style';
import ol_style_Fill from 'ol/style/Fill';
import ol_style_Text from 'ol/style/Text';
import ol_style_Stroke from 'ol/style/Stroke';
import ol_format_GeoJSON from 'ol/format/GeoJSON';
import ol_Overlay from 'ol/Overlay';


export class MapAdditionalBuilding extends MapLayerBase {
  public urlToBuilding;
  private overlay: any;
  private currentHighlightedAdditionalBuilding: any = null;
  private currentSelectedAdditionalBuilding: any = null;
  private currentMarkedAdditionalBuilding: any = null;
  private currentOverlayText: string = "";
  private currentOverlayPosition: number[];

  constructor(public additionalBuildingPopupDiv: ElementRef, private additionalBuildingContentSpan: ElementRef, private mapComponent: OlmapComponent, private mapService: MapService) {
    super();
    this.Initialize();
  }

  private normalStyle(feature)
  {
    return [
      new ol_style_Style({
        fill: new ol_style_Fill({
          color: 'rgba(148,150,154,1.0)'
        }),
       stroke: new ol_style_Stroke({
          color: 'rgba(52,178,51,1.0)',
          width: 2,
        }),
        text: new ol_style_Text({
          text: feature.get('name'),
          overflow: true,
          scale: 1.5,
          fill: new ol_style_Fill({
            color: '#000'
          }),
      })})
    ]
  }
  private highlightStyle(feature)
  {
    return [
      new ol_style_Style({
        fill: new ol_style_Fill({
          color: 'rgba(148,150,154,1.0)'
        }),
       stroke: new ol_style_Stroke({
          color: 'rgba(52,178,51,1.0)',
          width: 5,
        }),
        text: new ol_style_Text({
          text: feature.get('name'),
          overflow: true,
          scale: 1.5,
          fill: new ol_style_Fill({
            color: '#000'
          }),
      })})
    ]
  }

  private Initialize(): void {
    this.overlay = new ol_Overlay(/** @type {olx.OverlayOptions} */({
      element: this.additionalBuildingPopupDiv.nativeElement,
      autoPan: false
    }));
    let res = OpenlayersHelper.CreateBasicLayer(this.normalStyle);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public showAdditionalBuilding() {

    this.clear();
    this.subscribeNewRequest(
      this.mapService.getAdditionalBuildings().subscribe(
        buildings => this.AdditionalBuildings(buildings),
        error => Logger.log("ERROR deleteNode: " + <any>error)));
  }

  private AdditionalBuildings(features: any) {

    this.clear();
    this.layerSource.addFeatures((new ol_format_GeoJSON()).readFeatures(features));
  }

  public highlightAdditionalBuilding(feature: any)
  {
    for (let mapFeature of this.layerSource.getFeatures())
    {
      if(feature == mapFeature)
      {
        mapFeature.setStyle(this.highlightStyle)
      }
      else{
        mapFeature.setStyle(this.normalStyle)
      }
    }
  }
  public markAdditionalBuilding(feature: any, coordinate: any)
  {
    if (feature) {
      this.urlToBuilding = location.origin + "/?buildingid=" + feature.getProperties()['campusonline']['id'];
      if(feature.getProperties()['campusonline']['name'] != feature.getProperties()['campusonline']['address'])
      {
        this.additionalBuildingContentSpan.nativeElement.innerHTML = '<b>' + feature.getProperties()['campusonline']['name'] + '</b>' + '<br />(' + feature.getProperties()['campusonline']['short'] + ')' + '<br />' + feature.getProperties()['campusonline']['address'];
      }else
      {
        this.additionalBuildingContentSpan.nativeElement.innerHTML = '<b>' + feature.getProperties()['campusonline']['name'] + '</b>' + '<br />(' + feature.getProperties()['campusonline']['short'] + ')' + '<br />';
      }
      
      this.overlay.setPosition(coordinate);
      this.mapComponent.zoomToPosition(coordinate);
    }
    else
    {
      this.closePopup();
    }
  }
  public closePopup() {
    this.currentOverlayPosition = undefined;
    this.overlay.setPosition(this.currentOverlayPosition);
    return false;
  }
  public getOverlay(): any {
    return this.overlay;
  }
  public getUrlToBuilding()
  {
    return this.urlToBuilding;
  }
}
