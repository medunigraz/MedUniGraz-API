declare var ol: any;

export class OpenlayersHelper {

  constructor() {
  }

  public static CreateBasicLayer(style: any): any {
    let geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': []
    };

    console.log('Create Wall layer source!');
    let layerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let layer = new ol.layer.Vector({
      source: layerSource,
      style: style
    });

    return {
      layer: layer,
      layerSource: layerSource
    }
  }

}
