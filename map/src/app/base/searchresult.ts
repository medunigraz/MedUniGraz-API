import { Room } from '../base/room';
import { AddressPosMapping } from '../base/addressposmapping';

export class SearchResult {
  id: number;
  text: string;
  type: number;
  level: number;
  room_id: number;

  notFound: boolean;

  isStartPoint: boolean;
  lastElem: boolean;

  constructor(id: number, text: string, type: number) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.isStartPoint = false;
    this.lastElem = false;
    this.notFound = false;
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
    result.level = obj["level_id"];
    result.room_id = obj["room_id"];

    //Logger.log("SearchResult::createFromRestObj " + JSON.stringify(obj));

    return result;
  }

  public static CreateFromRoom(room: Room) {
    let result = new SearchResult(room.id, room.text, 0);
    result.level = room.level;
    return result;
  }

  public getRoom() {
    if (this.type == 0) {
      return new Room(this.id, this.text, this.level);
    }
    else if (this.room_id) {
      return new Room(this.room_id, this.text, this.level);
    }
    else if (this.type == 2 && !this.room_id && AddressPosMapping.testValidAddress(this.text)) {
      let r = new Room(-1, this.text, 2);
      r.setvirtualAdress();
      return r;
    }
    return undefined;
  }

}
