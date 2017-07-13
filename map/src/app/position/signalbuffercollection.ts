import { SignalBuffer } from './signalbuffer';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

export interface ISignalMap {
  [id: string]: SignalBuffer;
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
        this.addValue(signal["ID"], signal["Value"]);
      }
    }
  }

  public getNearestBeacon(): string {
    //console.log("SignalBufferCollection::getNearestBeacon() - " + JSON.stringify(this.map));

    let bestValue = -9999;
    let bestID: string = undefined;

    for (let key in this.map) {

      let value = this.map[key].lastValue;

      if (value) {
        if (value > bestValue) {
          bestValue = value;
          bestID = key;
        }
      }
    }

    return bestID;
  }


  public getPosUrlString(): string {
    let bestValues: number[] = [-9999, -9999, -9999];
    let bestIDs: string[] = [undefined, undefined, undefined];

    for (let key in this.map) {

      let value = this.map[key].lastValue;

      for (let i = 0; i < 3; i++)
        if (value) {
          if (value > bestValues[i]) {

            if (i == 1) {
              bestValues[2] = bestValues[1];
              bestIDs[2] = bestIDs[1];
            }

            if (i == 0) {
              bestValues[1] = bestValues[0];
              bestIDs[1] = bestIDs[0];
            }

            bestValues[i] = value;
            bestIDs[i] = key;
            break;
          }
        }
    }

    let resultString = "";
    for (let i = 0; i < 3; i++) {
      if (bestIDs[i]) {
        if (i > 0) {
          resultString += "&";
        }
        resultString += "mac[" + bestIDs[i] + "]=" + bestValues[i];
      }
    }

    return resultString;
  }

  public getJSONString(): string {
    return JSON.stringify(this.map);
  }

  public getURLString(): string {

    let urlString = "";
    let index = 0;

    for (let key in this.map) {

      let value = this.map[key].lastValue;

      if (index > 0) {
        urlString += "&";
      }
      urlString += 'mac[' + key + ']=' + value;

      index++;
    }

    return urlString;
  }

  private addValue(id: string, value: number) {
    if (!this.map[id]) {
      this.map[id] = new SignalBuffer(id);
    }

    this.map[id].setValue(value);
  }

  private startClearTimer() {
    //console.log("SignalBufferCollection::startClearTimer()");

    if (this.clearTimerSubscription != null) {
      this.stopClearTimer();
    }

    let timer = TimerObservable.create(666);
    this.clearTimerSubscription = timer.subscribe(t => {
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
      if (this.map[key].checkClearValue()) {
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
