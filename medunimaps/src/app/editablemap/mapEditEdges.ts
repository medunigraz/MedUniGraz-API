import { MapService } from '../mapservice/map.service';
import { USEHTTPSERVICE } from '../base/globalconstants';

import { ApplicationMode } from '../base/applicationmode';
import { ApplicationModeT } from '../base/applicationmode';

import { OpenlayersHelper } from './openlayershelper';
import { MapNodesStyles } from './mapNodesStyles';

declare var ol: any;

export class MapEditEdges {
  private layer: any;
  private layerSource: any;

  private multiLineFeature: any;
  private multiLineString: any;
  private lineAr: any[];

  private startPosition: number[] = null;

  constructor(private mapService: MapService) {
    this.Initialize();
  }

  private Initialize(): void {
    let res = OpenlayersHelper.CreateBasicLayer(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'gray',
        width: 1
      })
    }));
    this.layerSource = res.layerSource;
    this.layer = res.layer;

    this.lineAr = [];
    this.multiLineString = new ol.geom.MultiLineString(this.lineAr);

    this.multiLineFeature = new ol.Feature({
      geometry: this.multiLineString,
      name: 'Lines'
    });

    this.layerSource.addFeature(this.multiLineFeature);

    //this.setNewLine([1722194.7183594021, 5955141.12279422], [1722055.5790813519, 5955315.494764996]);

  }

  public setNewStartPos(p: number[]) {
    this.startPosition = p;
  }

  public setNewEndPos(p: number[]) {
    if (this.startPosition != null) {
      this.lineAr = [];
      this.lineAr.push([this.startPosition, p]);
      this.multiLineString.setCoordinates(this.lineAr);
    }
  }

  public clear() {
    this.startPosition = null;
    this.lineAr = [];
    this.multiLineString.setCoordinates(this.lineAr);
  }

  public setNewLine(p1: number[], p2: number[]) {
    console.log("MapEditEdges::setNewLine - ");

    this.lineAr = [];
    this.lineAr.push([p1, p2]);
    this.multiLineString.setCoordinates(this.lineAr);
  }

  public getLayer(): any {
    return this.layer;
  }

}
