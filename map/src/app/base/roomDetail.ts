import {Room} from '../base/room';

export class RoomDetail {
  id: number = -1;
  text: string = '';
  title: string = '';
  code: string = '';
  medonlineurl: string = '';
  floorId: number = -1;

  center: number[] = null;
  marker: number[] = null;

  coId: number = -1;
  coArea: number = 0;
  coOrganization: string = '';

  constructor(roomFeature: any) {
    this.id = roomFeature.getId();
    this.floorId = roomFeature.get('floor');

    this.readCO(roomFeature.get('campusonline'));
    this.readMarker(roomFeature.get('marker'));
    this.readCenter(roomFeature.get('center'));
  }

  private readCO(co: any) {
    if (co) {
      this.text = Room.GetRoomTxt(co['title'], co['name_full']);
      this.title = co['title'];
      this.code = co['name_full'];
      this.coId = co['id'];
      this.medonlineurl = 'https://online.medunigraz.at/mug_online/wbRaum.editRaum?pRaumNr=' + this.coId;
      this.coArea = co['area'];
      this.coOrganization = co['organization'];
    }
  }

  private readMarker(marker: any) {
    if (marker) {
      this.marker = marker['coordinates'];
    }
  }

  private readCenter(center: any) {
    if (center) {
      this.center = center['coordinates'];
    }
  }

  public static isRoomFeatureSelectAble(featureRoom: any): boolean {
    if (!featureRoom) {
      return false;
    }
    if (!featureRoom.get('campusonline')) {
      return false;
    }
    if (!featureRoom.get('marker') || !featureRoom.get('marker')['coordinates']) {
      return false;
    }
    if (!featureRoom.get('center') || !featureRoom.get('center')['coordinates']) {
      return false;
    }

    return true;
  }

}
