export class Room {
  id: number;
  text: string;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }

  public static GetRoomTxt(title: string, fullname: string): string {
    return title + '<br />(' + fullname + ')';
  }
}
