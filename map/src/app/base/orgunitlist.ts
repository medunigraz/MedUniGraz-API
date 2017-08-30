declare var ol: any;

import { OrgUnit } from '../base/orgunit';

export interface IOrgUnitMap {
  [id: number]: OrgUnit;
}

export class OrgUnitList {

  private map: IOrgUnitMap = {};

  private defaultStyle = new ol.style.Style({
    /*stroke: new ol.style.Stroke({
      color: 'red',
      width: 0
    }),*/
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,1)'
    })
  });


  constructor(obj: any) {
    //console.log("OrgUnitList::Create: " + JSON.stringify(obj));

    for (let i = 0; i < obj.length; i++) {
      let id: string = obj[i]["id"];

      //console.log("OrgUnitList::Create OrgUnit: " + id + ":::" + JSON.stringify(obj[i]));
      this.map[id] = new OrgUnit(id, obj[i]);
      this.map[id].createMapStyles();
    }

    console.log("OrgUnitList::Create: " + JSON.stringify(this.map));
  }

  public getName(orgUnitId: string) {
    let orgunit = this.map[orgUnitId];
    if (orgunit) {
      return orgunit.name;
    }
    return "nicht zugeordnet";
  }


}
