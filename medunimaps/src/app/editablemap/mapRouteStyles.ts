import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';

export class MapRouteStyles {
  public static routeCurrentFloor: any = new ol_style_Style({
    stroke: new ol_style_Stroke({
      color: 'green',
      width: 5
    })
  });


  public static routeHiddenFloor: any = new ol_style_Style({
    stroke: new ol_style_Stroke({
      color: 'green',
      width: 5,
      lineDash: [3, 7]
    })
  });

}
