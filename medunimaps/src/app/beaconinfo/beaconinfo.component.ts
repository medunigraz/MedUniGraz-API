import { Component, OnInit, EventEmitter, NgZone, Input, Output } from '@angular/core';
import { Beacon } from '../base/beacon';

@Component({
  selector: 'app-beaconinfo',
  templateUrl: './beaconinfo.component.html',
  styleUrls: ['./beaconinfo.component.css']
})
export class BeaconinfoComponent implements OnInit {

  showControl: boolean = false;

  beaconname: string = "";

  private selectedBeacon: Beacon = null;

  @Output() deleteBeaconEvent = new EventEmitter<Beacon>();

  constructor() { }

  ngOnInit() {
  }

  public setSelectedBeacon(selectedBeacon: Beacon) {
    this.selectedBeacon = selectedBeacon;

    if (this.selectedBeacon) {
      this.showControl = true;
      this.beaconname = this.selectedBeacon.name;
    }
    else {
      this.beaconname = "";
      this.showControl = false;
    }
  }

  public deleteButtonClicked() {
    if (this.selectedBeacon) {
      console.log("BeaconinfoComponent::deleteButtonClicked: " + this.selectedBeacon.id);
      this.deleteBeaconEvent.emit(this.selectedBeacon);
    }
  }

}
