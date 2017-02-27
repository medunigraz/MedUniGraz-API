import { MapService } from '../mapservice/map.service';

import { OpenlayersHelper } from './openlayershelper';

declare var ol: any;

export class MapNodes {
  private layer: any;
  private layerSource: any;

  private highlightedFeature: any;
  private highlightFeatureOverlay: any = null;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let image = new ol.style.Circle({
      radius: 4,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'green', width: 2 })
    });

    let styleFunction = function(feature) {
      return new ol.style.Style({
        image: image
      })
    };

    let res = OpenlayersHelper.CreateBasicLayer(styleFunction);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public getLayer(): any {
    return this.layer;
  }

  public updateData(): any {
    this.mapService.getNavigationNodes(0).subscribe(nodes => this.showNodes(nodes));
  }

  public mouseMoved(position: any, map: any) {
    if (this.highlightFeatureOverlay === null) {
      this.initHighlightFeatureOverlay(map);
    }

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = map.forEachFeatureAtPixel(position, function(feature) {
      return feature;
    }, options);

    if (feature !== this.highlightedFeature) {
      if (this.highlightedFeature) {
        this.highlightFeatureOverlay.getSource().removeFeature(this.highlightedFeature);
      }
      if (feature) {
        //console.log('Highlight feature: ' + JSON.stringify(feature.getKeys()));
        //console.log('Highlight feature: ' + JSON.stringify(feature.get('id')));
        this.highlightFeatureOverlay.getSource().addFeature(feature);
      }
      this.highlightedFeature = feature;
    }
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private initHighlightFeatureOverlay(map: any) {
    //console.log("Create Room Featureoverlay");
    let image = new ol.style.Circle({
      radius: 6,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'red', width: 3 })
    });

    this.highlightFeatureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: map,
      style: new ol.style.Style({
        image: image
      })
    });
  }

  private showNodes(features: Object): void {
    this.layerSource.clear();
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private initSelection() {
    /*
    let selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
      });*/
  }
}
