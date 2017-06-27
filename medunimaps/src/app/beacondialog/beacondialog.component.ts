import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-beacondialog',
  templateUrl: './beacondialog.component.html',
  styleUrls: ['./beacondialog.component.css']
})
export class BeacondialogComponent implements OnInit {

  private idInputVal = new FormControl();

  constructor(public dialogRef: MdDialogRef<BeacondialogComponent>) { }

  ngOnInit() {
  }

  scan() {
    console.log("BeacondialogComponent::scan()");
  }

  closeDialog() {
    console.log("BeacondialogComponent::closeDialog()");
    this.dialogRef.close('Closed...')
  }

  save() {
    console.log("BeacondialogComponent::save()");
    this.dialogRef.close('Saved and Closed...')
  }

}
