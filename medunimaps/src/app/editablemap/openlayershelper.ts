import ol_layer_Vector from 'ol/layer/Vector';
import ol_source_Vector from 'ol/source/Vector';

import ol_format_GeoJSON from 'ol/format/GeoJSON';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

export class OpenlayersHelper {

  public static CurrentApplicationMode: ApplicationMode = ApplicationMode.CreateDefault();

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

    //console.log('Create layer source!');
    let layerSource = new ol_source_Vector({
      features: (new ol_format_GeoJSON()).readFeatures(geojsonObject)
    });

    let layer = new ol_layer_Vector({
      source: layerSource,
      style: style
    });

    return {
      layer: layer,
      layerSource: layerSource
    }
  }

}
