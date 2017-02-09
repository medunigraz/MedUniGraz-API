declare var ol: any;

export class RoomMap
{
  private isActive: boolean = false;

  private roomLayer: any;

  private roomLayerSource: any;

  private highlight: any;

  private featureOverlay: any = null;

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

    geojsonObject = {
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
          'type': 'Polygon',
          'coordinates': [[
            [1722183.8736183767, 5955368.127460353],
            [1722202.0871290227, 5955358.871413959],
            [1722195.2197397628, 5955345.435217581]
          ]]
        }
      }]
    };

    console.log('Create Room LAYER SOURCE!!!');
    this.roomLayerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    var styleFunction = function(feature) {
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(128,0,255,0.5)'
        })
      })
    };

    this.roomLayer = new ol.layer.Vector({
      source: this.roomLayerSource,
      style: styleFunction
    });


  }

  public getRoomLayer() : any
  {
    return this.roomLayer;
  }

  public showRooms(rooms: Object) : void
  {
    console.log("showRoom called");
    console.log("Show Room!" + JSON.stringify(rooms));

    this.roomLayerSource.clear();
    this.roomLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(rooms));
  }

  public mouseMoved(position: any, map: any)
  {
    if(this.featureOverlay === null)
    {
      console.log("Create Room Featureoverlay");
      this.featureOverlay = new ol.layer.Vector({
          source: new ol.source.Vector(),
          map: map,
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#f00',
              width: 1
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255,0,0,0.8)'
            })
          })
        });
    }

    let feature = map.forEachFeatureAtPixel(position, function(feature) {
       return feature;
     });

     if (feature !== this.highlight)
     {
       if (this.highlight) {
          this.featureOverlay.getSource().removeFeature(this.highlight);
        }
        if (feature) {
          this.featureOverlay.getSource().addFeature(feature);
        }
        this.highlight = feature;
     }
  }
}
