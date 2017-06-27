export enum BeaconEditModeT {
  DEFAULT,
  ADD,
  MOVE
}

export class BeaconEditMode {

  constructor(
    public mode: BeaconEditModeT,
    public name: string
  )
  { }

  static CreateDefault(): BeaconEditMode {
    //return new ApplicationMode(ApplicationModeT.DEFAULT, "Default", true);
    return new BeaconEditMode(BeaconEditModeT.DEFAULT, "Select");
  }

}

export const BeaconEditModes = [
  BeaconEditMode.CreateDefault(),
  new BeaconEditMode(BeaconEditModeT.ADD, "Add"),
  new BeaconEditMode(BeaconEditModeT.MOVE, "Move")//,
  //new ApplicationMode(ApplicationModeT.EDIT_BACKGROUND, "Hintergrund")
]
