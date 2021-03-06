
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject ,  Observable ,  Subscription ,  timer } from 'rxjs';
import { MapService } from '../mapservice/map.service';
import {MatIconRegistry} from '@angular/material/icon';
import { SearchResult } from '../base/searchresult';
import { Room } from '../base/room';
import { RouteNodes } from '../base/routeNodes';
import { DefaultStartPointWithPos, DefaultStartPoint, SearchDemoData } from './searchcontrolconstants';

import { Logger } from '../base/logger';
import { MAX_NUM_OF_AUTOCOMPLETE_RESULTS } from '../base/globalconstants';




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
  @ViewChild('searchInput', { static: true }) public searchInputRef: ElementRef;
  @ViewChild('resultScrollDiv') public resultScrollDiv: ElementRef;

  isRoutingSearchBox: boolean = false;
  showCloseDeleteButton: boolean = false;

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

  private searchToNextUrl: string = undefined;
  private searchStartNextUrl: string = undefined;

  @Output() openSideMenuEvt = new EventEmitter<boolean>();
  @Output() roomSelectedEvt = new EventEmitter<Room>();
  @Output() routeSelectedEvt = new EventEmitter<RouteNodes>();

  private isLivePosRoutingAvailable = false;
  @Output() aktiveLivePosRouting = new EventEmitter<boolean>();

  constructor(private mapService: MapService) { }

  ngOnInit() {

    this.term.valueChanges.pipe(
      debounceTime(400)).subscribe(term => this.search(term));

    this.startPointTerm.valueChanges.pipe(
      debounceTime(400)).subscribe(term => this.searchStartPoint(term));

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
    Logger.log('SearchComponent::destinationroom: ' + destinationroom.text);

    this.term.setValue(destinationroom.text, { "emitEvent": false });
    this.showCloseDeleteButton = true;
    this.searchUpdateResults([], true, false);
    this.roomSelectedEvt.emit(destinationroom);

    //this.route(destinationroom);
  }

  showRouteCalled(destinationroom: Room) {
    //Logger.log('SearchComponent::showRouteCalled: ' + result.text);
    this.currentResult = SearchResult.CreateFromRoom(destinationroom);
    this.route(destinationroom);
  }

  public setLivePosAvailable(isAvailable: boolean) {
    this.isLivePosRoutingAvailable = isAvailable;
  }

  search(term: string) {
    Logger.log('SearchComponent::search:' + term);
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.searchSubscription = null;
    }

    if (term.length > 0) {
      this.showCloseDeleteButton = true;
      this.searchSubscription = this.mapService.search(term, MAX_NUM_OF_AUTOCOMPLETE_RESULTS).subscribe(
        results => this.searchResultsReceived(results, false, false),
        error => Logger.log("ERROR search: " + <any>error));
    }
    else {

      if (!this.startPointTerm || !this.startPointTerm.value || this.startPointTerm.value.length <= 0) {
        this.showCloseDeleteButton = false;
      }

      this.searchUpdateResults([], true, false);
    }
  }

  searchStartPoint(term: string) {
    Logger.log('SearchComponent::searchStartPoint:#' + term + '#' + term.length);

    if (this.searchStartSubscription) {
      this.searchStartSubscription.unsubscribe();
      this.searchStartSubscription = null;
    }

    if (term.length <= 0) {
      this.searchUpdateResultsStartPoint(SearchDemoData.getDefaultStartPositions(this.isLivePosRoutingAvailable), false, false);
    }
    else {
      this.searchStartSubscription = this.mapService.search(term, MAX_NUM_OF_AUTOCOMPLETE_RESULTS).subscribe(
        results => this.searchStartResultsReceived(results, false, false),
        error => Logger.log("ERROR searchstartpoint: " + <any>error));
    }

  }

  searchResultsReceived(items: any, clear: boolean, extendCurrent: boolean) {
    this.searchToNextUrl = items.nexturl;
    Logger.log('searchResults To Point - Next URL: ' + this.searchToNextUrl);
    this.searchUpdateResults(items.data, clear, extendCurrent);
  }

  searchUpdateResults(items: SearchResult[], clear: boolean, extendCurrent: boolean) {
    Logger.log('searchResults: ');

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.searchSubscription = null;
    }

    if (items.length <= 0 && !clear && !extendCurrent) {
      items.push(SearchDemoData.getNoResult_Obj());
    }

    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    if (extendCurrent) {
      if (this.searchResultsTo.length > 0) {
        this.searchResultsTo[this.searchResultsTo.length - 1].lastElem = false;
      }
      this.searchResultsTo = this.searchResultsTo.concat(items);
    }
    else {
      if (this.resultScrollDiv) {
        this.resultScrollDiv.nativeElement.scrollTop = 0;
      }
      this.searchResultsTo = items;
    }
    this.showResultTable();
  }

  searchStartResultsReceived(items: any, clear: boolean, extendCurrent: boolean) {
    this.searchStartNextUrl = items.nexturl;
    Logger.log('searchResults Start Point - Next URL: ' + this.searchStartNextUrl);
    this.searchUpdateResultsStartPoint(items.data, clear, extendCurrent);
  }

  searchUpdateResultsStartPoint(items: SearchResult[], clear: boolean, extendCurrent: boolean) {
    Logger.log('searchResults Start Point: ');

    if (this.searchStartSubscription) {
      this.searchStartSubscription.unsubscribe();
      this.searchStartSubscription = null;
    }

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
    if (extendCurrent) {
      if (this.searchResultsFrom.length > 0) {
        this.searchResultsFrom[this.searchResultsFrom.length - 1].lastElem = false;
      }
      this.searchResultsFrom = this.searchResultsFrom.concat(items);
    }
    else {
      if (this.resultScrollDiv) {
        this.resultScrollDiv.nativeElement.scrollTop = 0;
      }
      this.searchResultsFrom = items;
    }
    this.showResultTable();
  }

  select(selected: SearchResult) {
    Logger.log('SearchComponent::select:' + selected.text + " Start?=" + selected.isStartPoint);
    if (!selected.isStartPoint) {
      this.currentResult = selected;
      Logger.log('SearchComponent::Select new Destination:' + JSON.stringify(this.currentResult));
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
      Logger.log('SearchComponent::Select new Startpoint - For Destination:' + JSON.stringify(this.currentResult));
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
    Logger.log('SearchComponent::route:' + JSON.stringify(destinationroom));
    Logger.log('SearchComponent::route from:' + JSON.stringify(this.currentStartPointResult));

    this.term.setValue(destinationroom.text, { "emitEvent": false });
    this.searchUpdateResults([], true, false);

    if (this.currentStartPointResult == null) {
      this.currentStartPointResult = SearchDemoData.getDefaultStartPoint(this.isLivePosRoutingAvailable);
    }
    this.showCurrentStartResult();
    this.isRoutingSearchBox = true;
    this.showCloseDeleteButton = true;

    if (this.currentStartPointResult) {
      if (this.currentStartPointResult.id > 0) {
        Logger.log('SearchComponent::route from existing room');
        let room = this.currentStartPointResult.getRoom();
        if (room) {
          this.routeSelectedEvt.emit(new RouteNodes(room, destinationroom));
        }
      }
      else if (this.currentStartPointResult.id == -2) //Haupteingang
      {
        Logger.log('SearchComponent::route from entrance');
        this.routeSelectedEvt.emit(new RouteNodes(new Room(5936, "Haupteingang", 2), destinationroom));
      }
      else if (this.currentStartPointResult.id == -1) //Liverouting
      {
        Logger.log('SearchComponent::route from liveposition');
        this.routeSelectedEvt.emit(new RouteNodes(undefined, destinationroom));
      }
      else {
        Logger.log('SearchComponent::route from ' + this.currentStartPointResult.id + ' not supported!');
      }
    }
  }

  searchFocus() {
    Logger.log("SearchcontrolComponent::searchFocus()");
    this.stopUnFocusTimer();
    this.currentFocusStatus = FocusStatus.SEARCH;

    this.searchInputRef.nativeElement.select();

    this.showResultTable();
  }

  searchFocusOut() {
    Logger.log("SearchcontrolComponent::searchFocusOut()");
    this.currentFocusStatus = FocusStatus.NONE;
    this.startUnFocusTimer();
  }

  startFocus() {
    Logger.log("SearchcontrolComponent::startFocus()");
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
    Logger.log("SearchcontrolComponent::startFocusOut()")
    this.currentFocusStatus = FocusStatus.NONE;
    this.startUnFocusTimer();
  }

  openSideMenu() {
    Logger.log("SearchcontrolComponent::openSideMenu()")
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
    this.showCloseDeleteButton = false;
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
    if (this.currentResult != null && this.currentResult.text) {
      this.term.setValue(this.currentResult.text, { "emitEvent": false });
      if (this.currentResult.text.length > 0) {
        this.showCloseDeleteButton = true;
      }
      this.searchUpdateResults([], true, false);
    }
  }

  private showCurrentStartResult() {
    if (this.currentStartPointResult != null) {
      this.startPointTerm.setValue(this.currentStartPointResult.text, { "emitEvent": false });
      this.searchUpdateResultsStartPoint([], true, false);
    }
  }

  private doShowResults(items: SearchResult[]) {
    if (items != null) {
      this.showResults = items.length > 0;
      this.searchResults = items;
    }
  }

  private startUnFocusTimer() {

    Logger.log("SearchcontrolComponent::startUnFocusTimer()");

    if (this.unFocusTimerSubscription != null) {
      this.stopUnFocusTimer();
    }
    let timerO = timer(250);
    this.unFocusTimerSubscription = timerO.subscribe(t => {
      this.unFocusTimerEvent();
    });
  }

  private stopUnFocusTimer() {
    Logger.log("SearchcontrolComponent::stopUnFocusTimer()");

    if (this.unFocusTimerSubscription != null) {

      this.unFocusTimerSubscription.unsubscribe();
      this.unFocusTimerSubscription = null;
    }
  }

  private unFocusTimerEvent() {
    Logger.log("SearchcontrolComponent::unFocusTimerEvent()");

    this.stopUnFocusTimer();
    this.showResultTable();
  }

  public resultBoxScrolled() {

    if (this.resultScrollDiv) {
      let theight = this.resultScrollDiv.nativeElement.clientHeight;
      let h = this.resultScrollDiv.nativeElement.scrollHeight - theight;
      let hd = this.resultScrollDiv.nativeElement.scrollTop;

      let percent = (hd * 100) / h;

      //Logger.log("SearchcontrolComponent::resultBoxScrolled() " + theight + " " + h + " " + hd + " percent: " + percent);

      if (percent > 90) {
        if (this.currentFocusStatus == FocusStatus.SEARCH) {
          if (!this.searchSubscription && this.searchToNextUrl) {
            Logger.log("SearchcontrolComponent::resultBoxScrolled() LOAD SEARCH " + this.searchToNextUrl);
            this.searchSubscription = this.mapService.searchFromUrl(this.searchToNextUrl).subscribe(
              results => this.searchResultsReceived(results, false, true),
              error => Logger.log("ERROR search: " + <any>error));
          }
        }
        else if (this.currentFocusStatus == FocusStatus.START) {
          if (!this.searchStartSubscription && this.searchStartNextUrl) {
            Logger.log("SearchcontrolComponent::resultBoxScrolled() LOAD START SEARCH " + this.searchStartNextUrl);
            this.searchStartSubscription = this.mapService.searchFromUrl(this.searchStartNextUrl).subscribe(
              results => this.searchStartResultsReceived(results, false, true),
              error => Logger.log("ERROR search: " + <any>error));
          }
        }
      }
    }
  }
}
