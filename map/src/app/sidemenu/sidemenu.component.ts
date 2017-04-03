import { Component, OnInit } from '@angular/core';

import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

import {Poi} from '../base/poi';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  private pois: Poi[] = Poi.getDemoData();

  constructor() { }

  ngOnInit() {

  }

  updatePOIs() {
    console.log("SidemenuComponent::updatePOIs() " + JSON.stringify(this.pois));
  }

  close() {
    console.log("SidemenuComponent::close()");
  }
}
