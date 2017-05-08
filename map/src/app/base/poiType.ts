
export class PoiType {
  public id: number;
  public name: string;
  public icon: string;
  public isActive: boolean;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.icon = obj["icon"];
    this.isActive = obj["selected"];
  }

  public static getDemoData(): PoiType[] {
    return [new PoiType({
      "id": 1,
      "name": "Lernplätze",
      "icon": "assets/beergarden.png"
    }),
      new PoiType({
        "id": 2,
        "name": "Servicestellen",
        "icon": "assets/information.png"
      }),
      new PoiType({
        "id": 3,
        "name": "Öffentliche Verkehrsmittel",
        "icon": "assets/busstop.png"
      }),
      new PoiType({
        "id": 4,
        "name": " Radabstellplatz",
        "icon": "assets/parking_bicycle-2.png"
      }),
      new PoiType({
        "id": 5,
        "name": "Zugänge",
        "icon": "assets/entrance.png"
      }),
      new PoiType({
        "id": 6,
        "name": "Barrierefreie Zugänge",
        "icon": "assets/disability.png"
      }),
      new PoiType({
        "id": 7,
        "name": "Aufzüge",
        "icon": "assets/elevator.png"
      }),
      new PoiType({
        "id": 8,
        "name": "Wickeltisch",
        "icon": "assets/babymarkt_ausstattung.png"
      }),
      new PoiType({
        "id": 9,
        "name": "Portier",
        "icon": "assets/sight-2.png"
      }),
      new PoiType({
        "id": 9,
        "name": "WC",
        "icon": "assets/toilets.png"
      })
    ];
  }
}
