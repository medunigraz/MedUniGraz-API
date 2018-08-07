import { SearchResult } from '../base/searchresult';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { Logger } from '../base/logger';

export const DefaultStartPointWithPos: SearchResult = new SearchResult(-1, "Aktueller Standort", 0);
export const DefaultStartPoint: SearchResult = new SearchResult(-2, "Haupteingang", 0);

export class SearchDemoData {

  public static getDefaultStartPoint(isLivePosRoutingAvailable: boolean): SearchResult {
    if (isLivePosRoutingAvailable) {
      return DefaultStartPointWithPos
    }
    return DefaultStartPoint;
  }

  public static getDefaultStartPositions(isLivePosRoutingAvailable: boolean): SearchResult[] {
    if (isLivePosRoutingAvailable) {
      return [DefaultStartPointWithPos,
        DefaultStartPoint];
    }
    return [DefaultStartPoint];
  }

  public static getNoResult_Obj(): SearchResult {
    let searchresult: SearchResult = new SearchResult(-3, "Keine Ergebnisse...", -1);
    searchresult.notFound = true;

    return searchresult;
  }

  public static getSearchDemoData(term: string): Observable<SearchResult[]> {
    Logger.log('SearchComponent::search:' + term);
    if (term.length == 0) {
      return of([]);
    }
    if (term.length == 1) {
      return of([new SearchResult(0, "Hörsaal 1 (MC1.A.EG.001)", 0),
        new SearchResult(1, "Dr. Igor Tester", 1),
        new SearchResult(2, "Institut für Physiologische Chemie", 2),
        new SearchResult(3, "Hörsaal 4 (MC1.A.EG.004)", 0),
        new SearchResult(4, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
    }
    return of([new SearchResult
      (5, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }

  public static getSearchStartPointDemoData(term: string): Observable<SearchResult[]> {
    Logger.log('SearchComponent::searchStartPoint:' + term);
    if (term.length == 0) {
      return of(this.getDefaultStartPositions(true));
    };
    if (term.length == 1) {
      return of([DefaultStartPointWithPos,
        DefaultStartPoint,
        new SearchResult(3, "Hörsaal 4 (MC1.A.EG.004)", 0),
        new SearchResult(4, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
    }
    return of([new SearchResult(5, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }
}
