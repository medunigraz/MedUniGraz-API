export class PoiType {
  id: number;
  name: string;
  selected: boolean;
  iconurl: string;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.selected = obj["selected"];
    this.iconurl = obj["icon"];
  }
}
