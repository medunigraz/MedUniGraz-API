import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import {Room } from '../base/room';

@Injectable()
export class MainappService {

  constructor() { }

  private emitChangeSource = new Subject<Room>();

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

}
