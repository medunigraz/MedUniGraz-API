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
    console.log("mapEdges::updateMouseClicked...")
    if (this.highlightedFeature) {
      if (!this.selectFeatureOverlay) {
        this.initSelectFeatureOverlay(map);
      }

      this.selectFeatureOverlay.getSource().clear();
      this.selectFeature = this.highlightedFeature;
      this.selectFeatureOverlay.getSource().addFeature(this.selectFeature);
      console.log("mapEdges::updateMouseClicked Select Edge: " + this.selectFeature.getId());
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

    let p1 = start.getGeometry().getCoordinates();
    let p2 = end.getGeometry().getCoordinates();
    let line = new ol.geom.LineString([p1, p2]);
    let distance = line.getLength();

    let path = {
      'type': 'LineString',
      'coordinates': [
        p1,
        p2
      ]
    }

    this.mapService.addEdge(sourceId, destinationId, distance, path).
      subscribe(
      edge => this.edgeAdded(edge),
      error => console.log("ERROR: " + <any>error));
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
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edge));
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
