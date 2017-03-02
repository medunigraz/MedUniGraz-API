
export enum ApplicationModeT {
  DEFAULT,
  EDIT_NODES,
  EDIT_EDGES
}

export class ApplicationMode {

  constructor(
    public mode: ApplicationModeT,
    public name: string,
    public showDemoRoute: boolean
  )
  { }

  static CreateDefault(): ApplicationMode {
    return new ApplicationMode(ApplicationModeT.DEFAULT, "Default", true);
  }

}

export const ApplicationModes = [
  ApplicationMode.CreateDefault(),
  new ApplicationMode(ApplicationModeT.EDIT_NODES, "Edit Nodes", false),
  new ApplicationMode(ApplicationModeT.EDIT_EDGES, "Edit Edges", false)

]
