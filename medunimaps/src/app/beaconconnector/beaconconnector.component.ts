import { Component, OnInit, EventEmitter, NgZone, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

import {SignalBuffer} from './signalbuffer';
import {SignalBufferCollection} from './signalbuffercollection';
import {Signal} from '../base/signal';

enum PositionStatus {
  InActive = 0,
  Paused = 1,
  Active = 2
}

const demoMode: boolean = false;

declare var appInterfaceObject: any;


@Component({
  selector: 'app-beaconconnector',
  templateUrl: './beaconconnector.component.html',
  styleUrls: ['./beaconconnector.component.css']
})
export class BeaconconnectorComponent implements OnInit {

  @Output() updateSignalsEvent = new EventEmitter<Signal[]>();

  private isActive: boolean = demoMode;
  private positionStatus: PositionStatus = PositionStatus.InActive;
  private checkTimerSubscription: Subscription;
  private posUpdateTimerSubscription: Subscription;

  private positioningStarted: boolean = false;

  private signalBufferCollection: SignalBufferCollection = new SignalBufferCollection();

  constructor(private zone: NgZone) {
    window["angularComponentRef"] = {
      zone: this.zone,
      componentFn: (value) => this.signalDataChanged(value),
      component: this
    };
  }

  ngOnInit() {
    let hasAppInterface = appInterfaceObject.testapp();
    //hasAppInterface = true;

    if (hasAppInterface) {
      this.isActive = true;
    }
  }

  ngAfterViewInit(): void {
    this.startCheckTimer();
  }

  scanButtonClickedPosition() {
    console.log("BeaconconnectorComponent::scanButtonClickedPosition()");
    this.positioningStarted = !this.positioningStarted;
    this.updatePositionStatus();

    if (this.positioningStarted) {
      this.startScan();
    }
    else {
      this.stopScan();
    }
  }

  signalDataChanged(value: string) {
    if (this.positionStatus == PositionStatus.Active) {
      //console.log("BeaconconnectorComponent::signalDataChanged() - " + JSON.stringify(value));
      this.signalBufferCollection.addValues(value);
    }
  }

  public startScan() {
    this.signalBufferCollection.clear();
    this.signalBufferCollection.start();
    this.startPosUpdateTimer();
    appInterfaceObject.start();
    if (demoMode) {
      appInterfaceObject.demo();
    }
  }

  public stopScan() {
    this.stopPosUpdateTimer();
    appInterfaceObject.stop();
    this.signalBufferCollection.clear();
    this.updateSignalsEvent.emit([]);
  }

  /**********************************************************
  POSTION UPDATE
  **********************************************************/

  private startPosUpdateTimer() {
    //console.log("BeaconconnectorComponent::startPosUpdateTimer()");

    if (this.posUpdateTimerSubscription != null) {
      this.stopPosUpdateTimer();
    }

    let timer = TimerObservable.create(1000);
    this.posUpdateTimerSubscription = timer.subscribe(t => {
      this.posUpdateEvent();
    });
  }

  private stopPosUpdateTimer() {
    //console.log("BeaconconnectorComponent::stopPosUpdateTimer()");
    if (this.posUpdateTimerSubscription != null) {
      this.posUpdateTimerSubscription.unsubscribe();
      this.posUpdateTimerSubscription = null;
    }
  }

  private posUpdateEvent() {
    //console.log("BeaconconnectorComponent::posUpdateEvent()");

    let signals = this.signalBufferCollection.getAllSignals();
    this.updateSignalsEvent.emit(signals);

    //LOG POSITION DATA
    //appInterfaceObject.log("" + new Date().getTime() + ";" + nearestBeacon + ";" + this.signalBufferCollection.getJSONString());

    this.stopPosUpdateTimer();
    if (this.isActive) {
      this.startPosUpdateTimer();
    }
  }

  /**********************************************************
  CHECK STATUS
  **********************************************************/

  private startCheckTimer() {
    //console.log("PositionComponent::startCheckTimer()");

    if (this.checkTimerSubscription != null) {
      this.stopCheckTimer();
    }

    let timer = TimerObservable.create(2500);
    this.checkTimerSubscription = timer.subscribe(t => {
      this.checkTimerEvent();
    });
  }

  private stopCheckTimer() {
    //console.log("PositionComponent::stopCheckTimer()");
    if (this.checkTimerSubscription != null) {
      this.checkTimerSubscription.unsubscribe();
      this.checkTimerSubscription = null;
    }
  }

  private checkTimerEvent() {
    //console.log("PositionComponent::checkTimerEvent()");
    this.updatePositionStatus();

    this.stopCheckTimer();
    if (this.isActive) {
      this.startCheckTimer();
    }
  }

  private updatePositionStatus() {
    //console.log("PositionComponent::updatePositionStatus()" + appInterfaceObject.check());

    if (appInterfaceObject.check() != 0 && !demoMode) {
      this.positionStatus = PositionStatus.InActive;
    }
    else {
      if (this.positioningStarted) {
        this.positionStatus = PositionStatus.Active;
      }
      else {
        this.positionStatus = PositionStatus.Paused;
      }
    }
  }

}
