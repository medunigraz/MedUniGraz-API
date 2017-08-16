import { OpenlayersHelper } from './openlayershelper';
import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { MapLayerBase } from './mapLayerBase';
import { PoiType } from '../base/poitype'
import { Poi } from '../base/poi'


declare var ol: any;

export class MapPois extends MapLayerBase {

  private poitypes: PoiType[] = null;
  private currentPoiType: PoiType = null;
  private currentFloor: number = -1;

  private iconStyleMap: { [id: number]: any } = null;
  private iconMarkerMap: { [id: number]: any } = null;

  private currentSelectedPoi: any = null;
  private currentSelectedPoiMarker: any = null;

  private highlightFeaturePoint: any = null;
  private highlightFeature: any = null;
  private featureAdded: boolean = false;


  private static higlightObject: any = new ol.style.Circle({
    radius: 7,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 6 })
  });

  public static higlightStyle: any = new ol.style.Style({
    image: MapPois.higlightObject
  })


  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    this.layerSource = new ol.source.Vector({
      features: []
    });

    this.layer = new ol.layer.Vector({
      source: this.layerSource
    });
  }

  public updateData(currentFloor: number): any {
    if (this.iconStyleMap) {
      this.clear();
      this.subscribeNewRequest(
        this.mapService.getPoiInstances(currentFloor).subscribe(
          buildings => this.showPois(buildings),
          error => console.log("ERROR deleteNode: " + <any>error)));
    }
  }

  public setPoiTypes(poiTypes: PoiType[]) {
    this.poitypes = poiTypes;
    this.iconStyleMap = {};
    this.iconMarkerMap = {};

    for (let i = 0; i < poiTypes.length; i++) {
      let iconStyle = new ol.style.Style({
        text: new ol.style.Text({
          text: this.poitypes[i].fontKey,
          font: 'normal 35px meduni',
          textBaseline: 'Bottom',
          offsetY: -20,
          fill: new ol.style.Fill({
            color: 'black',
          })
        })
      });

      this.iconStyleMap[poiTypes[i].id] = iconStyle;

      let markerStyle = new ol.style.Style({
        text: new ol.style.Text({
          text: 'Q',
          font: 'normal 25px meduni',
          textBaseline: 'Bottom',
          offsetY: 0,
          fill: new ol.style.Fill({
            color: this.poitypes[i].color,
          })
        })
      });

      this.iconMarkerMap[this.poitypes[i].id] = markerStyle;
    }

    if (this.currentFloor >= 0) {
      this.updateData(this.currentFloor);
    }
  }

  public setCurrentSelectedPoiType(poiType: PoiType) {
    this.currentPoiType = poiType;
  }

  public setCurrentFloor(layer: number) {
    console.log("MapPois::setCurrentFloor");
    this.currentFloor = layer;
  }

  public mouseClicked(position: any, pixelPos: any, strgPressed: boolean, shiftPressed: boolean, map: any) {
    console.log("MapPois::mouseClicked");

    if (strgPressed && this.currentPoiType && this.currentFloor >= 0) {
      this.clearSelection();
      this.createNewPoi(position);
    }
    else if (this.currentFloor >= 0) {
      if (this.currentSelectedPoi && shiftPressed) {
        console.log("MapPois::mouseClicked Move: " + this.currentSelectedPoi.getId());
        this.moveCurrentPoi(position);
      }
      else if (this.selectPoi(pixelPos, map)) {
        if (!this.highlightFeature) {
          this.initHighlightFeatureOverlay(map);
        }
        this.highlightFeaturePoint.setCoordinates(this.currentSelectedPoi.getGeometry().getCoordinates());
        this.layerSource.addFeature(this.highlightFeature);
        this.featureAdded = true;
        console.log("MapPois::mouseClicked Select: " + this.currentSelectedPoi.getId());
      }
      else {
        this.clearSelection();
      }
    }
  }

  public deleteSelectedPoi() {
    if (!USEHTTPSERVICE) {
      console.log("Offline mode, dont delete edge!");
      return;
    }

    if (this.currentSelectedPoi) {
      this.mapService.deletePoi(this.currentSelectedPoi.getId()).subscribe(
        edge => this.poiDeleted(edge),
        error => console.log("ERROR deletePoi: " + <any>error));
    }
  }

  private poiDeleted(poi: any): void {
    console.log("poiDeleted..." + JSON.stringify(poi));
    let feature = this.layerSource.getFeatureById(poi.id);
    if (feature) {
      this.layerSource.removeFeature(feature);

      if (this.currentSelectedPoiMarker) {
        this.layerSource.removeFeature(this.currentSelectedPoiMarker);
      }

      this.clearSelection();
    }
  }

  private moveCurrentPoi(position: any) {
    console.log("MapPois::movePoi... " + JSON.stringify(position));

    if (this.currentSelectedPoi) {
      this.currentSelectedPoi.getGeometry().setCoordinates(position);
      this.highlightFeature.getGeometry().setCoordinates(position);
      this.currentSelectedPoiMarker.getGeometry().setCoordinates(position);
      this.mapService.updatePoi((new ol.format.GeoJSON()).writeFeature(this.currentSelectedPoi), this.currentSelectedPoi.getId()).
        subscribe(
        poi => this.poiUpdated(poi),
        error => console.log("ERROR: " + <any>error));
    }
  }

  private poiUpdated(poi: any) {
    console.log("Poi Updated! - " + JSON.stringify(poi));
  }


  private selectPoi(pixelPos: any, map: any): boolean {
    this.clearSelection();

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = null;

    //TODO test all features

    feature = map.forEachFeatureAtPixel(pixelPos, function(feature) {
      if (feature.get("poiId")) {
        return feature;
      }
    }, options);

    if (feature) {
      if (feature.get("poiId")) {
        this.currentSelectedPoiMarker = feature;
        this.currentSelectedPoi = this.layerSource.getFeatureById(feature.get("poiId"));

        console.log("mapPois::selectPoi: - " + feature.get("poiId") + " - " + this.currentSelectedPoi.getId());

        return true;
      }
    }

    return false;
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private createNewPoi(position: any) {
    let center = {
      "type": "Point",
      "coordinates": [position[0], position[1]]
    };

    this.mapService.addPoiInstance(this.currentFloor, center, this.currentPoiType.id).
      subscribe(
      node => this.updateAddPoi(node),
      error => console.log("ERROR: " + <any>error));
  }

  private showPois(features: any) {
    console.log("MapPois::showPois");
    this.clear();

    this.showPoisWithStyles((new ol.format.GeoJSON()).readFeatures(features));

    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private showPoisWithStyles(olFeatures: any) {
    for (let i = 0; i < olFeatures.length; i++) {

      let id = olFeatures[i].getId();
      let poiTypeId = olFeatures[i].get("name");
      console.log("MapPois::showPoisWithStyles: " + id + "#" + poiTypeId);

      let markerfeature = olFeatures[i].clone();
      markerfeature.setStyle(this.iconMarkerMap[poiTypeId]);
      markerfeature.set("poiId", id);
      this.layerSource.addFeature(markerfeature);

      olFeatures[i].setStyle(this.iconStyleMap[poiTypeId]);

    }

    this.layerSource.addFeatures(olFeatures);
  }

  private updateAddPoi(poi: any) {
    console.log("MapPois::updateAddNode! - " + JSON.stringify(poi));

    this.showPoisWithStyles((new ol.format.GeoJSON()).readFeatures(poi));

    //this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(poi));
  }

  public clearSelection() {

    if (this.featureAdded && this.highlightFeature) {
      this.layerSource.removeFeature(this.highlightFeature);
      this.featureAdded = false;
    }

    this.currentSelectedPoi = null;
    this.currentSelectedPoiMarker = null;
  }

  private initHighlightFeatureOverlay(map: any) {

    this.highlightFeaturePoint = new ol.geom.Point([0, 0]);

    this.highlightFeature = new ol.Feature({
      geometry: this.highlightFeaturePoint,
      name: 'SelectedPoi'
    });

    this.highlightFeature.setStyle(MapPois.higlightStyle);
  }

}
