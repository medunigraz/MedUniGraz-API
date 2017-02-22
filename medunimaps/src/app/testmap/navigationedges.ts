import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

declare var ol: any;

export class NavigationMap {
  private isActive: boolean = false;

  private edgeLayer: any;
  private edgeLayerSource: any;

  private edgePathLayer: any;
  private edgePathLayerSource: any;

  select: any;

  constructor(private mapService: MapService) { }

  public Initialize(select: any): void {
    this.select = select;
    let geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': []
        }
      }]
    };

    this.edgeLayerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    this.edgePathLayerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 1
        })
      })
    };

    let styleFunctionPath = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          lineDash: [5],
          width: 3
        })
      })
    };

    this.edgeLayer = new ol.layer.Vector({
      source: this.edgeLayerSource,
      style: styleFunction
    });

    this.edgePathLayer = new ol.layer.Vector({
      source: this.edgePathLayerSource,
      style: styleFunctionPath,
      zIndex: 10
    });

    this.edgePathLayer.set('isSelectable', true);
  }

  public getEdgeLayer(): any {
    return this.edgeLayer;
  }

  public getEdgePathLayer(): any {
    return this.edgePathLayer;
  }

  public addEdge(source: number, destination: number, length: number, path: any) {

    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont add edge!");
      return;
    }

    this.mapService.addEdge(source, destination, length, path).
      subscribe(
      edge => this.updateAddEdge(edge)/*,
      error => console.log("ERROR: " + <any>error)*/);
  }

  public deleteSelectedEdge() {
    //console.log("deleteSelectedEdges..." + this.select.getFeatures().getArray().length);
    for (let feature of this.select.getFeatures().getArray()) {
      //console.log("deleteSelectedEdge: " + JSON.stringify(feature.getId()));

      if (!USEHTTPSERVICE) {
        console.log("Offline mode, dont delete edge!");
        return;
      }

      this.mapService.deleteEdge(feature.getId()).subscribe(
        edge => this.edgeDeleted(edge),
        error => console.log("ERROR deleteEdge: " + <any>error));
    }
  }

  private edgeDeleted(edge: any): void {
    console.log("edgeDeleted..." + JSON.stringify(edge));
    let feature = this.edgeLayerSource.getFeatureById(edge.id);
    if (feature) {
      this.edgeLayerSource.removeFeature(feature);
    }
    feature = this.edgePathLayerSource.getFeatureById(edge.id);
    if (feature) {
      this.edgePathLayerSource.removeFeature(feature);
    }
  }

  public updateEdges(featureArray: any[]) {
    console.log("updateEdges... ");

    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont update edge!");
      return;
    }

    for (let feature of featureArray) {
      console.log("updateEdge: " + JSON.stringify(feature.getId()));

      this.mapService.updateEdge((new ol.format.GeoJSON()).writeFeature(feature), feature.getId()).
        subscribe(
        edge => this.edgeUpdated(edge),
        error => console.log("ERROR: " + <any>error));
    }
  }

  private edgeUpdated(edge: any): void {
    console.log("edgeUpdated... " + JSON.stringify(edge));
  }

  public showEdges(edges: Object): void {
    console.log("showRoute called");

    this.edgeLayerSource.clear();
    this.edgeLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edges));

    this.edgePathLayerSource.clear();
    this.edgePathLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edges));
  }

  private updateAddEdge(edge: any) {
    console.log("updateAddEdge! - " + JSON.stringify(edge));

    this.edgeLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edge));
    this.edgePathLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edge));
  }
}
