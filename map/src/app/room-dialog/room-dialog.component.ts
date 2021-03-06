import { Component, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { RoomDetail } from '../base/roomDetail';

import { Logger } from '../base/logger';

declare var appInterfaceObject: any;

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent implements OnInit {

  public currentRoom: RoomDetail = null;

  public inAppMode: boolean = false;

  constructor(public dialogRef: MatDialogRef<RoomDialogComponent>) { }

  ngOnInit() {
    this.inAppMode = appInterfaceObject.testapp();
  }

  closeDialog() {
    Logger.log("RoomDialogComponent::closeDialog - " + JSON.stringify(this.currentRoom));
    this.currentRoom = null;
    this.dialogRef.close('Closed...')
  }

  navigateTo() {
    //Logger.log("RoomDialogComponent::closeDialog - " + JSON.stringify(this.currentRoom));
    this.currentRoom = null;
    this.dialogRef.close('Navigate...')
  }
}
