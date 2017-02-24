import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { MapService } from '../mapservice/map.service';
import { MapHttpService } from '../mapservicehttp/mapservicehttp.service';

import { USEHTTPSERVICE } from '../base/globalconstants';

import { Room } from '../base/room';


@Component({
  selector: 'app-roomsearchmd',
  templateUrl: './roomsearchmd.component.html',
  styleUrls: ['./roomsearchmd.component.css']
})
export class RoomsearchmdComponent implements OnInit {

  rooms: Room[];
  showsuggestions: boolean = false;
  private searchTerms = new Subject<string>();

  currentSearchTerm = "";
  term = new FormControl();

  constructor(private mapServiceHttp: MapHttpService,
    private mapService: MapService) { }

  ngOnInit() {

    if (USEHTTPSERVICE) {
      this.mapService = this.mapServiceHttp;
    }

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
