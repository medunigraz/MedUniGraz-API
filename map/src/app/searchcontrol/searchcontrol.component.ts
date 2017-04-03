import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs';

import { OlmapComponent} from '../olmap/olmap.component';

import {SearchResult} from '../base/searchresult';

@Component({
  selector: 'app-searchcontrol',
  templateUrl: './searchcontrol.component.html',
  styleUrls: ['./searchcontrol.component.css']
})
export class SearchcontrolComponent implements OnInit {

  @Input()
  mapComponentRef: OlmapComponent;

  private searchResults: SearchResult[];
  private showResults: boolean = false;
  private searchTerms = new Subject<string>();
  private term = new FormControl();

  @Output() openSideMenuEvt = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.search(term))
      .subscribe(items => this.searchUpdateResults(items));
  }

  search(term: string): Observable<SearchResult[]> {
    console.log('SearchComponent::search:' + term);
    if (term.length == 0) {
      return Observable.of([]);
    }
    if (term.length == 1) {
      return Observable.of([new SearchResult(0, "Hörsaal 1 (MC1.A.EG.001)", 0),
        new SearchResult(1, "Dr. Igor Tester", 1),
        new SearchResult(2, "Institut für Physiologische Chemie", 2),
        new SearchResult(3, "Hörsaal 4 (MC1.A.EG.004)", 0),
        new SearchResult(4, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
    }
    return Observable.of([new SearchResult(5, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }

  searchUpdateResults(items: SearchResult[]) {
    console.log('searchResults: ');
    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    this.showResults = items.length > 0;
    this.searchResults = items;
  }

  select(selected: SearchResult) {
    console.log('SearchComponent::select:' + selected.text);
    this.mapComponentRef.showRoom(selected.id);
    this.term.setValue(selected.text, { "emitEvent": false });
    this.searchUpdateResults([]);
  }

  route(selected: SearchResult) {
    console.log('SearchComponent::route:' + selected.text);
    this.mapComponentRef.showRoute(selected.id, selected.id);
    this.term.setValue(selected.text, { "emitEvent": false });
    this.searchUpdateResults([]);
  }

  openSideMenu() {
    console.log("SearchcontrolComponent::openSideMenu()")
    this.openSideMenuEvt.emit(true);
  }

}
