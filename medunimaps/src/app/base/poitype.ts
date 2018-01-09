import { API_BASE_URL } from '../base/globalconstants';

export class PoiType {
  public id: number;
  public name: string;
  public color: string;
  public iconclass: string;
  public fontKey: string;
  public isActive: boolean;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];

    this.iconclass = obj["css_class"];
    this.color = '#' + obj["color"];
    this.fontKey = obj["font_key"];

    this.isActive = obj["selected"];

    /*
        if (this.name == 'Garderobe') {
          this.iconclass = 'icon-imbiss3';
          this.fontKey = 'p';
        }
        else if (this.name == 'Aufzug') {
          this.iconclass = 'icon-automat';
          this.fontKey = 'q';
        }
    */
  }
}
