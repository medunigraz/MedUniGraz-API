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
  @Output() edgeWeightsReceivedEvt = new EventEmitter<EdgeWeight[]>();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

    this.updateData();
  }

  public updateData(): any {



    this.mapService.getEdgeWeightTypes().subscribe(
      poiTypes => this.updateWeights(poiTypes),
      error => this.onUpdateError(error));
  }

  private onUpdateError(error) {
    console.log("ERROR deleteNode: " + <any>error)
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

    this.edgeWeightsReceivedEvt.emit(this.weights);
  }

  private selectWeight(weight: EdgeWeight) {
    this.selectedWeight = weight;
    this.currentSelectedWeightEvt.emit(this.selectedWeight);
  }

}
