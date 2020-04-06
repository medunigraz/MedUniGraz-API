import { SignalBuffer } from './signalbuffer';
import { SignalBufferFixed } from './signalbufferFixed';
import { Observable ,  Subscription, timer } from 'rxjs';

import { Signal } from '../base/signal';

export interface ISignalMap {
  [id: string]: SignalBufferFixed;
}

export class SignalBufferCollection {

  private map: ISignalMap = {};

  private clearTimerSubscription: Subscription;

  constructor() {

  }

  public clear() {
    this.map = {};
    this.stopClearTimer();
  }

  public start() {
    this.startClearTimer();
  }

  public addValues(valuestring: any) {
    if (valuestring) {
      let data = JSON.parse(valuestring);

      for (let signal of data) {
        //console.log('set signal: ' + JSON.stringify(signal));
        this.addValue(signal["ID"], signal["Value"], signal["Name"], signal["Batterie"]);
      }
    }
  }

  public getNearestBeacon(): string {
    //console.log("SignalBufferCollection::getNearestBeacon() - " + JSON.stringify(this.map));

    let bestValue = -9999;
    let bestID: string = undefined;

    for (let key in this.map) {

      let value = this.map[key].getValue();

      if (value) {
        if (value > bestValue) {
          bestValue = value;
          bestID = key;
        }
      }
    }

    return bestID;
  }

  public getAllSignals(): Signal[] {
    let signals: Signal[] = [];

    for (let key in this.map) {
      let value = this.map[key].getValue();
      if (value) {
        signals.push(new Signal(this.map[key].mac, value, this.map[key].name, this.map[key].battery, this.map[key].lastOrigValue));
      }
    }

    return signals;
  }


  public getJSONString(): string {
    return JSON.stringify(this.map);
  }

  public getURLString(): string {

    let urlString = "";
    let index = 0;

    for (let key in this.map) {

      let value = this.map[key].getValue();

      if (index > 0) {
        urlString += "&";
      }
      urlString += 'name[' + key + ']=' + value;

      index++;
    }

    return urlString;
  }

  private addValue(mac: string, value: number, name: string, battery: number) {
    if (!this.map[name]) {
      this.map[name] = new SignalBufferFixed(name, mac, value, name, battery);
    }
    else {
      this.map[name].setValue(mac, value, name, battery);
    }
  }

  private startClearTimer() {
    //console.log("SignalBufferCollection::startClearTimer()");

    if (this.clearTimerSubscription != null) {
      this.stopClearTimer();
    }

    let timerO = timer(100);
    this.clearTimerSubscription = timerO.subscribe(t => {
      this.clearTimerEvent();
    });
  }

  private stopClearTimer() {
    //console.log("SignalBufferCollection::stopClearTimer()");
    if (this.clearTimerSubscription != null) {
      this.clearTimerSubscription.unsubscribe();
      this.clearTimerSubscription = null;
    }
  }

  private clearTimerEvent() {
    //console.log("SignalBufferCollection::clearTimerEvent() - " + JSON.stringify(this.map));

    let keysToDelete: string[] = [];

    for (let key in this.map) {
      if (this.map[key].updateTimer()) {
        //console.log("SignalBufferCollection::clearTimerEvent() - Clear Signal: " + key);
        keysToDelete.push(key);
      }
    }

    for (let i = 0; i < keysToDelete.length; i++) {
      delete this.map[keysToDelete[i]];
    }

    this.startClearTimer();
    //console.log("SignalBufferCollection::clearTimerEvent() - END: " + JSON.stringify(this.map));
  }

}
