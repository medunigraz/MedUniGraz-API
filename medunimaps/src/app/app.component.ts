import { Component, Optional, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import { ApplicationMode } from './base/applicationmode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lastDialogResult: string;

  currentAppMode: ApplicationMode = null;

  constructor(private _dialog: MdDialog) {
  }

  ngOnInit(): void {
    /*
    angular.module('myApp', ['ngMaterial'])
      .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('altTheme')
          .primaryPalette('purple') // specify primary color, all
        // other color intentions will be inherited
        // from default
      });*/
  }


  openDialog() {
    let dialogRef = this._dialog.open(DialogContent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
    })
  }

  sayHi(): void {
    console.info("Hi");
  }

  appModeChanged(mode: ApplicationMode): void {
    console.log("AppComponent --- appModeChanged: " + mode.name);
    this.currentAppMode = mode;
  }
}



@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a text box inside of a dialog.
        <input #dialogInput>
      </label>
    </p>
    <p> <button md-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor( @Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}
