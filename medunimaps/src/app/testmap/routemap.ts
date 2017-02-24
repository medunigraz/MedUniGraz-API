declare var ol: any;

export class RouteMap {
  private isActive: boolean = false;

  private routeLayer: any;
  private routeLayerHidden: any;

  private routeLayerSource: any;
  private routeLayerSourceHidden: any;

  constructor() {
  }

  public Initialize(): void {
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

    console.log('Create Route LAYER SOURCE!!!');
    this.routeLayerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    this.routeLayerSourceHidden = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [5],
          width: 2
        })
      })
    };

    let styleFunctionHidden = function(feature) {
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: 2
        })
      })
    };

    this.routeLayer = new ol.layer.Vector({
      source: this.routeLayerSource,
      style: styleFunction
    });

    this.routeLayerHidden = new ol.layer.Vector({
      source: this.routeLayerSourceHidden,
      style: styleFunctionHidden
    });

  }

  public getRouteLayer(): any {
    return this.routeLayer;
  }

  public getHiddenRouteLayer(): any {
    return this.routeLayerHidden;
  }

  public showRoute(route: Object[]): void {
    console.log("showRoute called");

    this.routeLayerSource.clear();
    this.routeLayerSourceHidden.clear();

    for (let i = 0; i < route.length; i++) {
      if (route[i]["layer"] == 0) {
        this.routeLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(route[i]["geojson"]));
      }
      else {
        this.routeLayerSourceHidden.addFeatures((new ol.format.GeoJSON()).readFeatures(route[i]["geojson"]));
      }
    }
  }

  public hideRoute(): void {
    console.log("hideRoute called");

    this.routeLayerSource.clear();
    this.routeLayerSourceHidden.clear();
  }
}
