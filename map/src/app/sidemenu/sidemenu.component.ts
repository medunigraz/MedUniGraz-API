import { Component, OnInit } from '@angular/core';

import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set updateSideMenu(open: boolean) {
    console.log("SidemenuComponent::updateSideMenu - Open: " + open);
  }

}
