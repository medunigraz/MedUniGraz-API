import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<RoomDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close('Closed...')
  }

  navigateTo() {
    this.dialogRef.close('Navigate...')
  }
}
