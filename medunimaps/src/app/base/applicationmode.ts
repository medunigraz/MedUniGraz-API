
export enum ApplicationModeT {
  DEFAULT,
  EDIT_NODES
}

export class ApplicationMode {

  constructor(
    public mode: ApplicationModeT,
    public name: string,
    public showDemoRoute: boolean
  )
  { }

  static CreateDefault(): ApplicationMode {
    //return new ApplicationMode(ApplicationModeT.DEFAULT, "Default", true);
    return new ApplicationMode(ApplicationModeT.EDIT_NODES, "Edit Nodes", false)
  }

}

export const ApplicationModes = [
  ApplicationMode.CreateDefault(),
  //new ApplicationMode(ApplicationModeT.EDIT_NODES, "Edit Nodes", false)

]
