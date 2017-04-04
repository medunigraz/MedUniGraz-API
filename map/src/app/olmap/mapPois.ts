import { OpenlayersHelper } from './openlayershelper';


declare var ol: any;

export class MapPois {
  private layer: any;
  private layerSource: any;


  constructor() {
    this.Initialize();
  }

  private Initialize(): void {

    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([15.470230579376215, 47.0812626175388])),
      name: 'Test Point',
      description: 'dummy description'
    });


    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/beergarden.png'
      }))
    });
    iconFeature.setStyle(iconStyle);

    this.layerSource = new ol.source.Vector({
      features: [iconFeature]
    });

    this.layer = new ol.layer.Vector({
      source: this.layerSource
    });
  }

  public getLayer(): any {
    return this.layer;
  }


}
