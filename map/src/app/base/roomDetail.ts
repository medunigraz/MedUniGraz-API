import { Room } from '../base/room';

export class RoomDetail {
  public id: number = -1;
  public text: string = '';
  public title: string = '';
  public code: string = '';
  public medonlineurl: string = '';
  public floorId: number = -1;

  public center: number[] = null;
  public marker: number[] = null;

  public coId: number = -1;
  public coArea: number = 0;
  public coCategory: number = -1;

  public orgId: string = '';
  public coOrgId: string = '';
  public coOrganization: string = '';

  public level: number = -1;

  constructor(roomFeature: any, level: number) {
    this.level = level;
    this.id = roomFeature.getId();
    this.floorId = roomFeature.get('floor');
    this.orgId = roomFeature.get('organization');

    this.readCO(roomFeature.get('campusonline'));
    this.readMarker(roomFeature.get('marker'));
    this.readCenter(roomFeature.get('center'));
  }

  public getSimpleRoom(): Room {
    return new Room(this.id, Room.GetRoomTxtSearch(this.title, this.code), this.level);
  }

  public getRoomMarkerText() {
    return '<b>' + this.title + '</b>' + '<br />(' + this.code + ')' + '<br />' + this.coOrganization;
  }

  private readCO(co: any) {
    if (co) {
      this.text = Room.GetRoomTxt(co['title'], co['name_full']);
      this.title = co['title'];     //Titel
      this.code = co['name_full'];  //room code
      this.coId = co['id'];
      if (co['category']) {
        this.coCategory = co['category']['id'];
      }
      this.medonlineurl = 'https://online.medunigraz.at/mug_online/wbRaum.editRaum?pRaumNr=' + this.coId;
      this.coArea = co['area'];
      this.coOrgId = co['organization'];
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

  public static getCategoryId(featureRoom: any): number {
    let co = featureRoom.get('campusonline');
    if (!co) {
      return -1;
    }
    let category = co['category'];
    if (!category) {
      return -1;
    }
    return category['id'];
  }

  public static getOrgId(featureRoom: any): number {
    return featureRoom.get('organization');
  }

  public static isRoomFeatureSelectAble(featureRoom: any): boolean {

    if (!featureRoom) {
      return false;
    }
    if (!featureRoom.get('campusonline')) {
      return false;
    }/*
    if (featureRoom.get('campusonline')['category']['id'] == 17) {  //Haustechnik
      return false;
    }*/
    if (!featureRoom.get('marker') || !featureRoom.get('marker')['coordinates']) {
      return false;
    }
    if (!featureRoom.get('center') || !featureRoom.get('center')['coordinates']) {
      return false;
    }

    return true;
  }

}
