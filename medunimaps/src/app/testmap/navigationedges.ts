declare var ol: any;

export class NavigationMap
{
  private isActive: boolean = false;

  private edgeLayer: any;
  private edgeLayerSource: any;

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

    let styleFunction = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 2
        })
      })
    };

    this.edgeLayer = new ol.layer.Vector({
      source: this.edgeLayerSource,
      style: styleFunction
    });
  }

  public getEdgeLayer() : any
  {
    return this.edgeLayer;
  }

  public showEdges(edges: Object) : void
  {
    console.log("showRoute called");

    this.edgeLayerSource.clear();
    this.edgeLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(edges));
  }
}
