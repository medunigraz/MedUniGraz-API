declare var ol: any;

import { OrgUnit } from '../base/orgunit';

export interface IOrgUnitMap {
  [id: number]: OrgUnit;
}

export class OrgUnitList {

  private map: IOrgUnitMap = {};

  private defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(128,128,128,1)'
    })
  });
  private wayStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(242,239,233,1)'
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

    //console.log("OrgUnitList::Create: " + JSON.stringify(this.map));
  }

  public getName(orgUnitId: string) {
    let orgunit = this.map[orgUnitId];
    if (orgunit) {
      return orgunit.name;
    }
    return "nicht zugeordnet";
  }


  public getStyleForRoom(orgId: number, categoryId: number, isHighlighted: boolean, isSelected: boolean): any {

    //console.log("OrgUnitList::getStyleForRoom: " + orgId);

    if (categoryId == 18) { //Way
      return this.wayStyle;
    }

    let orgunit = this.map[orgId];
    if (orgunit) {
      return orgunit.getStyleForRoom(orgId, isHighlighted, isSelected);
    }

    return this.defaultStyle;
  }
}