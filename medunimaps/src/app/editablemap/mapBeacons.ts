import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';
import { BeacondialogComponent } from '../beacondialog/beacondialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import { Signal } from '../base/signal';

import { BeaconEditMode, BeaconEditModes, BeaconEditModeT } from '../base/beaconeditmode';
import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapBeaconStyles } from './mapbeaconstyles';

declare var ol: any;

export class MapBeacons extends MapLayerBase {

  private currentFloorId: number = -1;
  private lastMouseClickPosition: number[] = null;

  private editMode: BeaconEditMode = BeaconEditMode.CreateDefault();
  private dialogRef: MdDialogRef<BeacondialogComponent> = null;

  private currentSelectedBeacon: any = null;
  private highlightFeaturePoint: any = null;
  private highlightFeature: any = null;
  private highlightFeatureAdded: boolean = false;

  private beaconFeatures: Array<any> = [];

  private static higlightObject: any = new ol.style.Circle({
    radius: 8,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 6 })
  });

  public static higlightStyle: any = new ol.style.Style({
    image: MapBeacons.higlightObject
  })

  constructor(private dialog: MdDialog, private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let styleFunction = function(feature) {
      //let source = feature.get("source_node").properties.level;


      let style = MapBeaconStyles.GetStyle(feature.get("signal"));
      console.log("MapBeacons::styleFunction   " + feature.get("signal") + "###" + JSON.stringify(style));
      return style;
    };

    let res = OpenlayersHelper.CreateBasicLayer(feature => styleFunction(feature));
    this.layerSource = res.layerSource;
    this.layer = res.layer;

    MapBeaconStyles.InitStyles();
  }

  public updateData(floorId: number): any {
    this.currentFloorId = floorId;
    this.clear();
    this.subscribeNewRequest(
      this.mapService.getBeacons(floorId).subscribe(beacons => this.showBeacons(beacons)));
  }

  public setBeaconEditMode(mode: BeaconEditMode) {
    console.log("MapBeacons::setBeaconEditMode: " + JSON.stringify(mode));
    this.clearSelection();
    this.editMode = mode;
  }

  public setBeaconSignals(signals: Signal[]) {

    let hSignal: Signal = undefined;
    if (signals.length > 0) {
      hSignal = signals[0];
    }
    for (let i = 1; i < signals.length; i++) {
      if (signals[i].value > hSignal.value) {
        hSignal = signals[i];
      }
    }
    if (this.dialogRef && this.dialogRef.componentInstance) {
      this.dialogRef.componentInstance.setNearestSignal(hSignal);
    }

    for (let i = 0; i < this.beaconFeatures.length; i++) {
      this.beaconFeatures[i].setProperties({ signal: undefined });
      for (let j = 0; j < signals.length; j++) {
        if (this.beaconFeatures[i].get("mac") == signals[j].id) {
          this.beaconFeatures[i].setProperties({ signal: signals[j].value });
        }
      }
    }
  }


  public mouseClicked(position: any, pixelPos: any, map: any) {

    this.lastMouseClickPosition = null;

    if (this.currentFloorId >= 0) {

      //   this.clearSelection();

      if (this.editMode.mode == BeaconEditModeT.ADD) {
        this.CreateNewBeacon(position);
      }
      else {

        let isSelected = this.selectBeacon(pixelPos, map, true);

        if (isSelected) {
          isSelected = this.selectBeacon(pixelPos, map, false);
          if (isSelected) {
            if (!this.highlightFeature) {
              this.initHighlightFeatureOverlay(map);
            }
            this.highlightFeaturePoint.setCoordinates(this.currentSelectedBeacon.getGeometry().getCoordinates());
            this.layerSource.addFeature(this.highlightFeature);
            this.highlightFeatureAdded = true;
            this.showSelectedBeaconInfo();
          }
        }
        else if (this.editMode.mode == BeaconEditModeT.MOVE && this.currentSelectedBeacon) {
          this.moveCurrentBeacon(position);
        }
        else {
          this.clearSelection();
        }
      }

    }
  }

  public clearSelection() {

    if (this.highlightFeature && this.highlightFeatureAdded) {
      this.layerSource.removeFeature(this.highlightFeature);
      this.highlightFeatureAdded = false;
    }

    this.currentSelectedBeacon = null;
  }

  private selectBeacon(pixelPos: any, map: any, testOnly: boolean): boolean {

    //console.log("MapBeacons::selectBeacon!" + JSON.stringify(pixelPos));

    if (!testOnly) {
      this.clearSelection();
    }

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = null;
    feature = map.forEachFeatureAtPixel(pixelPos, function(feature) {
      return feature;
    }, options);

    if (feature) {
      console.log("MapBeacons::selectBeacon Beacon selected! ");
      if (!testOnly) {
        this.currentSelectedBeacon = feature;
      }
      return true;
    }

    return false;
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private showSelectedBeaconInfo() {
    console.log("MapBeacons::showSelectedBeaconInfo!");
  }

  private moveCurrentBeacon(position: any) {
    console.log("MapBeacons::moveCurrentBeacon... " + JSON.stringify(position));

    if (this.currentSelectedBeacon) {
      this.currentSelectedBeacon.getGeometry().setCoordinates(position);
      this.highlightFeature.getGeometry().setCoordinates(position);
      /*
      this.mapService.updateBeacon((new ol.format.GeoJSON()).writeFeature(this.currentSelectedBeacon), this.currentSelectedBeacon.getId()).
        subscribe(
        poi => this.beaconUpdated(poi),
        error => console.log("ERROR: " + <any>error));*/
    }
  }

  private initHighlightFeatureOverlay(map: any) {

    this.highlightFeaturePoint = new ol.geom.Point([0, 0]);

    this.highlightFeature = new ol.Feature({
      geometry: this.highlightFeaturePoint,
      name: 'SelectedPoi'
    });

    this.highlightFeature.setStyle(MapBeacons.higlightStyle);
  }

  private beaconUpdated(beacon: any) {
    console.log("MapBeacons::beaconUpdated Beacon Updated! - " + JSON.stringify(beacon));
  }

  private showBeacons(features: any): void {

    this.clearSelection();
    this.clear();
    //console.log("showBeacons! - " + JSON.stringify(features));

    let dummy: Object =
      {
        "type": "FeatureCollection", "features":
        [{ "id": 1, "type": "Feature", "geometry": { "type": "Point", "coordinates": [1722109.0870171075, 5955257.0827844525] }, "properties": { "mac": "00-00-00-00-00-01", "name": "N1", "deployed": "2017-06-29T10:18:46.040277Z", "seen": "2017-06-29T10:18:46.040319Z", "active": false, "charge": "0.00", "level": 2 } },
          { "id": 2, "type": "Feature", "geometry": { "type": "Point", "coordinates": [1722094.6153389667, 5955238.592188362] }, "properties": { "mac": "00-00-00-00-00-02", "name": "namexyz", "deployed": "2017-06-29T10:22:07.677524Z", "seen": "2017-06-29T10:22:07.677560Z", "active": false, "charge": "0.00", "level": 2 } }]
      };

    this.beaconFeatures = (new ol.format.GeoJSON()).readFeatures(dummy);

    //this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
    this.layerSource.addFeatures(this.beaconFeatures);
  }


  private beaconDialogClosed(res: string) {
    console.log("MapBeacons::beaconDialogClosed: " + res);

    if (res && res == "Save") {
      console.log("MapBeacons::beaconDialogClosed: Save Beacon...");
      if (this.dialogRef && this.dialogRef.componentInstance) {
        let dialogComp: BeacondialogComponent = this.dialogRef.componentInstance;
        if (dialogComp.mac && dialogComp.mac.length > 0 && dialogComp.name && dialogComp.name.length > 0) {
          console.log("MapBeacons::beaconDialogClosed: Save Beacon: " + dialogComp.mac + "/" + dialogComp.name);
          this.addOrUpdateBeacon(dialogComp.mac, dialogComp.name);
        }
      }
    }
  }

  private CreateNewBeacon(position: any) {
    console.log("MapBeacons::CreateNewBeacon: Add new beacon" + JSON.stringify(position));
    this.lastMouseClickPosition = position;
    this.dialogRef = this.dialog.open(BeacondialogComponent);
    this.dialogRef.componentInstance.setMacAndName("", "");
    this.dialogRef.afterClosed().subscribe(res => this.beaconDialogClosed(res));
  }

  private addOrUpdateBeacon(mac: string, name: string) {
    if (this.currentFloorId < 0) {
      return;
    }

    if (this.lastMouseClickPosition) {
      //console.log("mouseClickedCtrl! - POS: " + JSON.stringify(position));
      let center = {
        "type": "Point",
        "coordinates": [this.lastMouseClickPosition[0], this.lastMouseClickPosition[1]]
      };

      console.log("MapBeacons ADD: #" + mac + "#" + name + "#" + this.currentFloorId + "#" + JSON.stringify(center));

      this.mapService.addBeacon(this.currentFloorId, center, mac, name).
        subscribe(
        beacon => this.updateAddBeacon(beacon),
        error => console.log("ERROR: " + <any>error));
    }
  }

  private updateAddBeacon(beacon: any) {
    console.log("updateAddBeacon! - " + JSON.stringify(beacon));
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(beacon));
  }


}
