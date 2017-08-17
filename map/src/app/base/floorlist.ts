import { Floor } from '../base/floor';

export interface IFloorMap {
  [id: number]: Floor;
}

export class FloorList {

  floorList: Floor[] = [];

  private map: IFloorMap = {};

  constructor(floors: Floor[]) {
    this.floorList = floors;

    this.map = {};

    for (let i = 0; i < this.floorList.length; i++) {
      this.map[this.floorList[i].id] = this.floorList[i];
    }
  }

  getFloorbyId(id: number): Floor {
    return this.map[id];
  }

  isFloorAbove(aboveFloorId: number, belowFloorId: number) {
    let currentFloor = this.getFloorbyId(belowFloorId);

    for (let i = 0; i < 100; i++) {
      if (currentFloor.floorAbove < 0) {
        return false;
      }

      if (currentFloor.floorAbove == aboveFloorId) {
        return true;
      }

      currentFloor = this.getFloorbyId(currentFloor.floorAbove);
    }
    return false;
  }

  getLength(): number {
    return this.floorList.length;
  }

}
