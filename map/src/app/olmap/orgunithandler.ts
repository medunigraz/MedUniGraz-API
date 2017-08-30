import { MapLayerBase } from './mapLayerBase';
import { MapService } from '../mapservice/map.service';

import { OrgUnit } from '../base/orgunit';
import { OrgUnitList } from '../base/orgunitlist';

import { MapRoom } from './mapRoom';

export class OrgUnitHandler extends MapLayerBase {

  private mapRoom: MapRoom = undefined;
  private orgUnitList: OrgUnitList = undefined;

  constructor(private mapService: MapService, private roomcmp: MapRoom) {
    super();

    this.mapRoom = roomcmp;

    this.Initialize();
  }

  private Initialize(): void {

    this.subscribeNewRequest(
      this.mapService.getOrgUnits().subscribe(
        rooms => this.updateData(rooms),
        error => console.log("ERROR get Org Units: " + <any>error)));
  }

  public getName(orgUnitId: string) {
    return this.orgUnitList.getName(orgUnitId);
  }

  private updateData(features: any): void {
    console.log("OrgUnitHandler::updateData");
    this.orgUnitList = new OrgUnitList(features);
    this.mapRoom.orgUnitsReceived(this.orgUnitList);
  }



}
