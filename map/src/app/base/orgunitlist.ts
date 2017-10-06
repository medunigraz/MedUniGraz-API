declare var ol: any;

import { OrgUnit } from '../base/orgunit';

export interface IOrgUnitMap {
  [id: number]: OrgUnit;
}

export class OrgUnitList {

  private map: IOrgUnitMap = {};

  private defaultStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(156,156,156,1)'
    })
  });
  private wayStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(242,239,233,1)'
    })
  });


  constructor(obj: any) {
    //Logger.log("OrgUnitList::Create: " + JSON.stringify(obj));

    for (let i = 0; i < obj.length; i++) {
      let id: string = obj[i]["id"];

      //Logger.log("OrgUnitList::Create OrgUnit: " + id + ":::" + JSON.stringify(obj[i]));
      this.map[id] = new OrgUnit(id, obj[i]);
      this.map[id].createMapStyles();
    }

    //Logger.log("OrgUnitList::Create: " + JSON.stringify(this.map));
  }

  public getName(orgUnitId: string) {
    let orgunit = this.map[orgUnitId];
    if (orgunit) {
      return orgunit.name;
    }
    return "nicht zugeordnet";
  }


  public getStyleForRoom(orgId: number, categoryId: number, isHighlighted: boolean, isSelected: boolean): any {

    //Logger.log("OrgUnitList::getStyleForRoom: " + orgId);

    if (categoryId == 18 //Verkehrsfläche
      || categoryId == 13 //Balkon
      || categoryId == 26 //Garage
    ) {
      return this.wayStyle;
    }
    /*
        if (categoryId == 17 //Haustechnik
        ) {
          return this.defaultStyle;
        }*/

    let orgunit = this.map[orgId];
    if (orgunit) {
      return orgunit.getStyleForRoom(orgId, isHighlighted, isSelected);
    }

    return this.defaultStyle;
  }
}
