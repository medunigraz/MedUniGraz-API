declare var ol: any;

export class MapRouteStyles {
  public static routeCurrentFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#ff7700',
      width: 6
    })
  });


  public static routeHiddenFloor: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#ff7700',
      width: 6,
      lineDash: [4, 8]
    })
  });

}
