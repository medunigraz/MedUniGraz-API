
export class Floor {
  id: number;
  name: string;
  building: number;

  constructor(obj: any) {
    //console.log("Create new floor: " + JSON.stringify(obj));
    this.id = obj["id"];
    this.name = obj["name"];
    this.building = obj["building"];
  }
}
