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

    //console.log('Create Wall layer source!');
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

  public static GetDummyRoom(): any {
    return {
      "id": 278,
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              1722238.4858267833,
              5955362.8735843785
            ],
            [
              1722236.6057853107,
              5955359.292598595
            ],
            [
              1722234.3762079482,
              5955360.463367651
            ],
            [
              1722236.2565340232,
              5955364.044203989
            ],
            [
              1722238.4858267833,
              5955362.8735843785
            ]
          ]
        ]
      },
      "properties": {
        "campusonline": {
          "id": 20020,
          "category": {
            "id": 7,
            "name": "Sanitarraum"
          },
          "floor": {
            "id": 6,
            "short": "06",
            "name": "6.Obergescho?"
          },
          "building": {
            "id": 1603,
            "name": "MED CAMPUS Graz Modul 1",
            "short": "MC1.G.",
            "address": "Neue Stiftingtalstraße 6"
          },
          "title": "WC B",
          "name_short": ".006",
          "name_full": "MC1.G.06.006",
          "area": "355.0",
          "height": "382.0",
          "organization": "Medizinische Universität Graz"
        },
        "center": {
          "type": "Point",
          "coordinates": [
            1722236.4310784591,
            5955361.668476015
          ]
        },
        "origin": 17,
        "marker": {
          "type": "Point",
          "coordinates": [
            1722236.2565340232,
            5955364.044203989
          ]
        },
        "virtual": false,
        "name": null,
        "floor": 1,
        "category": null
      }
    };
  }

}
