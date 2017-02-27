import { MapService } from '../mapservice/map.service';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

declare var ol: any;

export class MapNodes {
  private layer: any;
  private layerSource: any;

  private highlightedFeature: any;
  private highlightFeatureOverlay: any = null;

  select: any;
  modify: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let image = new ol.style.Circle({
      radius: 4,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'darkgreen', width: 2 })
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

  public extendMap(map: any): void {
    this.select = new ol.interaction.Select({
      wrapX: false,
      layers: (layer => this.testSelect(layer))
    });

    map.addInteraction(this.select);

    this.modify = new ol.interaction.Modify({
      features: this.select.getFeatures(),
      condition: (evt => this.testModify(evt))
    });

    map.addInteraction(this.modify);
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationNodes(0).subscribe(nodes => this.showNodes(nodes));
  }

  public mouseMoved(position: any, map: any) {
    if (this.highlightFeatureOverlay === null) {
      this.initHighlightFeatureOverlay(map);
    }

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = map.forEachFeatureAtPixel(position, function(feature) {
      return feature;
    }, options);

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

  public mouseClickedCtrl(position: any, map: any) {
    let floor = 1;
    console.log("mouseClickedCtrl! - POS: " + JSON.stringify(position));
    let center = {
      "type": "Point",
      "coordinates": [position[0], position[1]]
    };

    console.log("mouseClickedCtrl! - OBJ: " + JSON.stringify(center));

    this.mapService.addNode(floor, center).
      subscribe(
      node => this.updateAddNode(node),
      error => console.log("ERROR: " + <any>error));
  }

  private updateAddNode(node: any) {
    console.log("updateAddNode! - " + JSON.stringify(node));
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(node));
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private testSelect(layer: any) {
    return this.testLayer(layer) && OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_EDGES;
  }

  private testModify(evt: any) {
    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_EDGES) {
      let selectedFeatures = this.select.getFeatures().getArray();
      for (let feature of selectedFeatures) {
        return true;
      }
      return true;
    }
    return false;
  }

  private initHighlightFeatureOverlay(map: any) {
    this.highlightFeatureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: map,
      style: MapNodesStyles.higlightStyle
    });
  }

  private showNodes(features: Object): void {
    this.layerSource.clear();
    console.log("showNodes! - " + JSON.stringify(features));
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }
}
