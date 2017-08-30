declare var ol: any;

export class OrgUnit {
  id: string;
  name: string;
  color: string = "000000";
  lightercolor: string = "000000";
  darkercolor: string = "000000";

  private style: any = undefined;
  private highlightStyle: any = undefined;
  private selectedStyle: any = undefined;;

  constructor(id: string, obj: any) {
    this.id = id;

    let colorobj = obj["color"];
    if (colorobj) {
      this.color = obj["color"];
      this.lightercolor = obj["lighter"];
      this.darkercolor = obj["darker"];
    }

    if (obj["campusonline"]) {
      this.name = obj["campusonline"]["name"];
    }
    else {
      this.name = obj["name"];
    }

    //console.log("OrgUnit::constructor " + this.id + "/" + this.name + "/" + this.color + "###" + JSON.stringify(obj));
  }

  public createMapStyles() {

    this.style = new ol.style.Style();
    this.highlightStyle = new ol.style.Style();
    this.selectedStyle = new ol.style.Style();

    let fillStyle = new ol.style.Fill();
    fillStyle.setColor(this.color);
    this.style.setFill(fillStyle);

    this.createHighlightStyle();
    this.createSelectedStyle();
  }

  private createHighlightStyle() {
    let fillStyle = new ol.style.Fill();
    fillStyle.setColor(this.lightercolor);
    this.highlightStyle.setFill(fillStyle);
  }

  private createSelectedStyle() {
    let fillStyle = new ol.style.Fill();
    fillStyle.setColor(this.lightercolor);
    this.selectedStyle.setFill(fillStyle);
    let strokeStyle = new ol.style.Stroke({
      color: 'black',
      width: 5
    });
    strokeStyle.setColor(this.darkercolor);
    this.selectedStyle.setStroke(strokeStyle);
  }

}
