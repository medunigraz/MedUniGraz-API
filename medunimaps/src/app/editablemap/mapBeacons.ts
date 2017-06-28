import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';
import { BeacondialogComponent } from '../beacondialog/beacondialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';


import { BeaconEditMode, BeaconEditModes, BeaconEditModeT } from '../base/beaconeditmode';
import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';


declare var ol: any;

export class MapBeacons extends MapLayerBase {

  private currentFloorId: number = -1;
  private lastMouseClickPosition: number[] = null;

  private editMode: BeaconEditMode = BeaconEditMode.CreateDefault();
  private dialogRef: MdDialogRef<BeacondialogComponent> = null;

  private currentSelectedBeacon: any = null;
  private highlightFeature: any = null;
  private highlightFeatureAdded: boolean = false;


  private static higlightObject: any = new ol.style.Circle({
    radius: 7,
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

    let circle: any = new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'black'
      })
      //stroke: new ol.style.Stroke({ color: 'black', width: 2 })
    });

    let style: any = new ol.style.Style({
      image: circle
    });

    let res = OpenlayersHelper.CreateBasicLayer(style);
    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public updateData(floorId: number): any {
    this.currentFloorId = floorId;
    this.clear();
    this.subscribeNewRequest(
      this.mapService.getBeacons(floorId).subscribe(beacons => this.showBeacons(beacons)));
  }

  public setBeaconEditMode(mode: BeaconEditMode) {
    console.log("MapBeacons::setBeaconEditMode: " + JSON.stringify(mode));
    this.editMode = mode;
  }

  public mouseClicked(position: any, pixelPos: any, map: any) {

    this.lastMouseClickPosition = null;

    if (this.currentFloorId >= 0) {
      if (this.editMode.mode == BeaconEditModeT.ADD) {
        console.log("MapBeacons::mouseClicked: Add new beacon" + JSON.stringify(position));
        this.lastMouseClickPosition = position;
        this.dialogRef = this.dialog.open(BeacondialogComponent);
        this.dialogRef.componentInstance.setIdAndName("", "");
        this.dialogRef.afterClosed().subscribe(res => this.beaconDialogClosed(res));
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

  private selectBeacon(pixelPos: any, map: any): boolean {
    this.clearSelection();

    let options = {
      layerFilter: (layer => this.testLayer(layer))
    }

    let feature = null;
    feature = map.forEachFeatureAtPixel(pixelPos, function(feature) {
      return feature;
    }, options);

    if (feature) {
      this.currentSelectedBeacon = feature;
      return true;
    }

    return false;
  }

  private testLayer(layer: any) {
    return this.layer === layer;
  }

  private showBeacons(features: any): void {

    this.clear();
    //console.log("showBeacons! - " + JSON.stringify(features));
    this.layerSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  private beaconDialogClosed(res: string) {
    console.log("MapBeacons::beaconDialogClosed: " + res);

    if (res && res == "Save") {
      console.log("MapBeacons::beaconDialogClosed: Save Beacon...");
      if (this.dialogRef && this.dialogRef.componentInstance) {
        let dialogComp: BeacondialogComponent = this.dialogRef.componentInstance;
        if (dialogComp.id && dialogComp.id.length > 0 && dialogComp.name && dialogComp.name.length > 0) {
          console.log("MapBeacons::beaconDialogClosed: Save Beacon: " + dialogComp.id + "/" + dialogComp.name);
          this.addOrUpdateBeacon(dialogComp.id, dialogComp.name);
        }
      }
    }
  }

  private addOrUpdateBeacon(id: string, name: string) {
    if (this.currentFloorId < 0) {
      return;
    }

    if (this.lastMouseClickPosition) {
      //console.log("mouseClickedCtrl! - POS: " + JSON.stringify(position));
      let center = {
        "type": "Point",
        "coordinates": [this.lastMouseClickPosition[0], this.lastMouseClickPosition[1]]
      };

      console.log("MapBeacons ADD: #" + id + "#" + name + "#" + this.currentFloorId + "#" + JSON.stringify(center));

      this.mapService.addBeacon(this.currentFloorId, center, id, name).
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
