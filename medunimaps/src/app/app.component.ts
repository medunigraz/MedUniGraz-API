import { ViewChild, Component, Optional, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ApplicationMode, ApplicationModeT } from './base/applicationmode';
import { Floor } from './base/floor';
import { PoiType } from './base/poitype';
import { BeaconEditMode, BeaconEditModes } from './base/beaconeditmode';
import { Signal } from './base/signal';
import { Beacon } from './base/beacon';
import { EdgeWeight } from './base/edgeweight';


import { OAuthService, NullValidationHandler, JwksValidationHandler } from 'angular-oauth2-oidc';

import { BeaconinfoComponent } from './beaconinfo/beaconinfo.component'

import { auth } from "../environments/environment";

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

  edgeWeights: EdgeWeight[] = null;
  currentEdgeWeight: EdgeWeight = null;

  showPoiSelector: boolean = false;
  showEdgeWeightSelector: boolean = false;
  showBeaconEditModeSelector: boolean = false;

  beaconToDelete: Beacon = null;

  @ViewChild('beaconInfoComp') public beaconInfoComponent: BeaconinfoComponent;

  constructor(private _dialog: MatDialog, private oauthService: OAuthService) {

    // Login-Url
    //this.oauthService.loginUrl = "https://api.medunigraz.at/oauth2/authorize/"; //Id-Provider?
    //this.oauthService.loginUrl = "https://api.medunigraz.at/oauth2/authorize/";
    //this.oauthService.loginUrl = "https://api.medunigraz.at:8088/oauth2/authorize/";

    // URL of the SPA to redirect the user to after login
    //this.oauthService.redirectUri = window.location.origin + "/mapeditor/";

    //this.oauthService.redirectUri = window.location.href;
    //this.oauthService.redirectUri = window.location.origin + "/editor/";
    //if (window.location.origin.indexOf('localhost') >= 0) {
    //  this.oauthService.redirectUri = window.location.origin;
    //}

    /*
    console.log("AppComponent::constructor " + this.oauthService.redirectUri);


    // The SPA's id. Register SPA with this id at the auth-server
    this.oauthService.clientId = "o5AMvJLFuKNhKzBltNK1d0DDyP53h5Ng2gxVBT7p";
    // set the scope for the permissions the client should request
    this.oauthService.scope = "editor";

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

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initImplicitFlow();
    }*/

    this.oauthService.configure(auth);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    //this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.tryLogin({
    });

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initImplicitFlow();
    }

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

    this.showPoiSelector = (this.currentAppMode.mode == ApplicationModeT.EDIT_POIS);
    this.showBeaconEditModeSelector = (this.currentAppMode.mode == ApplicationModeT.EDIT_BEACONS);
    this.showEdgeWeightSelector = (this.currentAppMode.mode == ApplicationModeT.EDIT_WEIGHTS);
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

  selectedBeaconChanged(beacon: Beacon) {
    //console.log("AppComponent --- selectedBeaconChanged: " + JSON.stringify(beacon));
    if (this.beaconInfoComponent) {
      this.beaconInfoComponent.setSelectedBeacon(beacon);
    }
  }

  deleteBeacon(beacon: Beacon) {
    console.log("AppComponent --- deleteBeacon: " + JSON.stringify(beacon));
    if (beacon) {
      this.beaconToDelete = beacon;
    }
  }

  edgeWeightChanged(edgeWeight: EdgeWeight) {
    if (edgeWeight) {
      console.log("AppComponent --- edgeWeightChanged: " + JSON.stringify(edgeWeight));
      this.currentEdgeWeight = edgeWeight;
    }
  }

  edgeWeightsReceived(edgeWeights: EdgeWeight[]) {
    if (edgeWeights) {
      console.log("AppComponent --- edgeWeightsReceived: " + edgeWeights.length);
      this.edgeWeights = edgeWeights;
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
    <p> <button mat-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor( @Optional() public dialogRef: MatDialogRef<DialogContent>) { }
}
