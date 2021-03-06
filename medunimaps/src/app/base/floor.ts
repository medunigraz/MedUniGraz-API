
export class Floor {
  id: number;
  name: string;
  building: number;

  floorAbove: number = -1;
  floorBelow: number = -1;

  constructor(obj: any) {
    //console.log("Create new floor: " + JSON.stringify(obj));
    this.id = obj["id"];
    this.name = obj["name"];
    this.building = obj["building"];
  }

  public static getDefaultFloor(): Floor {
    return new Floor({
      "id": -1,
      "name": "EG",
      "building": 1
    })
  }
}
