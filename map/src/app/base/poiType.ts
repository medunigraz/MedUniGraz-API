import { API_BASE_URL } from '../base/globalconstants';

export class PoiType {
  public id: number;
  public name: string;
  public icon: string;
  public color: string;
  public iconclass: string;
  public fontKey: string;
  public isActive: boolean;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.icon = API_BASE_URL + obj["icon"];
    this.color = '#007b3c';

    let icon = obj["icon"];

    if (this.name == "Infostand") {
      this.iconclass = "icon-pfeil_oben";
      this.color = '#FF0000';
      this.fontKey = 'N';
    }
    else if (this.name == "Eingang") {
      this.iconclass = "icon-gehweg";
      this.fontKey = 'K';
    }
    else if (this.name == "WC_Damen") {
      this.iconclass = "icon-wc_damen";
      this.fontKey = 'f';
    }
    else if (this.name == "WC_Herren") {
      this.iconclass = "icon-wc_herren";
      this.fontKey = 'g';
    }
    else if (this.name == "Fahrradabstellplatz") {
      this.iconclass = "icon-fahrradparkplatz";
      this.fontKey = 'E';
    }
    else if (this.name == "Aufzug") {
      this.iconclass = "icon-aufzug";
      this.fontKey = 'A';
    }
    else if (this.name == "Stiege A") {
      this.iconclass = "icon-treppe_a";
      this.fontKey = 'W';
    }
    else if (this.name == "Stiege B") {
      this.iconclass = "icon-treppe_b";
      this.fontKey = 'W';
    }
    else if (this.name == "Stiege C") {
      this.iconclass = "icon-treppe_c";
      this.fontKey = 'X';
    }
    else if (this.name == "Stiege D") {
      this.iconclass = "icon-treppe_d";
      this.fontKey = 'Y';
    }
    else if (this.name == "Stiege E") {
      this.iconclass = "icon-treppe_e";
      this.fontKey = 'Z';
    }
    else if (this.name == "Stiege F") {
      this.iconclass = "icon-treppe_f";
      this.fontKey = 'a';
    }
    else if (this.name == "Stiege G") {
      this.iconclass = "icon-treppe_g";
      this.fontKey = 'b';
    }
    else if (this.name == "Barrierefreies WC") {
      this.iconclass = "icon-pfeil_oben";
      this.fontKey = 'c';
    }
    else if (this.name == "Garderobe") {
      this.iconclass = "icon-garderobe";
      this.fontKey = 'H';
    }
    else if (this.name == "Straßenbahn") {
      this.iconclass = "icon-strassenbahn";
      this.fontKey = 'T';
    }
    else if (this.name == "Warenannahme") {
      this.iconclass = "icon-warenannahme";
      this.fontKey = 'd';
    }
    else if (this.name == "Zugang nur mit Karte") {
      this.iconclass = "icon-zugang_nur_mit_karte";
      this.fontKey = 'h';
    }
    else {
      this.iconclass = "icon-pfeil_oben";
      this.fontKey = 'c';
    }

    this.isActive = obj["selected"];
  }
}
