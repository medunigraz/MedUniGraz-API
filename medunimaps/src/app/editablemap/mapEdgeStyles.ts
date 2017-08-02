
import { EdgeWeight } from '../base/edgeweight';


declare var ol: any;

export class MapEdgeStyles {

  private static defaultStyle: any = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 4,
      lineDash: [4, 8]
    })
  });

  private static stylesInitialized: boolean = false;

  private static edgeWeights: EdgeWeight[] = [];
  private static styles: any[] = [];

  public static InitStyles(weights: EdgeWeight[]) {

    if (weights) {
      for (let i = 0; i < weights.length; i++) {
        this.edgeWeights.push(weights[i]);
        this.styles.push(new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: weights[i].color,
            width: 4,
            lineDash: [4, 8]
          })
        }));
      }
      this.stylesInitialized = true;
      console.log("MapEdgeStyles::InitStyles Styles initialized!!!");
    }
  }

  public static GetStyle(weightId: number) {
    if (MapEdgeStyles.stylesInitialized) {
      for (let i = 0; i < MapEdgeStyles.edgeWeights.length; i++) {
        if (MapEdgeStyles.edgeWeights[i].id == weightId) {
          return MapEdgeStyles.styles[i];
        }
      }
    }

    return MapEdgeStyles.defaultStyle;
  }
}
