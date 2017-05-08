export class SearchResult {
  id: number;
  text: string;
  type: number;
  level: number;
  isStartPoint: boolean;
  lastElem: boolean;

  constructor(id: number, text: string, type: number) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.isStartPoint = false;
    this.lastElem = false;
  }

  public static createFromRestObj(obj: any): SearchResult {

    let type = 0;
    if (obj["ctype"] == "geo.person") {
      type = 1;
    }
    else if (obj["ctype"] == "geo.org") {
      type = 2;
    }

    let result = new SearchResult(obj["id"], obj["presentation"], type);
    result.level = obj["level"];

    return result;
  }

}
