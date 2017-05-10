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
}
