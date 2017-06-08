import { Component, OnInit, EventEmitter, NgZone, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

import {Position} from '../base/position';

enum PositionStatus {
  InActive = 0,
  Paused = 1,
  Active = 2
}

declare var appInterfaceObject: any;

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  @Output() newPositionEvent = new EventEmitter<Position>();

  isActive: boolean = false;
  positionStatus: PositionStatus = PositionStatus.InActive;
  private checkTimerSubscription: Subscription;

  positioningStarted: boolean = false;

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

  showPosition() {
    console.log("PositionComponent::signalDataChanged()");
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
    console.log("PositionComponent::signalDataChanged() - " + JSON.stringify(value));
  }

  public startScan() {
    appInterfaceObject.start();
  }

  public stopScan() {
    appInterfaceObject.stop();
  }

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

    if (appInterfaceObject.check() != 0) {
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
