
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
      "icon": "local_library"
    }),
      new Poi({
        "id": 2,
        "name": "Servicestellen",
        "icon": "info"
      }),
      new Poi({
        "id": 3,
        "name": "Öffentliche Verkehrsmittel",
        "icon": "directions_bus"
      }),
      new Poi({
        "id": 4,
        "name": " Radabstellplatz",
        "icon": "directions_bike"
      }),
      new Poi({
        "id": 5,
        "name": "Zugänge",
        "icon": "directions_walk"
      }),
      new Poi({
        "id": 6,
        "name": "Barrierefreie Zugänge",
        "icon": "accessible"
      }),
      new Poi({
        "id": 7,
        "name": "Aufzüge",
        "icon": "place"
      }),
      new Poi({
        "id": 8,
        "name": "Wickeltisch",
        "icon": "child_friendly"
      }),
      new Poi({
        "id": 9,
        "name": "Portier",
        "icon": "person_pin"
      }),
      new Poi({
        "id": 9,
        "name": "WC",
        "icon": "wc"
      })
    ];
  }
}
