export class Position {
  public x: number;
  public y: number;
  public level: number;
  public urlString: string;
  //public feature: any;

  public nodeid: number;
  public edgeid: number;
  public edgecoords: number[][];


  constructor(urlString: string, feature: any) {

    let coords = feature.geometry.coordinates;
    let prop = feature.properties;

    this.x = coords[0];
    this.y = coords[1];
    this.level = prop.level;
    this.urlString = urlString;
    //this.feature = feature;

    this.nodeid = feature.properties.node;
    this.edgeid = feature.properties.edge;
    this.edgecoords = feature.properties.path.geometry.coordinates;
  }
}
