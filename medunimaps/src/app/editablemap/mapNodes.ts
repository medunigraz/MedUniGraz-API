import { MapService } from '../mapservice/map.service';

declare var ol: any;

export class MapNodes {
  private layer: any;
  private layerSource: any;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
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

    console.log('Create Node layer source!');
    this.layerSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });

    let image = new ol.style.Circle({
        radius: 4,
        fill: null,
        stroke: new ol.style.Stroke({color: 'green', width: 2})
      });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        image: image
      })
    };

    this.layer = new ol.layer.Vector({
      source: this.layerSource,
      style: styleFunction
    });
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationNodes(0).subscribe(nodes => this.showNodes(nodes));
  }

  private showNodes(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private initSelection()
  {
    /*
    let selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
      });*/
  }
}
