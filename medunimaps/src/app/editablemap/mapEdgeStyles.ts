
import { EdgeWeight } from '../base/edgeweight';


import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';

export class MapEdgeStyles {

  private static defaultStyle: any = new ol_style_Style({
    stroke: new ol_style_Stroke({
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
        this.styles.push(new ol_style_Style({
          stroke: new ol_style_Stroke({
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
