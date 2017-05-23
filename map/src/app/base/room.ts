export class Room {
  id: number;
  text: string;
  level: number;

  constructor(id: number, text: string, level: number) {
    this.id = id;
    this.text = text;
    this.level = level;
  }

  public static GetRoomTxt(title: string, fullname: string): string {
    return title + '<br />(' + fullname + ')';
  }

  public static GetRoomTxtSearch(title: string, fullname: string): string {
    return title + ' (' + fullname + ')';
  }

  public static createFromRestObj(obj: any) {
    let prop = obj["properties"];
    let co = prop["campusonline"];
    let room = new Room(obj["id"], Room.GetRoomTxtSearch(co["title"], co["name_full"]), prop["level"]);

    //console.log("Room created LEvel: " + prop["level"]);
    //console.log("Room created: " + JSON.stringify(room));
    return room;
  }
}
