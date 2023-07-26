import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE, ABOVE_LEVEL_OFFSET, BELOW_LEVEL_OFFSET } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { MapLayerBase } from './mapLayerBase';
import { MapEditEdges } from './mapEditEdges';
import { MapEdges } from './mapEdges';
import { MapRoute } from './mapRoute';
import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

import { Floor } from '../base/floor';

import ol_layer_Vector from 'ol/layer/Vector';
import ol_source_Vector from 'ol/source/Vector';
import ol_format_GeoJSON from 'ol/format/GeoJSON';

import ol_style_Style from 'ol/style/Style';
import ol_style_Fill from 'ol/style/Fill';
import ol_style_Stroke from 'ol/style/Stroke';
import ol_style_Circle from 'ol/style/Circle';

import ol_interaction_Select from 'ol/interaction/Select';
import ol_interaction_Modify from 'ol/interaction/Modify';

import { never as eventnevercondition } from 'ol/events/condition';

export class MapNodes extends MapLayerBase {
  private highlightedFeature: any;
  private highlightFeatureOverlay: any = null;

  private select: any;
  private modify: any;

  private displayEditLines: boolean = false;
  private isModifying: boolean = false;
  private lastMousePostion: number[] = [0, 0];

  private currentLevel: Floor = undefined;
  private ctrlPressed: boolean = false;
  private lastSelectedNode: any = null;

  private multiLevelMode: boolean = false;

  constructor(private mapService: MapService,
    private mapEditEdges: MapEditEdges,
    private mapEdges: MapEdges,
    private mapRoute: MapRoute) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let styleFunction = function(feature) {

      if (feature.get('ctype') == 'node') {
        return MapNodesStyles.VirtualNodeStyle;
      }
      if (feature.get('ctype') == 'point of interest instance') {
        return MapNodesStyles.PoiNodeStyle;
      }
      return MapNodesStyles.DefaultNodeStyle;
    };


    let res = OpenlayersHelper.CreateBasicLayer(styleFunction);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public extendMap(map: any): void {
    this.select = new ol_interaction_Select({
      /* wrapX: false, */
      layers: (layer => this.testSelect(layer)),
      toggleCondition: eventnevercondition
    });

    map.addInteraction(this.select);

    this.modify = new ol_interaction_Modify({
      features: this.select.getFeatures(),
      condition: (evt => this.testModify(evt))
    });

    map.addInteraction(this.modify);

    this.select.on('select', evt => this.featureSelected(evt));
    this.modify.on('modifystart', evt => this.featureModifyStart(evt));
    this.modify.on('modifyend', evt => this.featureModified(evt));
  }

  public updateData(floor: Floor, multiLevel: boolean): any {
    this.multiLevelMode = multiLevel;
    this.currentLevel = floor;
    this.clear();
    this.subscribeNewRequest(
      this.mapService.getNavigationNodes(this.currentLevel.id).subscribe(nodes => this.showNodes(nodes)));
  }

  public mouseMoved(position: any, worldposition: any, map: any) {
    this.lastMousePostion = worldposition;

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

    this.mapEdges.updateMouseMoved(position, map, this.highlightedFeature == null);

    if (this.displayEditLines || this.isModifying) {
      this.mapEditEdges.setNewEndPos(worldposition);
    }
  }

  public mouseClicked(position: any, map: any) {
    if (this.displayEditLines) {

      let selectedFeature = null;
      let selectedFeatures = this.select.getFeatures().getArray();
      if (selectedFeatures.length >= 1) {
        selectedFeature = selectedFeatures[0];
      }

      if (this.highlightedFeature) {
        //Add edge to existing Node
        this.selectNewNode(this.highlightedFeature);
        this.addNewEdge(selectedFeature, this.highlightedFeature);
      }
      else {
        this.addNewNodeOnPos(selectedFeature, position);
      }
    }
    else if (this.lastSelectedNode && this.highlightedFeature && this.ctrlPressed) {
      this.selectNewNode(this.highlightedFeature);
      this.addNewEdge(this.lastSelectedNode, this.highlightedFeature);
    }
    else if (!this.highlightedFeature) {
      this.mapEdges.updateMouseClicked(map);
    }
    else {
      this.mapEdges.clearSelection();
    }
  }

  public ctlPressed() {
    this.ctrlPressed = true;
    let selectedFeatures = this.select.getFeatures().getArray();
    if (selectedFeatures.length >= 1) {
      this.displayEditLines = true;
      let coord = selectedFeatures[0].getGeometry().getCoordinates();
      console.log("Set Startpoint: " + JSON.stringify(coord));
      this.mapEditEdges.setNewStartPos(coord);
      this.mapEditEdges.setNewEndPos(this.lastMousePostion);
    }
  }

  public ctlReleased() {
    this.ctrlPressed = false;
    console.log("ctlReleased...");
    this.displayEditLines = false;
    this.mapEditEdges.clear();
  }

  private updateAddNode(node: any, selectedStartNodeFeature: any,
    edgeToSplitId: number) {
    console.log("updateAddNode! - " + JSON.stringify(node));
    this.layerSource.addFeatures((new ol_format_GeoJSON()).readFeatures(node));
    let endNode = this.layerSource.getFeatureById(node.id);

    this.selectNewNode(endNode);

    if (selectedStartNodeFeature) {
      this.addNewEdge(selectedStartNodeFeature, endNode);

      console.log("Split Edge?");
      if (edgeToSplitId >= 0) {
        let edgeToSplit = this.mapEdges.getEdgeForId(edgeToSplitId);
        if (edgeToSplit) {
          console.log("Split Edge: " + edgeToSplit.getId());
          let node1 = this.layerSource.getFeatureById(edgeToSplit.get("source"));
          let node2 = this.layerSource.getFeatureById(edgeToSplit.get("destination"));
          this.mapEdges.deleteEdgeById(edgeToSplit.getId());
          if (node1) {
            this.addNewEdge(node1, endNode);
          }
          if (node2) {
            this.addNewEdge(node2, endNode);
          }
        }
      }

    }
  }

