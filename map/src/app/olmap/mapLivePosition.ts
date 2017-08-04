import { MapLayerBase } from './mapLayerBase';
import { OpenlayersHelper } from './openlayershelper';
import { MapService } from '../mapservice/map.service';

import {Position} from '../base/position';

import {OlmapComponent} from './olmap.component';

declare var ol: any;

export class MapLivePosition extends MapLayerBase {

  private circle: any;
  private circleFeature: any;

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

    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 3
      })
    }));

    //this.circle = new ol.geom.Circle([0, 0], 0.5);
    //this.circle = new ol.geom.Point([1722184.2450872045, 5955256.38138703]);
    this.circle = new ol.geom.Point([0, 0]);
    this.circleFeature = new ol.Feature(this.circle);

    this.layerSource = res.layerSource;
    this.layer = res.layer;
  }

  public setMap(map: any) {
    //this.listenerKey = map.on('postcompose', this.animate);
    //map.on('postcompose', evt => this.animate(evt, this));
    this.map = map;
  }

  public setCurrentLevel(newLevel: number) {
    this.clear();
    this.currentLevelId = newLevel;
    this.stopAnimation();
  }

  public showLivePosition(livePos: Position) {
    //console.log("MapLivePosition::showLivePosition..." + JSON.stringify(livePos));

    if (!livePos || this.currentLevelId != livePos.level) {
      this.clear();
      this.positionVisible = false;
      this.stopAnimation();
    }
    else {
      if (!this.positionVisible) {
        this.AddPositionFeature();
      }
      //this.circle.setCenter([livePos.x, livePos.y]);
      this.circle.setCoordinates([livePos.x, livePos.y]);

      if (this.startTime < 0) {
        this.startAnimation();
      }
    }
  }

  private startAnimation() {

    if (!this.map) {
      return;
    }

    if (this.listenerKey) {
      this.stopAnimation();
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
    console.log("MapLivePosition::update Route");
  }

  private AddPositionFeature() {
    this.layerSource.addFeature(this.circleFeature);
    this.positionVisible = true;
  }

  //private animate(evt: any, obj: MapLivePosition) {
  private animate(evt: any) {
    if (this.map && this.startTime > 0) {

      let duration = 2000;

      let vectorContext = evt.vectorContext;
      let frameState = evt.frameState;
      let flashGeom = this.circleFeature.getGeometry().clone();


      let elapsed = (frameState.time - this.startTime) % duration;
      let elapsedRatio = elapsed / duration;
      // radius will be 0.5 at start and 5 at end.
      let radius = ol.easing.easeOut(elapsedRatio) * 50 + 15;
      let opacity = ol.easing.easeOut(1 - elapsedRatio);

      let style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new ol.style.Stroke({
            color: 'rgba(81, 174, 50, ' + opacity + ')',
            width: 8 + opacity * 8
          })
        })
      });

      console.log("MapLivePosition::Animate + " + this.startTime + " Radius: " + radius + " opacity: " + opacity + " Pos: ");// + JSON.stringify(this.circleFeature.getGeometry().getCenter()));

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);

      this.map.render();
    }
  }
}
