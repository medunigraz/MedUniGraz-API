declare var ol: any;

export class MapNodesStyles {

  private static higlightImage: any = new ol.style.Circle({
    radius: 6,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 3 })
  });

  public static higlightStyle: any = new ol.style.Style({
    image: MapNodesStyles.higlightImage
  })

}