  private selectNewNode(node: any) {
    let selectedFeatures = this.select.getFeatures();
    selectedFeatures.clear();
    selectedFeatures.push(node);
    let coord = node.getGeometry().getCoordinates();
    this.mapEditEdges.setNewStartPos(coord);
    this.mapEditEdges.setNewEndPos(coord);
  }

  private addNewEdge(start, end) {
    //console.log("addNewEdge! - " + JSON.stringify(start.getId()) + " to " + end.getId());
    this.mapEdges.addNewEdge(start, end);
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
    this.mapEdges.removeEdgesForNode(node.id);
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
      (OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_NODES ||
        OpenlayersHelper.CurrentApplicationMode.mode == ApplicationModeT.EDIT_MULTIFLOOR_EDGES)) {
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

  private addNewNodeOnPos(selectedFeature: any, position: number[]) {

    if (!this.currentLevel || this.currentLevel.id < 0) {
      return;
    }

    //console.log("mouseClickedCtrl! - POS: " + JSON.stringify(position));
    let center = {
      "type": "Point",
      "coordinates": [position[0], position[1]]
    };

    //console.log("mouseClickedCtrl! - OBJ: " + JSON.stringify(center));

    let highlightedEdgeId = this.mapEdges.getHighlightedEdgeId();
    console.log("mouseClicked Add new node: " + JSON.stringify(center) +
      "   SplitEdgeID: " + highlightedEdgeId);
    //Add edge to new Node
    this.mapService.addNode(this.currentLevel.id, center).
      subscribe(
      node => this.updateAddNode(node, selectedFeature, highlightedEdgeId),
      error => console.log("ERROR: " + <any>error));
  }

  private initHighlightFeatureOverlay(map: any) {
    this.highlightFeatureOverlay = new ol_layer_Vector({
      source: new ol_source_Vector(),
      map: map,
      style: MapNodesStyles.higlightStyle
    });
  }

  private showNodes(features: any): void {
    this.clear();
    this.layerSource.addFeatures((new ol_format_GeoJSON()).readFeatures(features));

    if (this.multiLevelMode) {
      this.subscribeNewRequest(
        this.mapService.getNavigationNodes(this.currentLevel.floorAbove).subscribe(
          nodes => this.showNodesAbove(nodes),
          error => console.log("ERROR show Node: " + <any>error)));
    }
  }

  private showNodesAbove(features: any): void {
    let ol_features = (new ol_format_GeoJSON()).readFeatures(features);
    for (let i = 0; i < ol_features.length; i++) {
      ol_features[i].getGeometry().translate(ABOVE_LEVEL_OFFSET, 0);
    }
    this.layerSource.addFeatures(ol_features);

    this.subscribeNewRequest(
      this.mapService.getNavigationNodes(this.currentLevel.floorBelow).subscribe(
        rooms => this.showNodesBelow(rooms),
        error => console.log("ERROR show Node: " + <any>error)));
  }

  private showNodesBelow(features: any): void {
    let ol_features = (new ol_format_GeoJSON()).readFeatures(features);
    for (let i = 0; i < ol_features.length; i++) {
      //let coord = ol_features[i].getGeometry().getCoordinates();
      //ol.coordinate.add(coord, 10, 0);
      ol_features[i].getGeometry().translate(BELOW_LEVEL_OFFSET, 0);
    }
    this.layerSource.addFeatures(ol_features);
  }

  private featureSelected(evt: any) {
    let features = evt.selected;
    if (features.length > 0) {
      console.log("Feature selected => " + features[0].getId());
      this.lastSelectedNode = features[0];
      if (this.mapRoute.doShowRoute()) {
        this.mapRoute.generateRoute(features[0].getId());
      }
      this.mapRoute.setNewStartPos(features[0].getId());
    }
  }

  private featureModified(evt) {
    console.log("MapNodes::featureModifyEnd...");
    this.isModifying = false;
    this.mapEditEdges.clear();
    let features = evt.features.getArray();
    for (let feature of features) {
      console.log("Feature " + feature.getId() + " modified!");
      this.mapService.updateNode((new ol_format_GeoJSON()).writeFeature(feature), feature.getId()).
        subscribe(
        node => this.nodeUpdated(node),
        error => console.log("ERROR: " + <any>error));

      let edges = this.mapEdges.getEdgesForNode(feature.getId());
      this.mapEditEdges.updateEdges(edges, feature);
    }
  }

  private featureModifyStart(evt) {
    console.log("MapNodes::featureModifyStart...");
    let selFeatures = this.select.getFeatures().getArray();
    console.log("Feature selected: " + selFeatures.length);
    if (selFeatures.length >= 1) {

      let edges = this.mapEdges.getEdgesForNode(selFeatures[0].getId());
      console.log("Feature selected: " + selFeatures[0].getId() + "  Edges: " + edges.length);
      this.mapEditEdges.setNewStartPositionsForEdgeFeatures(selFeatures[0].getId(), edges);
    }

    this.isModifying = true;
  }

  private nodeUpdated(node: any) {
    console.log("node Updated! - " + JSON.stringify(node));
  }

  public clearSelection() {
    let selectedFeatures = this.select.getFeatures();
    selectedFeatures.clear();
    this.displayEditLines = false;
    this.isModifying = false;
  }
}
