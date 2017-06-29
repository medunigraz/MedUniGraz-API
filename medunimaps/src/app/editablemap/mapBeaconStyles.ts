declare var ol: any;

export class MapBeaconStyles {

  private static circle: any = new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: 'black'
    }),
    stroke: new ol.style.Stroke({ color: 'black', width: 1 })
  });

  private static style: any = new ol.style.Style({
    image: MapBeaconStyles.circle
  });

  private static maxSignalValue: number = -50;
  private static minSignalValue: number = -90;


  private static styles: any[] = [];

  constructor() {
  }

  public static InitStyles() {
    for (let i = 0; i <= MapBeaconStyles.getMaxIndex(); i++) {
      let r = MapBeaconStyles.getRValue(i);
      let g = MapBeaconStyles.getGValue(i);
      let color = 'rgba(' + r + ',' + g + ',0,1)'
      //console.log("MapBeaconStyles::InitStyles   " + color);

      let circle: any = new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: color
        }),
        stroke: new ol.style.Stroke({ color: 'black', width: 1 })
      });

      let style: any = new ol.style.Style({
        image: circle
      });

      MapBeaconStyles.styles.push(style);
    }
  }

  public static GetStyle(signalValue: number) {

    if (!signalValue) {
      return MapBeaconStyles.style;
    }

    if (signalValue < MapBeaconStyles.minSignalValue) {
      return MapBeaconStyles.style;
    }
    if (signalValue > MapBeaconStyles.maxSignalValue) {
      signalValue = MapBeaconStyles.maxSignalValue
    }

    let index = MapBeaconStyles.getIndex(signalValue);
    //console.log("MapBeaconStyles::GetStyle   " + index);
    return MapBeaconStyles.styles[index];
  }

  private static getIndex(value) {
    return Math.floor(value - MapBeaconStyles.minSignalValue);
  }

  private static getMaxIndex() {
    return (MapBeaconStyles.maxSignalValue - MapBeaconStyles.minSignalValue);
  }

  private static getHalfIndex() {
    return MapBeaconStyles.getMaxIndex() / 2.0;
  }

  private static getRValue(index) {
    if (index <= MapBeaconStyles.getHalfIndex()) {
      return 255;
    }
    let val = MapBeaconStyles.getMaxIndex() - index;
    return Math.floor((val / MapBeaconStyles.getHalfIndex()) * 255);
  }

  private static getGValue(index) {
    if (index >= MapBeaconStyles.getHalfIndex()) {
      return 255;
    }
    return Math.floor((index / MapBeaconStyles.getHalfIndex()) * 255);
  }
}
