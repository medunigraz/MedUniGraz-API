import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import {MdMenuTrigger} from '@angular/material';

import { MapService } from '../mapservice/map.service';

import { Room } from '../base/room';


@Component({
  selector: 'app-roomsearchmd',
  templateUrl: './roomsearchmd.component.html',
  styleUrls: ['./roomsearchmd.component.css']
})
export class RoomsearchmdComponent implements OnInit {
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;

  rooms: Room[];
  showsuggestions: boolean = false;
  private searchTerms = new Subject<string>();

  currentSearchTerm = "";
  term = new FormControl();

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.mapService.searchRoom(term))
      .subscribe(items => this.searchResults(items));
  }

  searchResults(items: Room[]) {
    console.log('searchResults: ');
    this.rooms = items;

    this.showsuggestions = this.rooms.length > 0;
    console.log('Showsuggestions: ' + this.showsuggestions);

    if (this.rooms.length > 0) {
      this.trigger.openMenu();
    }
    else {
      //this.trigger.closeMenu();
    }
  }

  log(logstring: string) {
    console.log('log: ' + logstring);
  }

  selectRoom(room: Room): void {
    console.log('Select Room: ' + room.id + '#' + room.name);

    this.currentSearchTerm = "";
    this.searchTerms.next(this.currentSearchTerm);
  }

}
