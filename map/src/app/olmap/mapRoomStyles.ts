declare var ol: any;

export class MapRoomStyles {

  constructor() {
    this.InitStyles();
  }

  private defaultStyle = new ol.style.Style({
    /*stroke: new ol.style.Stroke({
      color: 'red',
      width: 0
    }),*/
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,1)'
    })
  });

  private styles: any[] = [];
  private highlightStyles: any[] = [];
  private selectedStyles: any[] = [];

  public getStyleForRoom(id: number, isHighlighted: boolean, isSelected: boolean): any {

    if (id % 6 == 0) {
      return this.styles[0];
    }
    if (id % 6 == 1) {
      return this.styles[1];
    }
    if (id % 6 == 2) {
      return this.highlightStyles[0];
    }
    if (id % 6 == 3) {
      return this.highlightStyles[1];
    }
    if (id % 6 == 4) {
      return this.selectedStyles[0];
    }
    if (id % 6 == 5) {
      return this.selectedStyles[1];
    }
    return this.defaultStyle;
  }

  private InitStyles() {
    this.AddColor([164, 64, 255]);
    this.AddColor([64, 164, 255]);
  }

  private AddColor(color: number[]) {

    let style = new ol.style.Style();

    let selectedStyle = new ol.style.Style();

    let fillStyle = new ol.style.Fill();
    fillStyle.setColor(color);
    style.setFill(fillStyle);

    this.styles.push(style);
    this.highlightStyles.push(this.GetHighlightStyle(color));
    this.selectedStyles.push(this.GetSelectedStyle(color));
  }

  private GetHighlightStyle(color: number[]): any {
    let style = new ol.style.Style();
    let fillStyle = new ol.style.Fill();

    fillStyle.setColor(this.GetLighterColor(color, 1.2));
    style.setFill(fillStyle);

    return style;
  }

  private GetSelectedStyle(color: number[]): any {
    let style = new ol.style.Style();

    let fillStyle = new ol.style.Fill();
    fillStyle.setColor(this.GetLighterColor(color, 1.2));
    style.setFill(fillStyle);

    let strokeStyle = new ol.style.Stroke({
      color: 'black',
      width: 5
    });
    strokeStyle.setColor(this.GetLighterColor(color, 0.8));
    style.setStroke(strokeStyle);

    return style;
  }

  private GetLighterColor(color: number[], factor: number): number[] {
    let newColor = [];

    if (color.length < 3) {
      return color;
    }

    newColor.push(this.Limit(color[0] * factor, 0, 255));
    newColor.push(this.Limit(color[1] * factor, 0, 255));
    newColor.push(this.Limit(color[2] * factor, 0, 255));

    return newColor;
  }

  private Limit(value: number, min: number, max: number) {
    if (value < min) {
      return min;
    }
    else if (value > max) {
      return max;
    }
    return value;
  }

}
