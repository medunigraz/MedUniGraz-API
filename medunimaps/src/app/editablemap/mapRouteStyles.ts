declare var ol: any;

export class MapRouteStyles {
  public static routeCurrentFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 3
    })
  });


  public static routeHiddenFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 3,
      lineDash: [3, 2]
    })
  });

}
