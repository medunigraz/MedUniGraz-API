import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { MapEditEdges } from './mapeditedges';
import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

declare var ol: any;

export class MapNodes {
  private layer: any;
  private layerSource: any;

  private highlightedFeature: any;
  private highlightFeatureOverlay: any = null;

  private select: any;
  private modify: any;

  private displayEditLines: boolean = false;

  constructor(private mapService: MapService,
    private mapEditEdges: MapEditEdges) {
    this.Initialize();
  }

  private Initialize(): void {
    let styleFunction = function(feature) {
      if (feature.get('ctype') == 'node') {
        return MapNodesStyles.VirtualNodeStyle;
      }
      return MapNodesStyles.DefaultNodeStyle;
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

    this.modify.on('modifyend', evt => this.featureModified(evt));
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationNodes(0).subscribe(nodes => this.showNodes(nodes));
  }

  public mouseMoved(position: any, worldposition: any, map: any) {
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

    if (this.select.getFeatures().getArray().length <= 0 && this.displayEditLines) {
      this.ctlReleased();
    }

    if (this.displayEditLines) {
      this.mapEditEdges.setNewEndPos(worldposition);
    }
  }

  public mouseClicked(position: any, map: any) {
    if (this.mapEditEdges) {
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
  }

  public ctlPressed() {
    let selectedFeatures = this.select.getFeatures().getArray();
    if (selectedFeatures.length >= 1) {
      this.displayEditLines = true;
      let coord = selectedFeatures[0].getGeometry().getCoordinates();
      console.log("Set Startpoint: " + JSON.stringify(coord));
      this.mapEditEdges.setNewStartPos(coord);
    }
  }

  public ctlReleased() {
    this.displayEditLines = false;
    this.mapEditEdges.clear();
  }

  private updateAddNode(node: any) {
    console.log("updateAddNode! - " + JSON.stringify(node));
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(node));
  }

  public deleteSelectedNodes() {
    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont delete edge!");
      return;
    }

    for (let feature of this.select.getFeatures().getArray()) {
      if (feature.get('ctype') == 'node') {
        this.mapService.deleteNode(feature.getId()).subscribe(
          edge => this.nodeDeleted(edge),
          error => console.log("ERROR deleteNode: " + <any>error));
      }
      else {
        console.log("Not allowed to delete feature of type: " + feature.get('ctype'));
      }
    }
  }

  private nodeDeleted(node: any): void {
    console.log("edgeDeleted..." + JSON.stringify(node));
    let feature = this.layerSource.getFeatureById(node.id);
    if (feature) {
      this.layerSource.removeFeature(feature);
      let selected_collection = this.select.getFeatures();
      selected_collection.clear();
    }
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private testSelect(layer: any) {
    if (this.testLayer(layer) &&
      (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES)) {
      let selectedFeatures = this.select.getFeatures();
      if (selectedFeatures.getArray().length > 0) {
        selectedFeatures.clear();
      }
      return true;
    }
    return false;
  }

  private testModify(evt: any) {
    if (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES) {
      let selectedFeatures = this.select.getFeatures().getArray();
      if (selectedFeatures.length > 0 && selectedFeatures[0].get('ctype') == 'node') {
        return true;
      }
      return false;
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

  private featureModified(evt) {
    let features = evt.features.getArray();
    for (let feature of features) {
      console.log("Feature " + feature.getId() + " modified!");
      this.mapService.updateNode((new ol.format.GeoJSON()).writeFeature(feature), feature.getId()).
        subscribe(
        node => this.nodeUpdated(node),
        error => console.log("ERROR: " + <any>error));;
    }
  }

  private nodeUpdated(node: any) {
    console.log("node Updated! - " + JSON.stringify(node));
  }
}
