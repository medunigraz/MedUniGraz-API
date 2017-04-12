import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

import { OlmapComponent} from '../olmap/olmap.component';

import {SearchResult} from '../base/searchresult';
import {DefaultStartPointWithPos, DefaultStartPoint} from './searchcontrolconstants';


export enum FocusStatus {
  NONE = 1,
  SEARCH = 2,
  START = 3
}

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

  private currentFocusStatus: FocusStatus = FocusStatus.NONE;

  private unFocusTimerSubscription: Subscription;

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

  showRouteCalled(result: SearchResult) {
    //console.log('SearchComponent::showRouteCalled: ' + result.text);
    this.route(result);
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

  getDefaultStartPositions(): SearchResult[] {
    return [DefaultStartPointWithPos,
      DefaultStartPoint];
  }

  searchStartPoint(term: string): Observable<SearchResult[]> {
    console.log('SearchComponent::searchStartPoint:' + term);
    this.currentStartPointResult = null;
    if (term.length == 0) {
      return Observable.of(this.getDefaultStartPositions());
    };
    if (term.length == 1) {
      return Observable.of([DefaultStartPointWithPos,
        DefaultStartPoint,
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
    this.showResultTable();
  }

  searchUpdateResultsStartPoint(items: SearchResult[]) {
    console.log('searchResults Start Point: ');

    for (let i = 0; i < items.length; i++) {
      items[i].lastElem = false;
      items[i].isStartPoint = true;
    }

    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    this.searchResultsFrom = items;
    this.showResultTable();
  }

  select(selected: SearchResult) {
    console.log('SearchComponent::select:' + selected.text + " Start?=" + selected.isStartPoint);
    if (!selected.isStartPoint) {
      this.currentResult = selected;
      this.showCurrentResult();
    }
    else {
      this.currentStartPointResult = selected;
      this.showCurrentStartResult();
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

  searchFocus() {
    console.log("SearchcontrolComponent::searchFocus()");
    this.stopUnFocusTimer();
    this.currentFocusStatus = FocusStatus.SEARCH;
    this.showResultTable();
  }

  searchFocusOut() {
    console.log("SearchcontrolComponent::searchFocusOut()");
    this.currentFocusStatus = FocusStatus.NONE;
    this.startUnFocusTimer();
  }

  startFocus() {
    console.log("SearchcontrolComponent::startFocus()");
    this.stopUnFocusTimer();
    this.currentFocusStatus = FocusStatus.START;

    if (this.currentStartPointResult != null && this.currentStartPointResult.id < 0) {
      this.startPointTerm.setValue("", { "emitEvent": false });
      this.searchUpdateResultsStartPoint(this.getDefaultStartPositions());
    }
    else {

      this.showResultTable();
    }
  }

  startFocusOut() {
    console.log("SearchcontrolComponent::startFocusOut()")
    this.currentFocusStatus = FocusStatus.NONE;
    this.startUnFocusTimer();
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

  private showResultTable() {
    if (this.currentFocusStatus == FocusStatus.SEARCH) {
      this.doShowResults(this.searchResultsTo);
    }
    else if (this.currentFocusStatus == FocusStatus.START) {
      this.doShowResults(this.searchResultsFrom);
    }
    else {
      this.doShowResults([]);
    }
  }

  private showCurrentResult() {
    if (this.currentResult != null) {
      this.mapComponentRef.showRoom(this.currentResult);
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

  private startUnFocusTimer() {

    console.log("SearchcontrolComponent::startUnFocusTimer()");

    if (this.unFocusTimerSubscription != null) {
      this.stopUnFocusTimer();
    }

    let timer = TimerObservable.create(250);
    this.unFocusTimerSubscription = timer.subscribe(t => {
      this.unFocusTimerEvent();
    });
  }

  private stopUnFocusTimer() {
    console.log("SearchcontrolComponent::stopUnFocusTimer()");

    if (this.unFocusTimerSubscription != null) {

      this.unFocusTimerSubscription.unsubscribe();
      this.unFocusTimerSubscription = null;
    }
  }

  private unFocusTimerEvent() {
    console.log("SearchcontrolComponent::unFocusTimerEvent()");

    this.stopUnFocusTimer();
    this.showResultTable();
  }

}
