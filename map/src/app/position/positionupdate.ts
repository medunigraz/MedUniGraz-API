import {EventEmitter} from '@angular/core';

import {Position} from '../base/position';

import {SignalBuffer} from './signalbuffer';
import {SignalBufferCollection} from './signalbuffercollection';

export class PositionUpdate {


  constructor() {

  }

  getDemoPostion(beaconID: string, demo: boolean, urlString: string): Position {
    let positon: Position = undefined;

    if (beaconID == "D3:52:E0:9C:FA:85") {
      positon = new Position(1722146.2555974184, 5955251.895663918, 1, urlString, null);
    }
    else if (beaconID == "C1:AD:58:D4:C4:D2") {
      positon = new Position(1722135.357349245, 5955258.016597823, 1, urlString, null);
    }
    else if (beaconID == "E8:78:DB:3C:ED:EE") {
      positon = new Position(1722137.678563707, 5955268.451258611, 1, urlString, null);
    }
    else if (beaconID == "EF:0A:B6:E0:38:BB") {
      positon = new Position(1722143.2023333292, 5955278.677696965, 1, urlString, null);
    }
    else if (beaconID == "D5:09:0B:F5:B1:59") {
      positon = new Position(1722149.323267235, 5955290.471691564, 1, urlString, null);
    }

    return positon;
  }

}
