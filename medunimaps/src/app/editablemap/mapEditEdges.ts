import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';
import { Point } from '../base/point'

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';

import ol_Feature from 'ol/Feature';
import ol_geom_MultiLineString from 'ol/geom/MultiLineString';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

export class MapEditEdges extends MapLayerBase {

  private multiLineFeature: any;
  private multiLineString: any;
  private lineAr: any[];

  private startPositions: Point[] = null;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol_style_Style({
      stroke: new ol_style_Stroke({
        color: 'gray',
        width: 3
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;

    this.lineAr = [];
    this.multiLineString = new ol_geom_MultiLineString(this.lineAr);

    this.multiLineFeature = new ol_Feature({
      geometry: this.multiLineString,
      name: 'Lines'
    });

    this.layerSource.addFeature(this.multiLineFeature);

    //this.setNewLine([1722194.7183594021, 5955141.12279422], [1722055.5790813519, 5955315.494764996]);

  }

  public setNewStartPos(p: number[]) {
    let point = new Point();
    point.createFromAr(p);
    this.startPositions = [point];
  }

  public setNewStartPositionsForEdgeFeatures(startnodeId: number, edges: any[]) {
    this.startPositions = [];
    for (let edge of edges) {
      let pos = edge.getGeometry().getFirstCoordinate();
      if (edge.get("source") == startnodeId) {
        pos = edge.getGeometry().getLastCoordinate();
      }

      let p = new Point();
      p.createFromAr(pos);
      this.startPositions.push(p);
    }
  }

  public setNewEndPos(p: number[]) {
    //console.log("MapEditEdges::setNewEndPos - " + p[0] + ", " + p[1]);
    if (this.startPositions != null) {
      this.lineAr = [];
      for (let pos of this.startPositions) {
        this.lineAr.push([pos.getAr(), p]);
      }
      this.multiLineString.setCoordinates(this.lineAr);
    }
  }

  public clear() {
    this.startPositions = null;
    this.lineAr = [];
    this.multiLineString.setCoordinates(this.lineAr);
  }

  public setNewLine(p1: number[], p2: number[]) {
    console.log("MapEditEdges::setNewLine - ");

    this.lineAr = [];
    this.lineAr.push([p1, p2]);
    this.multiLineString.setCoordinates(this.lineAr);
  }

  public updateEdges(edges: any[], updatedNode: any) {
    let coord = updatedNode.getGeometry().getCoordinates();

    for (let edge of edges) {
      //console.log("Update Edge: " + JSON.stringify(new ol.format.GeoJSON().writeFeature(edge)));
      let geo = edge.getGeometry().getCoordinates();
      if (edge.get("source") == updatedNode.getId()) {
        geo[0] = coord;
      }
      else {
        geo[geo.length - 1] = coord;
      }
      edge.getGeometry().setCoordinates(geo);
      this.mapService.updateEdge(new ol_format_GeoJSON().writeFeature(edge), edge.getId()).
        subscribe(
        node => this.edgeUpdated(node),
        error => console.log("ERROR: " + <any>error));
      //console.log("   New Edge: " + JSON.stringify(new ol.format.GeoJSON().writeFeature(edge)));
    }
  }

  private edgeUpdated(edge: any) {
    //Nothing todo
  }

}
