import {Room} from '../base/room';

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
  public coOrganization: string = '';

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
      if (co['category']) {
        this.coCategory = co['category']['id'];
      }
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
