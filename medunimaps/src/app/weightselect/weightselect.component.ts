import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';

import { EdgeWeight } from '../base/edgeweight';

@Component({
  selector: 'app-weightselect',
  templateUrl: './weightselect.component.html',
  styleUrls: ['./weightselect.component.css']
})
export class WeightselectComponent implements OnInit {

  weights: EdgeWeight[] = null;
  showControl: boolean = false;
  selectedWeight: EdgeWeight = null;

  @Output() currentSelectedWeightEvt = new EventEmitter<EdgeWeight>();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.updateData();
  }

  public updateData(): any {

    this.updateWeights([new EdgeWeight({
      "id": 1,
      "name": "Standard",
      "weight": "1.0"
    }),
      new EdgeWeight({
        "id": 2,
        "name": "Durchgang",
        "weight": "2.5"
      })]);

    /*
    this.mapService.getEdgeWeightTypes().subscribe(
      poiTypes => this.updateWeights(poiTypes),
      error => console.log("ERROR deleteNode: " + <any>error));*/
  }

  onSelect(weight: EdgeWeight): void {
    this.selectWeight(weight);
  }

  updateWeights(weightlist: EdgeWeight[]) {
    this.weights = weightlist;
    console.log("WeightselectComponent::updateWeights " + JSON.stringify(weightlist));
    if (this.weights.length > 0) {

      this.selectWeight(this.weights[0]);
      this.showControl = true;
    }
  }

  private selectWeight(weight: EdgeWeight) {
    this.selectedWeight = weight;
    this.currentSelectedWeightEvt.emit(this.selectedWeight);
  }

}
