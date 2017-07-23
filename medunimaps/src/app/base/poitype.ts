import {API_BASE_URL} from '../base/globalconstants';

export class PoiType {
  id: number;
  name: string;
  selected: boolean;
  iconurl: string;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.selected = obj["selected"];
    this.iconurl = API_BASE_URL + obj["icon"];
  }
}
