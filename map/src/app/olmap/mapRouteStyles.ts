declare var ol: any;

export class MapRouteStyles {
  public static routeCurrentFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 5
    })
  });


  public static routeHiddenFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 5,
      lineDash: [3, 7]
    })
  });

}
