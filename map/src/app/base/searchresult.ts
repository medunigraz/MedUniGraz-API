export class SearchResult {
  id: number;
  text: string;
  type: number;
  lastElem: boolean;

  constructor(id: number, text: string, type: number) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.lastElem = false;
  }

}
