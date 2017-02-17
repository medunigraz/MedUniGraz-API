import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { ApplicationMode, ApplicationModes } from '../base/applicationmode';

@Component({
  selector: 'app-modeselector',
  templateUrl: './modeselector.component.html',
  styleUrls: ['./modeselector.component.css']
})
export class ModeselectorComponent implements OnInit {

  modes = ApplicationModes;

  currentAppMode: ApplicationMode;
  @Output() currentAppModeEvt = new EventEmitter<ApplicationMode>();

  constructor() {
  }

  ngOnInit() {
  }

  modechanged(mode: ApplicationMode): void {
    //console.log("ModeselectorComponent Mode changed: " + mode.name);
    this.currentAppMode = mode;
    this.currentAppModeEvt.emit(this.currentAppMode);
  }
}
