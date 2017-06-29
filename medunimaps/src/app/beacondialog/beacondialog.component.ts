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

  private macInputVal = new FormControl();
  private nameInputVal = new FormControl();

  constructor(public dialogRef: MdDialogRef<BeacondialogComponent>) { }

  public mac: string = "";
  public name: string = "";

  public okButtonDisabled: boolean = true;

  ngOnInit() {
    this.macInputVal.valueChanges
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
    this.mac = this.macInputVal.value;
    this.name = this.nameInputVal.value;
    this.dialogRef.close('Save')
  }

  setMacAndName(mac: string, name: string) {
    this.mac = mac;
    this.name = name;
    this.macInputVal.setValue(this.mac);
    this.nameInputVal.setValue(this.name);
  }

  updateOkButtonEnabled() {
    this.okButtonDisabled = this.macInputVal.value.length <= 0 || this.nameInputVal.value.length <= 0;
  }
}
