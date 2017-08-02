export class EdgeWeight {

  id: number;
  name: string;
  weight: number;
  color: string;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.weight = obj["weight"];

    if (this.id == 1) {
      this.color = "#000000";
    }
    else if (this.id == 2) {
      this.color = "#FF8800";
    }
    else {
      this.color = "#AAAAAAA";
    }

  }
}
