import { Component, Optional, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import { ApplicationMode, ApplicationModeT } from './base/applicationmode';
import { Floor } from './base/floor';
import { PoiType } from './base/poitype';
import { BeaconEditMode, BeaconEditModes } from './base/beaconeditmode';
import {Signal} from './base/signal';

import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  lastDialogResult: string;

  currentAppMode: ApplicationMode = ApplicationMode.CreateDefault();
  currentFloor: Floor = Floor.getDefaultFloor();
  currentPoiType: PoiType = null;
  poiTypes: PoiType[] = null;
  beaconEditMode: BeaconEditMode = null;
  beaconSignals: Signal[] = null;

  showPoiSelector: boolean = false;
  showBeaconEditModeSelector: boolean = false;

  constructor(private _dialog: MdDialog, private oauthService: OAuthService) {

    // Login-Url
    //this.oauthService.loginUrl = "https://api.medunigraz.at/oauth2/authorize/"; //Id-Provider?
    this.oauthService.loginUrl = "http://api.medunigraz:8088/oauth2/authorize/";

    // URL of the SPA to redirect the user to after login
    //this.oauthService.redirectUri = window.location.origin + "/mapeditor/";
    this.oauthService.redirectUri = window.location.origin + "/mapeditor/";

    // The SPA's id. Register SPA with this id at the auth-server
    this.oauthService.clientId = "jk49KPtzDx7EQjcYOvWNYmyJUPSpLOsKYwcVroSg";
    // set the scope for the permissions the client should request
    //this.oauthService.scope = "openid profile email voucher";

    // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
    // OAuth2-based access_token
    this.oauthService.oidc = false;

    // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // instead of localStorage
    this.oauthService.setStorage(sessionStorage);

    // To also enable single-sign-out set the url for your auth-server's logout-endpoint here
    //this.oauthService.logoutUrl = "https://steyer-identity-server.azurewebsites.net/identity/connect/endsession?id_token={{id_token}}";

    // This method just tries to parse the token(s) within the url when
    // the auth-server redirects the user back to the web-app
    // It dosn't send the user the the login page
    this.oauthService.tryLogin({});

  }

  ngOnInit(): void {

    this.oauthService.initImplicitFlow();
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

    this.showPoiSelector = (this.currentAppMode.mode == ApplicationModeT.EDIT_POIS);
    this.showBeaconEditModeSelector = (this.currentAppMode.mode == ApplicationModeT.EDIT_BEACONS);
  }

  floorChanged(floor: Floor): void {
    if (floor) {
      console.log("AppComponent --- floorChanged: " + floor.name);
      this.currentFloor = floor;
    }
  }

  currentPoiTypeChanged(poiType: PoiType) {
    if (poiType) {
      console.log("AppComponent --- currentPoiType: " + poiType.name);
      this.currentPoiType = poiType;
    }
  }

  PoiTypesReceived(poiTypes: PoiType[]) {
    if (poiTypes) {
      console.log("AppComponent --- PoiTypesReceived: " + poiTypes.length);
      this.poiTypes = poiTypes;
    }
  }

  beaconEditModeChanged(mode: BeaconEditMode) {
    if (mode) {
      console.log("AppComponent --- BeaconEditMode: " + mode.name);
      this.beaconEditMode = mode;
    }
  }

  beaconSignalsChanged(signal: Signal[]) {
    if (signal) {
      //console.log("AppComponent --- beaconSignalsChanged: " + JSON.stringify(signal));
      this.beaconSignals = signal;
    }
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
