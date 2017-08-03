import { Component, OnInit, EventEmitter, NgZone, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { MapService } from '../mapservice/map.service';

import {Position} from '../base/position';

import {PositionUpdate} from './positionupdate';
import {SignalBuffer} from './signalbuffer';
import {SignalBufferCollection} from './signalbuffercollection';

enum PositionStatus {
  InActive = 0,
  Paused = 1,
  Active = 2
}

const demoMode: boolean = true;

declare var appInterfaceObject: any;

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  @Output() newPositionEvent = new EventEmitter<Position>();

  public isActive: boolean = demoMode;
  private positionStatus: PositionStatus = PositionStatus.InActive;
  private checkTimerSubscription: Subscription;
  private posUpdateTimerSubscription: Subscription;

  private subscription: Subscription = null;

  private positioningStarted: boolean = false;

  private signalBufferCollection: SignalBufferCollection = new SignalBufferCollection();

  private positionUpdate: PositionUpdate = new PositionUpdate();


  constructor(private zone: NgZone, private mapService: MapService) {
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

  showPosition() {
    console.log("PositionComponent::showPosition()");
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
      //console.log("PositionComponent::signalDataChanged() - " + JSON.stringify(value));
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
    this.newPositionEvent.emit(undefined);
  }

  /**********************************************************
  POSTION UPDATE
  **********************************************************/

  private startPosUpdateTimer() {
    //console.log("PositionComponent::startPosUpdateTimer()");

    if (this.posUpdateTimerSubscription != null) {
      this.stopPosUpdateTimer();
    }

    let timer = TimerObservable.create(2000);
    this.posUpdateTimerSubscription = timer.subscribe(t => {
      this.posUpdateEvent();
    });
  }

  private stopPosUpdateTimer() {
    //console.log("PositionComponent::stopPosUpdateTimer()");
    if (this.posUpdateTimerSubscription != null) {
      this.posUpdateTimerSubscription.unsubscribe();
      this.posUpdateTimerSubscription = null;
    }
  }

  private posUpdateEvent() {
    //console.log("PositionComponent::posUpdateEvent()");

    let urlString = this.signalBufferCollection.getPosUrlString();

    //let nearestBeacon = this.signalBufferCollection.getNearestBeacon();
    //let pos: Position = this.positionUpdate.getDemoPostion(nearestBeacon, demoMode, urlString);
    //LOG POSITION DATA
    appInterfaceObject.log("" + new Date().getTime() + ";" + urlString + ";" + this.signalBufferCollection.getJSONString());
    //this.newPositionEvent.emit(pos);

    let lastedge = -1;

    let urlparams = '';
    if (lastedge >= 0) {
      urlparams += 'edge=' + lastedge;
    }

    if (urlString && urlString.length > 0) {
      if (lastedge >= 0) {
        urlparams += '&';
      }
      urlparams += urlString;

      this.subscribeNewRequest(
        this.mapService.getRouteForPos(urlparams).
          subscribe(
          livePos => this.updateLivePos(livePos, urlparams),
          error => console.log("ERROR: " + <any>error)));
    }
    else {
      this.updateLivePos(undefined, '');
    }

    this.stopPosUpdateTimer();
    if (this.isActive) {
      this.startPosUpdateTimer();
    }
  }

  public subscribeNewRequest(sub: Subscription) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.subscription = sub;
  }

  private updateLivePos(posResult: any, urlString: string) {
    console.log("PositionComponent::updateLivePos: " + JSON.stringify(posResult));

    let pos: Position = undefined;

    try {
      if (posResult) {
        //constructor(x: number, y: number, level: number, urlString: string, feature: any) {
        let coords = posResult.geometry.coordinates;
        let prop = posResult.properties;
        //console.log("PositionComponent::updateLivePos: " + JSON.stringify(coords));
        pos = new Position(coords[0], coords[1], prop.level, urlString, posResult);
        //console.log("PositionComponent::updateLivePos: " + JSON.stringify(pos));
      }

    } catch (e) {
      console.log("PositionComponent::updateLivePos: " + JSON.stringify(e));
    }

    //console.log("PositionComponent::updateLivePos: LEVEL: " + JSON.stringify(pos.level));

    this.newPositionEvent.emit(pos);
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
