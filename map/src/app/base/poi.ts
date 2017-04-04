
export class Poi {
  public id: number;
  public name: string;
  public icon: string;
  public isActive: boolean;

  constructor(obj: any) {
    this.id = obj["id"];
    this.name = obj["name"];
    this.icon = obj["icon"];
    this.isActive = false;
  }

  public static getDemoData(): Poi[] {
    return [new Poi({
      "id": 1,
      "name": "Lernplätze",
      "icon": "assets/beergarden.png"
    }),
      new Poi({
        "id": 2,
        "name": "Servicestellen",
        "icon": "assets/information.png"
      }),
      new Poi({
        "id": 3,
        "name": "Öffentliche Verkehrsmittel",
        "icon": "assets/busstop.png"
      }),
      new Poi({
        "id": 4,
        "name": " Radabstellplatz",
        "icon": "assets/parking_bicycle-2.png"
      }),
      new Poi({
        "id": 5,
        "name": "Zugänge",
        "icon": "assets/entrance.png"
      }),
      new Poi({
        "id": 6,
        "name": "Barrierefreie Zugänge",
        "icon": "assets/disability.png"
      }),
      new Poi({
        "id": 7,
        "name": "Aufzüge",
        "icon": "assets/elevator.png"
      }),
      new Poi({
        "id": 8,
        "name": "Wickeltisch",
        "icon": "assets/babymarkt_ausstattung.png"
      }),
      new Poi({
        "id": 9,
        "name": "Portier",
        "icon": "assets/sight-2.png"
      }),
      new Poi({
        "id": 9,
        "name": "WC",
        "icon": "assets/toilets.png"
      })
    ];
  }
}
