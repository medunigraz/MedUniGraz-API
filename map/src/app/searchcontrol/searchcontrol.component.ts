import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { MapService } from '../mapservice/map.service';

import {SearchResult} from '../base/searchresult';
import {Room} from '../base/room';
import {RouteNodes} from '../base/routeNodes';
import {DefaultStartPointWithPos, DefaultStartPoint, SearchDemoData} from './searchcontrolconstants';


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

  @ViewChild('searchStartInput') public searchStartInputRef: ElementRef;
  @ViewChild('searchInput') public searchInputRef: ElementRef;

  isRoutingSearchBox: boolean = false;

  public searchResults: SearchResult[];
  private searchResultsFrom: SearchResult[];
  private searchResultsTo: SearchResult[];

  private currentResult: SearchResult = null;
  private currentStartPointResult: SearchResult = null;

  public showResults: boolean = false;
  private searchTerms = new Subject<string>();

  public term = new FormControl();
  private startPointTerm = new FormControl();

  private currentFocusStatus: FocusStatus = FocusStatus.NONE;

  private unFocusTimerSubscription: Subscription;

  private searchSubscription: Subscription = null;
  private searchStartSubscription: Subscription = null;

  @Output() openSideMenuEvt = new EventEmitter<boolean>();
  @Output() roomSelectedEvt = new EventEmitter<Room>();
  @Output() routeSelectedEvt = new EventEmitter<RouteNodes>();

  private isLivePosRoutingAvailable = false;
  @Output() aktiveLivePosRouting = new EventEmitter<boolean>();

  constructor(private mapService: MapService) { }

  ngOnInit() {

    this.term.valueChanges
      .debounceTime(400).subscribe(term => this.search(term));

    this.startPointTerm.valueChanges
      .debounceTime(400).subscribe(term => this.searchStartPoint(term));

    /*
        this.term.valueChanges
          .debounceTime(400)
          .distinctUntilChanged()
          .flatMap(term => this.search(term));*/

    /*
    this.startPointTerm.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.searchStartPoint(term))
      .subscribe(items => this.searchUpdateResultsStartPoint(items));*/

  }

  showRoomCalled(destinationroom: Room) {
    console.log('SearchComponent::destinationroom: ' + destinationroom.text);

    this.term.setValue(destinationroom.text, { "emitEvent": false });
    this.searchUpdateResults([], true);
    this.roomSelectedEvt.emit(destinationroom);

    //this.route(destinationroom);
  }

  showRouteCalled(destinationroom: Room) {
    //console.log('SearchComponent::showRouteCalled: ' + result.text);
    this.currentResult = SearchResult.CreateFromRoom(destinationroom);
    this.route(destinationroom);
  }

  public setLivePosAvailable(isAvailable: boolean) {
    this.isLivePosRoutingAvailable = isAvailable;
  }

  search(term: string) {
    console.log('SearchComponent::search:' + term);
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.searchSubscription = null;
    }

    if (term.length > 0) {
      this.searchSubscription = this.mapService.search(term).subscribe(
        results => this.searchUpdateResults(results, false),
        error => console.log("ERROR search: " + <any>error));
    }
    else {
      this.searchUpdateResults([], true);
    }
  }

  searchStartPoint(term: string) {
    console.log('SearchComponent::searchStartPoint:' + term);

    if (this.searchStartSubscription) {
      this.searchStartSubscription.unsubscribe();
      this.searchStartSubscription = null;
    }

    if (term.length == 0) {
      this.searchUpdateResultsStartPoint(SearchDemoData.getDefaultStartPositions(this.isLivePosRoutingAvailable), false);
    }
    else {
      this.searchStartSubscription = this.mapService.search(term).subscribe(
        results => this.searchUpdateResultsStartPoint(results, false),
        error => console.log("ERROR searchstartpoint: " + <any>error));
    }

  }

  searchUpdateResults(items: SearchResult[], clear: boolean) {
    console.log('searchResults: ');

    if (items.length <= 0 && !clear) {
      items.push(SearchDemoData.getNoResult_Obj());
    }

    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    this.searchResultsTo = items;
    this.showResultTable();
  }

  searchUpdateResultsStartPoint(items: SearchResult[], clear: boolean) {
    console.log('searchResults Start Point: ');

    if (items.length <= 0 && !clear) {
      items.push(SearchDemoData.getNoResult_Obj());
    }

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
      console.log('SearchComponent::Select new Destination:' + JSON.stringify(this.currentResult));
      this.showCurrentResult();
      if (this.isRoutingSearchBox && this.currentStartPointResult) {
        this.routeClicked(this.currentResult);
      }
      else {
        let room = this.currentResult.getRoom();
        if (room) {
          this.roomSelectedEvt.emit(room);
        }
      }
    }
    else {
      this.currentStartPointResult = selected;
      this.showCurrentStartResult();
      console.log('SearchComponent::Select new Startpoint - For Destination:' + JSON.stringify(this.currentResult));
      if (this.currentResult) {
        this.routeClicked(this.currentResult);
      }
    }
  }

  routeClicked(destinationroom: SearchResult) {
    this.currentResult = destinationroom;
    this.showCurrentResult();
    let room = destinationroom.getRoom();
    if (room) {
      this.route(room);
    }
  }

  route(destinationroom: Room) {
    console.log('SearchComponent::route:' + JSON.stringify(destinationroom));
    console.log('SearchComponent::route from:' + JSON.stringify(this.currentStartPointResult));

    this.term.setValue(destinationroom.text, { "emitEvent": false });
    this.searchUpdateResults([], true);

    if (this.currentStartPointResult == null) {
      this.currentStartPointResult = SearchDemoData.getDefaultStartPoint(this.isLivePosRoutingAvailable);
    }
    this.showCurrentStartResult();
    this.isRoutingSearchBox = true;

    if (this.currentStartPointResult) {
      if (this.currentStartPointResult.id > 0) {
        console.log('SearchComponent::route from existing room');
        let room = this.currentStartPointResult.getRoom();
        if (room) {
          this.routeSelectedEvt.emit(new RouteNodes(room, destinationroom));
        }
      }
      else if (this.currentStartPointResult.id == -2) //Haupteingang
      {
        console.log('SearchComponent::route from entrance');
        this.routeSelectedEvt.emit(new RouteNodes(new Room(5936, "Haupteingang", 2), destinationroom));
      }
      else if (this.currentStartPointResult.id == -1) //Liverouting
      {
        console.log('SearchComponent::route from liveposition');
        this.routeSelectedEvt.emit(new RouteNodes(undefined, destinationroom));
      }
      else {
        console.log('SearchComponent::route from ' + this.currentStartPointResult.id + ' not supported!');
      }
    }
  }

  searchFocus() {
    console.log("SearchcontrolComponent::searchFocus()");
    this.stopUnFocusTimer();
    this.currentFocusStatus = FocusStatus.SEARCH;

    this.searchInputRef.nativeElement.select();

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

    /*
        if (this.currentStartPointResult != null && this.currentStartPointResult.id < 0) {
          this.startPointTerm.setValue("", { "emitEvent": false });
          this.searchUpdateResultsStartPoint(SearchDemoData.getDefaultStartPositions());
        }
        else {

          this.showResultTable();
        }*/
    this.searchStartInputRef.nativeElement.select();
    this.showResultTable();
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
    this.currentStartPointResult = null;
    this.term.setValue("");
    this.startPointTerm.setValue("");
    this.isRoutingSearchBox = false;
    this.routeSelectedEvt.emit(null);
    //this.roomSelectedEvt.emit(null);
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

  private searchCurrentResultClicked() {
    if (this.currentResult != null) {
      this.showCurrentResult();
      let room = this.currentResult.getRoom();
      if (room) {
        this.roomSelectedEvt.emit(room);
      }
    }
  }

  private showCurrentResult() {
    if (this.currentResult != null) {
      this.term.setValue(this.currentResult.text, { "emitEvent": false });
      this.searchUpdateResults([], true);
    }
  }

  private showCurrentStartResult() {
    if (this.currentStartPointResult != null) {
      this.startPointTerm.setValue(this.currentStartPointResult.text, { "emitEvent": false });
      this.searchUpdateResultsStartPoint([], true);
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
