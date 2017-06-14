export class Position {
  public x: number;
  public y: number;
  public level: number;
  public urlString: string;

  constructor(x: number, y: number, level: number, urlString: string) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.urlString = urlString;
  }
}
