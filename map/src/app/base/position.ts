export class Position {
  public x: number;
  public y: number;
  public level: number;
  public urlString: string;
  public feature: any;

  constructor(x: number, y: number, level: number, urlString: string, feature: any) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.urlString = urlString;
    this.feature = feature;
  }
}
