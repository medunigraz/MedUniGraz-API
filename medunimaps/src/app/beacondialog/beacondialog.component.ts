import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject ,  Observable ,  Subscription } from 'rxjs';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { debounceTime } from 'rxjs/operators';
import { Signal } from '../base/signal';

@Component({
  selector: 'app-beacondialog',
  templateUrl: './beacondialog.component.html',
  styleUrls: ['./beacondialog.component.css']
})
export class BeacondialogComponent implements OnInit {

  public macInputVal = new UntypedFormControl();
  public nameInputVal = new UntypedFormControl();
  public batteryOutputVal = new UntypedFormControl();

  constructor(public dialogRef: MatDialogRef<BeacondialogComponent>) { }

  public mac: string = "";
  public name: string = "";

  public okButtonDisabled: boolean = true;

  public nearestSignal: Signal = undefined;

  ngOnInit() {

    let debouncedVal = this.macInputVal.valueChanges.pipe(debounceTime(400));
    debouncedVal.subscribe(term => this.updateOkButtonEnabled());

    let debouncedNameVal = this.nameInputVal.valueChanges.pipe(debounceTime(400));
    debouncedNameVal.subscribe(term => this.updateOkButtonEnabled());

    //TODO TEST!!!!!!
    /*
    this.macInputVal.valueChanges
      .debounceTime(400).subscribe(term => this.updateOkButtonEnabled());

    this.nameInputVal.valueChanges
      .debounceTime(400).subscribe(term => this.updateOkButtonEnabled());
      */
  }

  scan() {
    console.log("BeacondialogComponent::scan()");
    if (this.nearestSignal && this.nearestSignal.value > -80) {
      this.macInputVal.setValue(this.nearestSignal.mac);
      this.nameInputVal.setValue(this.nearestSignal.name);
      this.batteryOutputVal.setValue(this.nearestSignal.battery + "%");
    }
    else {
      this.macInputVal.setValue("");
      this.nameInputVal.setValue("");
    }
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

  setNearestSignal(val: Signal) {
    console.log("BeacondialogComponent::setNearestSignal() " + + JSON.stringify(val));
    this.nearestSignal = val;
  }

  updateOkButtonEnabled() {
    this.okButtonDisabled = this.nameInputVal.value.length <= 0;
  }
}
