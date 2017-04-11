import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs';

import { OlmapComponent} from '../olmap/olmap.component';

import {SearchResult} from '../base/searchresult';
import {DefaultStartPointWithPos, DefaultStartPoint} from './searchcontrolconstants';


@Component({
  selector: 'app-searchcontrol',
  templateUrl: './searchcontrol.component.html',
  styleUrls: ['./searchcontrol.component.css']
})
export class SearchcontrolComponent implements OnInit {

  @Input()
  mapComponentRef: OlmapComponent;

  isRoutingSearchBox: boolean = false;

  private searchResults: SearchResult[];
  private searchResultsFrom: SearchResult[];
  private searchResultsTo: SearchResult[];

  private currentResult: SearchResult = null;
  private currentStartPointResult: SearchResult = null;

  private showResults: boolean = false;
  private searchTerms = new Subject<string>();

  private term = new FormControl();
  private startPointTerm = new FormControl();

  @Output() openSideMenuEvt = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.search(term))
      .subscribe(items => this.searchUpdateResults(items));

    this.startPointTerm.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.searchStartPoint(term))
      .subscribe(items => this.searchUpdateResultsStartPoint(items));
  }

  search(term: string): Observable<SearchResult[]> {
    console.log('SearchComponent::search:' + term);
    this.currentResult = null;
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
    return Observable.of([new SearchResult
      (5, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }

  searchStartPoint(term: string): Observable<SearchResult[]> {
    console.log('SearchComponent::searchStartPoint:' + term);
    this.currentStartPointResult = null;
    if (term.length == 0) {
      return Observable.of([DefaultStartPointWithPos,
        DefaultStartPoint])
    };
    if (term.length == 1) {
      return Observable.of([new SearchResult(0, "Aktueller Standort", 0),
        new SearchResult(1, "Haupteingang", 1),
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
    this.searchResultsTo = items;

    this.doShowResults(this.searchResultsTo); //TODO;
  }

  searchUpdateResultsStartPoint(items: SearchResult[]) {
    console.log('searchResults Start Point: ');

    for (let i = 0; i < items.length; i++) {
      items[i].isStartPoint = true;
    }

    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    this.searchResultsFrom = items;
  }

  select(selected: SearchResult) {
    console.log('SearchComponent::select:' + selected.text + " Start?=" + selected.isStartPoint);
    if (!selected.isStartPoint) {
      this.currentResult = selected;
      this.showCurrentResult();

    }
    else {
      this.currentStartPointResult = selected;
    }
  }

  route(selected: SearchResult) {
    console.log('SearchComponent::route:' + selected.text);
    this.mapComponentRef.showRoute(selected.id, selected.id);
    this.term.setValue(selected.text, { "emitEvent": false });
    this.searchUpdateResults([]);

    if (this.currentStartPointResult == null) {
      this.currentStartPointResult = DefaultStartPointWithPos;
    }
    this.showCurrentStartResult();
    this.isRoutingSearchBox = true;
  }

  openSideMenu() {
    console.log("SearchcontrolComponent::openSideMenu()")
    this.openSideMenuEvt.emit(true);
  }

  searchBtnClicked() {
    this.search(this.term.value);
  }

  closeBtnClicked() {
    this.term.setValue("");
    this.startPointTerm.setValue("");
    this.isRoutingSearchBox = false;
  }

  private showCurrentResult() {
    if (this.currentResult != null) {
      this.mapComponentRef.showRoom(this.currentResult.id, this.currentResult.text);
      this.term.setValue(this.currentResult.text, { "emitEvent": false });
      this.searchUpdateResults([]);
    }
  }

  private showCurrentStartResult() {
    if (this.currentStartPointResult != null) {
      this.startPointTerm.setValue(this.currentStartPointResult.text, { "emitEvent": false });
      this.searchUpdateResultsStartPoint([]);
    }
  }

  private doShowResults(items: SearchResult[]) {
    if (items != null) {
      this.showResults = items.length > 0;
      this.searchResults = items;
    }
  }

}
