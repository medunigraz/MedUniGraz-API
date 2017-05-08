import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { PoiType } from '../base/poitype';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';

@Component({
  selector: 'app-poiselector',
  templateUrl: './poiselector.component.html',
  styleUrls: ['./poiselector.component.css']
})
export class PoiselectorComponent implements OnInit {

  pois: PoiType[] = null;
  showControl: boolean = false;
  selectedPoiType: PoiType = null;

  @Output() currentSelectedPoiEvt = new EventEmitter<PoiType>();
  @Output() poiTypeReceivedEvt = new EventEmitter<PoiType[]>();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.updateData();
  }

  public updateData(): any {

    this.mapService.getPoiTypes().subscribe(
      poiTypes => this.updatePois(poiTypes),
      error => console.log("ERROR deleteNode: " + <any>error));
  }

  onSelect(poi: PoiType): void {
    this.selectPoi(poi);
  }

  updatePois(poilist: PoiType[]) {
    this.pois = poilist;
    if (this.pois.length > 0) {
      this.showControl = true;
      this.selectPoi(this.pois[0]);
    }

    this.poiTypeReceivedEvt.emit(this.pois);
  }

  private selectPoi(poi: PoiType) {
    this.selectedPoiType = poi;
    this.currentSelectedPoiEvt.emit(this.selectedPoiType);
  }

}
