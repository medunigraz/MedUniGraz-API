import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

declare var ol: any;

export class MapEdges {
  private layer: any;
  private layerSource: any;

  private highlightedFeature: any = null;
  private highlightFeatureOverlay: any = null;

  private selectFeature: any = null;
  private selectFeatureOverlay: any = null;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationEdges(0).subscribe(edges => this.showEdges(edges));
  }

  public updateMouseMoved(position: any, map: any, allowHighlight: boolean) {
    if (this.highlightFeatureOverlay === null) {
      this.initHighlightFeatureOverlay(map);
    }

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = null;

    if (allowHighlight) {
      feature = map.forEachFeatureAtPixel(position, function(feature) {
        return feature;
      }, options);
    }

    if (feature !== this.highlightedFeature) {
      if (this.highlightedFeature) {
        this.highlightFeatureOverlay.getSource().removeFeature(this.highlightedFeature);
      }
      if (feature) {
        //console.log('Highlight feature: ' + JSON.stringify(feature.getKeys()));
        //console.log('Highlight feature: ' + JSON.stringify(feature.get('id')));
        this.highlightFeatureOverlay.getSource().addFeature(feature);
      }
      this.highlightedFeature = feature;
    }
  }

  public updateMouseClicked(map: any) {
    console.log("mapEdges::updateMouseClicked...")
    if (this.highlightedFeature) {
      if (!this.selectFeatureOverlay) {
        this.initSelectFeatureOverlay(map);
      }

      console.log("mapEdges::updateMouseClicked add new Feature!");
      this.selectFeatureOverlay.getSource().clear();
      this.selectFeature = this.highlightedFeature;
      this.selectFeatureOverlay.getSource().addFeature(this.selectFeature);
    }
    else {
      this.clearSelection();
    }
  }

  public clearSelection() {
    if (this.selectFeatureOverlay) {
      console.log("mapEdges::clearSelection...")
      this.selectFeatureOverlay.getSource().clear();
    }
  }

  private initHighlightFeatureOverlay(map: any) {
    this.highlightFeatureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: map,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 4
        })
      })
    });
  }

  private initSelectFeatureOverlay(map: any) {
    console.log("mapEdges::initSelectFeatureOverlay...")
    this.selectFeatureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: map,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0,190,255,0.8)',
          width: 6
        })
      })
    });
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private showEdges(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

}
