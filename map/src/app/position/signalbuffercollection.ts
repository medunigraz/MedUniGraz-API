import { SignalBufferTimed } from './signalbuffertimed';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

export interface ISignalMap {
  [id: string]: SignalBufferTimed;
}

export class SignalBufferCollection {

  private map: ISignalMap = {};

  private clearTimerSubscription: Subscription;

  constructor() {

  }

  public clear() {
    this.map = {};
    //this.stopClearTimer();
  }

  public start() {
    //this.startClearTimer();
  }

  public addValues(valuestring: any) {
    if (valuestring) {
      let data = JSON.parse(valuestring);

      for (let signal of data) {
        //console.log('set signal: ' + JSON.stringify(signal));
        this.addValue(signal["Name"], signal["Value"]);
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


  public getPosUrlString(): string {
    let bestValues: number[] = [-9999, -9999, -9999];
    let bestIDs: string[] = [undefined, undefined, undefined];

    let debugString = "";

    let counter = 0;
    let keysToDelete: string[] = [];

    for (let key in this.map) {

      let value = this.map[key].getValue();

      if (!value) {
        keysToDelete.push(key);
      }
      else {

        counter++;

        if (this.map[key].name == '1iJd') {
          debugString += this.map[key].getDebugString();
        }

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
    }

    let resultString = "";
    for (let i = 0; i < 3; i++) {
      if (bestIDs[i]) {
        if (i > 0) {
          resultString += "&";
        }
        resultString += "name[" + bestIDs[i] + "]=" + bestValues[i].toFixed(1);
      }
    }

    //resultString += "&debug=" + counter + "YYYYYY" + debugString;
    //resultString += "&debug=" + counter;

    this.deleteObsoleteBeacons(keysToDelete);

    return resultString;
  }

  public getJSONString(): string {
    return JSON.stringify(this.map);
  }

  private addValue(name: string, value: number) {
    if (!this.map[name]) {
      this.map[name] = new SignalBufferTimed(name, value);
    }
    else {
      this.map[name].setValue(value);
    }
  }


  private deleteObsoleteBeacons(beaconstoDelete: string[]) {
    for (let i = 0; i < beaconstoDelete.length; i++) {
      delete this.map[beaconstoDelete[i]];
    }
  }

  /*
  private startClearTimer() {
  //console.log("SignalBufferCollection::startClearTimer()");

  if (this.clearTimerSubscription != null) {
    this.stopClearTimer();
  }

  let timer = TimerObservable.create(100, 100);
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
  console.log("SignalBufferCollection::updateBufferTimerEvent()");

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

  //this.startClearTimer();
  //console.log("SignalBufferCollection::clearTimerEvent() - END: " + JSON.stringify(this.map));
}*/

}
