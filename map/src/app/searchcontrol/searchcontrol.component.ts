import { Component, OnInit } from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs';

import {SearchResult} from '../base/searchresult';

@Component({
  selector: 'app-searchcontrol',
  templateUrl: './searchcontrol.component.html',
  styleUrls: ['./searchcontrol.component.css']
})
export class SearchcontrolComponent implements OnInit {

  private searchResults: SearchResult[];
  private showResults: boolean = false;
  private searchTerms = new Subject<string>();
  private term = new FormControl();

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
      return Observable.of([new SearchResult("Hörsaal 1 (MC1.A.EG.001)", 0),
        new SearchResult("Dr. Igor Tester", 1),
        new SearchResult("Institut für Physiologische Chemie", 2),
        new SearchResult("Hörsaal 4 (MC1.A.EG.004)", 0),
        new SearchResult("Hörsaal 5 (MC1.A.EG.005)", 0)]);
    }
    return Observable.of([new SearchResult("Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }

  searchUpdateResults(items: SearchResult[]) {
    console.log('searchResults: ');
    if (items.length > 0) {
      items[items.length - 1].lastElem = true;
    }
    this.showResults = items.length > 0;
    this.searchResults = items;
  }

  select(selected: string) {
    console.log('SearchComponent::select:' + selected);
  }

}
