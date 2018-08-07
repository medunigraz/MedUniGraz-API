//import * as ol from '../../../node_modules/ol';
//TODO
//declare var ol: any;

import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';

export class MapRouteStyles {
  public static routeCurrentFloor: any = new ol_style_Style({
    stroke: new ol_style_Stroke({
      color: '#ff7700',
      width: 6
    })
  });


  public static routeHiddenFloor: any = new ol_style_Style({
    stroke: new ol_style_Stroke({
      color: '#ff7700',
      width: 6,
      lineDash: [4, 8]
    })
  });

}
