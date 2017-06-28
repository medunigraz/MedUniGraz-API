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

  public okButtonDisabled: boolean = true;

  ngOnInit() {
    this.idInputVal.valueChanges
      .debounceTime(400).subscribe(term => this.updateOkButtonEnabled());

    this.nameInputVal.valueChanges
      .debounceTime(400).subscribe(term => this.updateOkButtonEnabled());
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
    this.id = this.idInputVal.value;
    this.name = this.nameInputVal.value;
    this.dialogRef.close('Save')
  }

  setIdAndName(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.idInputVal.setValue(this.id);
    this.nameInputVal.setValue(this.name);
  }

  updateOkButtonEnabled() {
    this.okButtonDisabled = this.idInputVal.value.length <= 0 || this.nameInputVal.value.length <= 0;
  }
}
