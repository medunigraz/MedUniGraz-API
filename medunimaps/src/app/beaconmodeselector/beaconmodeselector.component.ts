import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { BeaconEditMode, BeaconEditModes } from '../base/beaconeditmode';
import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';

@Component({
  selector: 'app-beaconmodeselector',
  templateUrl: './beaconmodeselector.component.html',
  styleUrls: ['./beaconmodeselector.component.css']
})
export class BeaconmodeselectorComponent implements OnInit {

  modes: BeaconEditMode[] = BeaconEditModes;
  showControl: boolean = true;
  selectedMode: BeaconEditMode = BeaconEditMode.CreateDefault();

  @Output() currentSelectedModeEvt = new EventEmitter<BeaconEditMode>();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {
    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }
  }

  onSelect(mode: BeaconEditMode): void {
    this.selectMode(mode);
  }

  private selectMode(mode: BeaconEditMode) {
    this.selectedMode = mode;
    this.currentSelectedModeEvt.emit(this.selectedMode);
  }
}
