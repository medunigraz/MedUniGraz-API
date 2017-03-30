export class SearchResult {
  text: string;
  type: number;
  lastElem: boolean;

  constructor(text: string, type: number) {
    this.text = text;
    this.type = type;
    this.lastElem = false;
  }

}
