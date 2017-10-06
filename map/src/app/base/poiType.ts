import { API_BASE_URL } from '../base/globalconstants';

export class PoiType {
  public id: number;
  public name: string;
  public color: string;
  public iconclass: string;
  public fontKey: string;
  public isActive: boolean;

  public isVisible: boolean;
  public groupIndex: number;

  constructor(obj: any) {

    //Logger.log("PoiType::constructor: " + JSON.stringify(obj));

    this.id = obj["id"];
    this.name = obj["name"];
    //this.color = '#007b3c';

    this.isVisible = true;
    this.groupIndex = -1;

    this.iconclass = obj["css_class"];
    this.color = '#' + obj["color"];
    this.fontKey = obj["font_key"];

    this.isActive = obj["selected"];

  }
}
