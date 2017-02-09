import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { MapService } from '../mapservice/map.service';

import { Room } from '../base/room';

@Component({
  selector: 'app-roomsearch',
  templateUrl: './roomsearch.component.html',
  styleUrls: ['./roomsearch.component.css']
})
export class RoomsearchComponent implements OnInit {

  rooms: Observable<Room[]>;
  private searchTerms = new Subject<string>();

  currentSearchTerm = "";

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.rooms = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous 
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.mapService.searchRoom(term)
        // or the observable of empty rooms if no search term
        : Observable.of<Room[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Room[]>([]);
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectRoom(room: Room): void {
    console.log('Select Room: ' + room.id + '#' + room.name);

    this.currentSearchTerm = "";
    this.searchTerms.next(this.currentSearchTerm);
  }

}
