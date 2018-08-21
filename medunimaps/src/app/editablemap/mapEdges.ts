import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE, ABOVE_LEVEL_OFFSET, BELOW_LEVEL_OFFSET } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';
import { EdgeWeight } from '../base/edgeweight';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';
import { MapEdgeStyles } from './mapEdgeStyles';

import { Floor } from '../base/floor';

import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

import ol_geom_LineString from 'ol/geom/LineString';

import ol_layer_Vector from 'ol/layer/Vector';
import ol_source_Vector from 'ol/source/Vector';


export class MapEdges extends MapLayerBase {
  private highlightedFeature: any = null;
  private highlightFeatureOverlay: any = null;

  private selectFeature: any = null;
  private selectFeatureOverlay: any = null;

  private isWeightMode: boolean = false;
  private currentEdgeWeight: EdgeWeight = null;

  private currentLevel: Floor = undefined;
  private multiLevelMode: boolean = false;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let styleFunction = function(feature) {
      let style = MapEdgeStyles.GetStyle(feature.get("category"));
      return style;
    };

    let res = OpenlayersHelper.CreateBasicLayer(feature => styleFunction(feature));
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floor: Floor, multiLevel: boolean): any {
    this.clear();

    this.currentLevel = floor;
    this.multiLevelMode = multiLevel;

    this.subscribeNewRequest(
      this.mapService.getNavigationEdges(floor.id).subscribe(
        edges => this.showEdges(edges),
        error => console.log("ERROR deleteNode: " + <any>error)));
  }

  public setWeightMode(weightmode: boolean) {
    console.log("MapEdges::setWeightmode -> " + weightmode);
    this.isWeightMode = weightmode;
  }

  public setCurrentEdgeWeight(edgeWeight: EdgeWeight) {
    console.log("MapEdges::setCurrentEdgeWeight -> " + JSON.stringify(edgeWeight));
    this.currentEdgeWeight = edgeWeight;
  }

  public setEdgeWeights(edgeWeights: EdgeWeight[]) {
    MapEdgeStyles.InitStyles(edgeWeights);
    this.layerSource.refresh();
    console.log("MapEdges::setEdgeWeights -> " + JSON.stringify(edgeWeights));
  }


  public getHighlightedEdgeId(): any {
    if (this.highlightedFeature) {
      return this.highlightedFeature.getId();
    }
    return -1;
  }

  public getEdgeForId(id: number): any {
    return this.layerSource.getFeatureById(id);
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
    //console.log("mapEdges::updateMouseClicked...")
    if (this.highlightedFeature) {

      if (this.isWeightMode) {
        let id = this.highlightedFeature.getId();
        let weight = this.highlightedFeature.get("category");

        if (this.currentEdgeWeight) {
          if (this.currentEdgeWeight.id != weight) {
            console.log("mapEdges::updateMouseClicked - Change edge " + id + " to weight: " + this.currentEdgeWeight.id + "/" + this.currentEdgeWeight.name);
            this.highlightedFeature.set("category", this.currentEdgeWeight.id);
            //TODO SEND UPDATE

            let clonedFeature = this.highlightedFeature.clone();
            clonedFeature.setId(this.highlightedFeature.getId());


            let line = this.getEdgeLine((new ol_format_GeoJSON().readFeature(clonedFeature.get('source_node'))),
              (new ol_format_GeoJSON().readFeature(clonedFeature.get('destination_node'))));
            clonedFeature.setGeometry(line);

            this.mapService.updateEdge(new ol_format_GeoJSON().writeFeature(clonedFeature), this.highlightedFeature.getId()).
              subscribe(
              edge => this.edgeUpdated(edge),
              error => console.log("ERROR: " + <any>error));

          }
        }

      }
      else {
        if (!this.selectFeatureOverlay) {
          this.initSelectFeatureOverlay(map);
        }

        this.selectFeatureOverlay.getSource().clear();
        this.selectFeature = this.highlightedFeature;
        this.selectFeatureOverlay.getSource().addFeature(this.selectFeature);
        console.log("mapEdges::updateMouseClicked Select Edge: " + this.selectFeature.getId());
      }
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

  public deleteSelectedEdges() {
    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont delete edge!");
      return;
    }

    if (this.selectFeature)
      this.mapService.deleteEdge(this.selectFeature.getId()).subscribe(
        edge => this.edgeDeleted(edge),
        error => console.log("ERROR deleteNode: " + <any>error));
  }

  public deleteEdgeById(id: number) {
    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont delete edge!");
      return;
    }

    this.mapService.deleteEdge(id).subscribe(
      edge => this.edgeDeleted(edge),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  public addNewEdge(start, end) {
    console.log("addNewEdge! - " + JSON.stringify(start.getId()) + " to " + end.getId());

    if (!start || !end) {
      return;
    }

    let sourceId = start.getId();
    let destinationId = end.getId();
    if (sourceId == destinationId) {
      return;
    }

    /*
        let p1 = start.getGeometry().getCoordinates();
        let p2 = end.getGeometry().getCoordinates();

        if (this.multiLevelMode && start.get('level') == this.currentLevel.floorAbove) {
          p1[0] = p1[0] - ABOVE_LEVEL_OFFSET;
        }
        else if (this.multiLevelMode && start.get('level') == this.currentLevel.floorBelow) {
          p1[0] = p1[0] - BELOW_LEVEL_OFFSET;
        }

        if (this.multiLevelMode && end.get('level') == this.currentLevel.floorAbove) {
          p2[0] = p2[0] - ABOVE_LEVEL_OFFSET;
        }
        else if (this.multiLevelMode && end.get('level') == this.currentLevel.floorBelow) {
          p2[0] = p2[0] - BELOW_LEVEL_OFFSET;
        }

        let line = new ol.geom.LineString([p1, p2]);*/
    let line = this.getEdgeLine(start, end);
    let distance = line.getLength();

    let path = {
      'type': 'LineString',
      'coordinates': [
        //p1,
        //p2
        line.getFirstCoordinate(),
        line.getLastCoordinate()
      ]
    }

    this.mapService.addEdge(sourceId, destinationId, distance, path).
      subscribe(
      edge => this.edgeAdded(edge),
      error => console.log("ERROR: " + <any>error));
  }

  public getEdgeLine(startNode: any, endNode: any) {
    let p1 = startNode.getGeometry().getCoordinates();
    let p2 = endNode.getGeometry().getCoordinates();

    if (this.multiLevelMode && startNode.get('level') == this.currentLevel.floorAbove) {
      p1[0] = p1[0] - ABOVE_LEVEL_OFFSET;
    }
    else if (this.multiLevelMode && startNode.get('level') == this.currentLevel.floorBelow) {
      p1[0] = p1[0] - BELOW_LEVEL_OFFSET;
    }

    if (this.multiLevelMode && endNode.get('level') == this.currentLevel.floorAbove) {
      p2[0] = p2[0] - ABOVE_LEVEL_OFFSET;
    }
    else if (this.multiLevelMode && endNode.get('level') == this.currentLevel.floorBelow) {
      p2[0] = p2[0] - BELOW_LEVEL_OFFSET;
    }

    return new ol_geom_LineString([p1, p2]);
  }

  public getEdgesForNode(nodeId: number): any[] {
    return this.layerSource.getFeatures().filter(
      feature => feature.get("source") == nodeId || feature.get("destination") == nodeId
    )
  }

  public removeEdgesForNode(nodeId: number) {
    console.log("MapEdges::removeEdgesForNode - " + nodeId);
    let edges = this.getEdgesForNode(nodeId);
    for (let edge of edges) {
      this.layerSource.removeFeature(edge);
    }
  }

  private edgeDeleted(edge: any): void {
    let feature = this.layerSource.getFeatureById(edge.id);
    if (feature) {
      this.layerSource.removeFeature(feature);
      this.clearSelection();
    }
  }

  private edgeAdded(edge: any): void {
    let ol_edge = (new ol_format_GeoJSON()).readFeature(edge);
    ol_edge = this.getUpdatedMultiLayerEdge(ol_edge);
    this.layerSource.addFeature(ol_edge);
  }

  private initHighlightFeatureOverlay(map: any) {
    this.highlightFeatureOverlay = new ol_layer_Vector({
      source: new ol_source_Vector(),
      map: map,
      style: new ol_style_Style({
        stroke: new ol_style_Stroke({
          color: 'red',
          width: 4
        })
      })
    });
  }

  private initSelectFeatureOverlay(map: any) {
    console.log("mapEdges::initSelectFeatureOverlay...")
    this.selectFeatureOverlay = new ol_layer_Vector({
      source: new ol_source_Vector(),
      map: map,
      style: new ol_style_Style({
        stroke: new ol_style_Stroke({
          color: 'rgba(0,190,255,0.8)',
          width: 6
        })
      })
    });
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private showEdges(features: any): void {
    console.log("MapEdges::showEdges");
    this.clear();

    //TODO Add LAYER OFFSET
    let ol_features = (new ol_format_GeoJSON()).readFeatures(features);

    for (let i = 0; i < ol_features.length; i++) {
      ol_features[i] = this.getUpdatedMultiLayerEdge(ol_features[i]);
    }

    this.layerSource.addFeatures(ol_features);
  }

  private edgeUpdated(edge: any) {
    //Nothing todo
    console.log("mapEdges::edgeUpdated!!!");
  }

  private getUpdatedMultiLayerEdge(edgeFeature: any) {


    let coords = edgeFeature.getGeometry().getCoordinates();
    let sourceLevel = edgeFeature.get("source_node").properties.level;
    let destinationLevel = edgeFeature.get("destination_node").properties.level;

    //console.log("MapEdges::showEdges oldcoords" + JSON.stringify(coords));

    if (sourceLevel == this.currentLevel.floorAbove) {
      coords[0][0] = coords[0][0] + ABOVE_LEVEL_OFFSET;
    }
    if (sourceLevel == this.currentLevel.floorBelow) {
      coords[0][0] = coords[0][0] + BELOW_LEVEL_OFFSET;
    }

    if (destinationLevel == this.currentLevel.floorAbove) {
      coords[1][0] = coords[1][0] + ABOVE_LEVEL_OFFSET;
    }
    if (destinationLevel == this.currentLevel.floorBelow) {
      coords[1][0] = coords[1][0] + BELOW_LEVEL_OFFSET;
    }

    //console.log("MapEdges::showEdges newcoords " + JSON.stringify(coords));

    edgeFeature.getGeometry().setCoordinates(coords);

    return edgeFeature;
  }

}
