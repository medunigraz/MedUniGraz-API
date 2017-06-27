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
  private nameInputVal = new FormControl();

  constructor(public dialogRef: MdDialogRef<BeacondialogComponent>) { }

  public id: string = "";
  public name: string = "";

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

  setIdAndName(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.idInputVal.setValue(this.id);
    this.nameInputVal.setValue(this.name);
  }
}
