declare var ol: any;

export class MapNodesStyles {

  private static higlightImage: any = new ol.style.Circle({
    radius: 7,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 3 })
  });

  public static higlightStyle: any = new ol.style.Style({
    image: MapNodesStyles.higlightImage
  })


  public static DefaultNodeImage = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'black', width: 2 })
  });

  public static DefaultNodeStyle: any = new ol.style.Style({
    image: MapNodesStyles.DefaultNodeImage
  })


  public static VirtualNodeImage = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'green', width: 2 })
  });

  public static VirtualNodeStyle: any = new ol.style.Style({
    image: MapNodesStyles.VirtualNodeImage
  })

}
