declare var ol: any;

export class NavigationMap
{
  private isActive: boolean = false;

  private edgeLayer: any;
  private edgeLayerSource: any;

  private edgePathLayer: any;
  private edgePathLayerSource: any;

  private selectedRoom: any = null;

  constructor()
  {
  }

  public Initialize(): void
  {
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

  public getEdgeLayer() : any
  {
    return this.edgeLayer;
  }

  public getEdgePathLayer() : any
  {
    return this.edgePathLayer;
  }

  public showEdges(edges: Object) : void
  {
    console.log("showRoute called");

    this.edgeLayerSource.clear();
    this.edgeLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edges));

    this.edgePathLayerSource.clear();
    this.edgePathLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edges));
  }
}
