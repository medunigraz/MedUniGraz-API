import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { RoomDetail } from '../base/roomDetail';

import { Logger } from '../base/logger';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent implements OnInit {

  public currentRoom: RoomDetail = null;

  constructor(public dialogRef: MdDialogRef<RoomDialogComponent>) { }

  ngOnInit() {
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
