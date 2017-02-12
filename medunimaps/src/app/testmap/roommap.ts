declare var ol: any;

export class RoomMap
{
  private isActive: boolean = false;

  private roomLayer: any;

  private roomLayerSource: any;


  private highlight: any;
  private featureOverlay: any = null;

  private selectedRoomOverlay: any = null;

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
    //console.log("showRoom called");
    //console.log("Show Room!" + JSON.stringify(rooms));

    this.roomLayerSource.clear();
    this.roomLayerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(rooms));
  }

  public mouseMoved(position: any, map: any)
  {
    if(this.featureOverlay === null)
    {
      this.initFeatureOverlay(map);
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
          //console.log('Highlight feature: ' + JSON.stringify(feature.getKeys()));
          //console.log('Highlight feature: ' + JSON.stringify(feature.get('id')));
          this.featureOverlay.getSource().addFeature(feature);
        }
        this.highlight = feature;
     }
  }

  public mouseClicked(position: any, map: any)
  {
    if(this.highlight != null)
    {
      console.log('Select Room: ' + this.highlight.get('id'));

      if(this.selectedRoomOverlay == null)
      {
        this.initSelectedRoomOverlay(map);
      }

      this.selectedRoomOverlay.getSource().clear();
      this.selectedRoomOverlay.getSource().addFeature(this.highlight);
    }
  }


  private initFeatureOverlay(map: any)
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

  private initSelectedRoomOverlay(map: any)
  {
    console.log("Create SelectedRoom Featureoverlay");
    this.selectedRoomOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0,128,255,0.8)'
          })
        })
      });
  }
}
