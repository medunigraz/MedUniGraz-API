import {SearchResult} from '../base/searchresult';
import { Observable } from 'rxjs';

export const DefaultStartPointWithPos: SearchResult = new SearchResult(-1, "Aktueller Standort", 0);
export const DefaultStartPoint: SearchResult = new SearchResult(-2, "Haupteingang", 0);

export class SearchDemoData {

  public static getDefaultStartPositions(): SearchResult[] {
    return [DefaultStartPointWithPos,
      DefaultStartPoint];
  }

  public static getSearchDemoData(term: string): Observable<SearchResult[]> {
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
    return Observable.of([new SearchResult
      (5, "Hörsaal 5 (MC1.A.EG.005)", 0)]);
  }

  public static getSearchStartPointDemoData(term: string): Observable<SearchResult[]> {
    console.log('SearchComponent::searchStartPoint:' + term);
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
}
