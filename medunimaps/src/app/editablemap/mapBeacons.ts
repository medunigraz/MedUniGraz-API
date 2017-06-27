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

  private editMode: BeaconEditMode = BeaconEditMode.CreateDefault();

  constructor(private dialog: MdDialog, private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let circle: any = new ol.style.Circle({
      radius: 5,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'black', width: 2 })
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
    //this.subscribeNewRequest(
    //  this.mapService.getNavigationNodes(floorId).subscribe(nodes => this.showNodes(nodes)));
  }

  public setBeaconEditMode(mode: BeaconEditMode) {
    console.log("MapBeacons::setBeaconEditMode: " + JSON.stringify(mode));
    this.editMode = mode;
  }

  public mouseClicked(position: any, map: any) {

    if (this.editMode.mode == BeaconEditModeT.ADD) {
      console.log("MapBeacons::mouseClicked: Add new beacon" + JSON.stringify(position));
      let dialogRef: MdDialogRef<BeacondialogComponent>;
      dialogRef = this.dialog.open(BeacondialogComponent);
      //dialogRef.componentInstance.currentRoom = room;
      //dialogRef.afterClosed().subscribe(res => this.roomDialogClosed(res));
    }
    /*
        if (this.displayEditLines) {

          let selectedFeature = null;
          let selectedFeatures = this.select.getFeatures().getArray();
          if (selectedFeatures.length >= 1) {
            selectedFeature = selectedFeatures[0];
          }

          if (this.highlightedFeature) {
            //Add edge to existing Node
            this.selectNewNode(this.highlightedFeature);
            this.addNewEdge(selectedFeature, this.highlightedFeature);
          }
          else {
            this.addNewNodeOnPos(selectedFeature, position);
          }
        }
        else if (this.lastSelectedNode && this.highlightedFeature && this.ctrlPressed) {
          this.selectNewNode(this.highlightedFeature);
          this.addNewEdge(this.lastSelectedNode, this.highlightedFeature);
        }
        else if (!this.highlightedFeature) {
          this.mapEdges.updateMouseClicked(map);
        }
        else {
          this.mapEdges.clearSelection();
        }*/
  }

}
