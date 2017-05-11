import {Room} from '../base/room';

export class RouteNodes {
  public start: Room;
  public end: Room;

  constructor(start: Room, end: Room) {
    this.start = start;
    this.end = end;
  }
}
