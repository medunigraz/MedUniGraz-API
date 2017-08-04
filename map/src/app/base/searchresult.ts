import {Room} from '../base/room';

export class SearchResult {
  id: number;
  text: string;
  type: number;
  level: number;
  isStartPoint: boolean;
  lastElem: boolean;

  constructor(id: number, text: string, type: number) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.isStartPoint = false;
    this.lastElem = false;
  }

  public static createFromRestObj(obj: any): SearchResult {

    let type = 0;
    if (obj["ctype"] == "structure.person") {
      type = 1;
    }
    else if (obj["ctype"] == "structure.organization") {
      type = 2;
    }

    let result = new SearchResult(obj["id"], obj["presentation"], type);
    result.level = obj["level"];

    return result;
  }

  public getRoom() {
    return new Room(this.id, this.text, this.level);
  }

}
