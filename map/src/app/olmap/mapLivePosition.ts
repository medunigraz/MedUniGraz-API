import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapService } from '../mapservice/map.service';

import { Position } from '../base/position';

import { OlmapComponent } from './olmap.component';

import { Logger } from '../base/logger';

import ol_style_Style from 'ol/style/Style';
import ol_style_Stroke from 'ol/style/Stroke';
import ol_style_Fill from 'ol/style/Fill';

import ol_geom_Circle from 'ol/geom/Circle';
import ol_Feature from 'ol/Feature';
import ol_geom_Point from 'ol/geom/Point';

declare var ol: any;

export class MapLivePosition extends MapLayerBase {

  private circle: any;
  private circleFeature: any;
  private point: any;
  private pointFeature: any;

  private positionVisible: boolean = false;

  private currentLevelId: number = -1;

  private startTime = -1;
  //private listenerKey: any = null;

  private map: any = null;
  private listenerKey: any = null;

  constructor(private mapService: MapService) {
    super();
    this.Initialize();
  }

  private Initialize(): void {

    let res = OpenlayersHelper.CreateBasicLayer(new ol_style_Style({
      fill: new ol_style_Fill({
        color: 'rgba(255, 119, 0, 0.5)'
      }),
      stroke: new ol_style_Stroke({
        color: 'rgba(255, 119, 0, 1)',
        width: 3
      })
    }));

    this.circle = new ol_geom_Circle([0, 0], 1);
    //this.circle = new ol.geom.Point([1722184.2450872045, 5955256.38138703]);
    this.circleFeature = new ol_Feature(this.circle);

    this.point = new ol_geom_Point([0, 0]);
    this.pointFeature = new ol_Feature(this.point);

    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public setMap(map: any) {
    this.map = map;
  }

  public setCurrentLevel(newLevel: number) {
    this.clear();
    this.positionVisible = false;
    this.currentLevelId = newLevel;
    //this.stopAnimation();
  }

  public showLivePosition(livePos: Position) {
    //Logger.log("MapLivePosition::showLivePosition..." + this.currentLevelId + "###" + JSON.stringify(livePos));

    if (!livePos || this.currentLevelId != livePos.level) {
      this.clear();
      this.positionVisible = false;
      //this.stopAnimation();
    }
    else {
      Logger.log("MapLivePosition::showLivePosition: " + this.positionVisible);
      if (!this.positionVisible) {
        this.AddPositionFeature();
      }
      this.circle.setCenter([livePos.x, livePos.y]);
      this.point.setCoordinates([livePos.x, livePos.y]);

      if (this.startTime < 0) {
        //this.startAnimation();
      }
    }
  }

  private startAnimation() {

    if (!this.map) {
      return;
    }

    if (this.listenerKey) {
      //this.stopAnimation();
    }

    this.listenerKey = this.map.on('postcompose', evt => this.animate(evt));
    this.startTime = Date.now();
  }

  private stopAnimation() {
    if (!this.map) {
      return;
    }

    this.startTime = -1;
    ol.Observable.unByKey(this.listenerKey);
    this.listenerKey = null;
  }

  private updateRoute(route: any) {
    Logger.log("MapLivePosition::update Route");
  }

  private AddPositionFeature() {
    this.layerSource.addFeature(this.circleFeature);
    this.layerSource.addFeature(this.pointFeature);
    this.positionVisible = true;
  }

  //private animate(evt: any, obj: MapLivePosition) {
  private animate(evt: any) {
    if (this.map && this.startTime > 0) {

      let duration = 2000;

      let vectorContext = evt.vectorContext;
      let frameState = evt.frameState;
      let flashGeom = this.pointFeature.getGeometry().clone();


      let elapsed = (frameState.time - this.startTime) % duration;
      let elapsedRatio = elapsed / duration;
      // radius will be 0.5 at start and 5 at end.
      let radius = ol.easing.easeOut(elapsedRatio) * 50 + 15;
      let opacity = ol.easing.easeOut(1 - elapsedRatio);

      let style = new ol_style_Style({
        image: new ol_geom_Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new ol_style_Stroke({
            color: 'rgba(81, 174, 50, ' + opacity + ')',
            width: 8 + opacity * 8
          })
        })
      });

      //Logger.log("MapLivePosition::Animate + " + this.startTime + " Radius: " + radius + " opacity: " + opacity + " Pos: ");// + JSON.stringify(this.circleFeature.getGeometry().getCenter()));

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);

      this.map.render();
    }
  }
}
