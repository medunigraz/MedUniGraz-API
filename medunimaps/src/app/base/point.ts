export class Point {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  public createFromAr(ar: number[]) {
    this.x = ar[0];
    this.y = ar[1];
  }

  public getAr() {
    return [this.x, this.y];
  }

}
