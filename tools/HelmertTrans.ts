import {Point} from './Point'

export  class HelmertTrans
{
  basex: number = 1722130.949;
  basey: number = 5955420.891;

  a1: number = 0.215704;
  b1: number = -0.109056;

  constructor()
  {
  }

  transformPoint(p: Point) : Point
  {
    var newPoint = new Point();
    newPoint.x = this.basex + this.a1 * p.x - this.b1 * p.y;
    newPoint.y = this.basey + this.b1 * p.x + this.a1 * p.y;
    return newPoint;
  }
}
