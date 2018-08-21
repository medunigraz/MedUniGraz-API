import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';
import ol_style_Circle from 'ol/style/Circle';

export class MapNodesStyles {

  private static higlightImage: any = new ol_style_Circle({
    radius: 7,
    fill: null,
    stroke: new ol_style_Stroke({ color: 'red', width: 3 })
  });

  public static higlightStyle: any = new ol_style_Style({
    image: MapNodesStyles.higlightImage
  })


  public static DefaultNodeImage = new ol_style_Circle({
    radius: 5,
    fill: null,
    stroke: new ol_style_Stroke({ color: 'black', width: 2 })
  });

  public static DefaultNodeStyle: any = new ol_style_Style({
    image: MapNodesStyles.DefaultNodeImage
  })


  public static VirtualNodeImage = new ol_style_Circle({
    radius: 5,
    fill: null,
    stroke: new ol_style_Stroke({ color: 'green', width: 2 })
  });

  public static VirtualNodeStyle: any = new ol_style_Style({
    image: MapNodesStyles.VirtualNodeImage
  })

  public static PoiNodeImage = new ol_style_Circle({
    radius: 5,
    fill: null,
    stroke: new ol_style_Stroke({ color: 'red', width: 2 })
  });

  public static PoiNodeStyle: any = new ol_style_Style({
    image: MapNodesStyles.PoiNodeImage
  })


}
