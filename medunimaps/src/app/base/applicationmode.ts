
export enum ApplicationModeT {
  DEFAULT,
  EDIT_NODES,
  EDIT_MULTIFLOOR_EDGES,
  EDIT_POIS,
  EDIT_BACKGROUND,
  EDIT_BEACONS,
  EDIT_WEIGHTS
}

export class ApplicationMode {

  constructor(
    public mode: ApplicationModeT,
    public name: string
  )
  { }

  static CreateDefault(): ApplicationMode {
    //return new ApplicationMode(ApplicationModeT.DEFAULT, "Default", true);
    return new ApplicationMode(ApplicationModeT.EDIT_NODES, "Navigationsmesh");
  }

}

export const ApplicationModes = [
  ApplicationMode.CreateDefault(),
  new ApplicationMode(ApplicationModeT.EDIT_MULTIFLOOR_EDGES, "Nav-Mesh Stockwerke"),
  new ApplicationMode(ApplicationModeT.EDIT_POIS, "Points of Interest"),
  new ApplicationMode(ApplicationModeT.EDIT_BEACONS, "Beacons"),
  new ApplicationMode(ApplicationModeT.EDIT_WEIGHTS, "Navigation Gewichtung")//,
  //new ApplicationMode(ApplicationModeT.EDIT_BACKGROUND, "Hintergrund")
]
