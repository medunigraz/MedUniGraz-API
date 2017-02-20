
export enum ApplicationModeT {
  DEFAULT,
  EDIT_EDGES,
  EDIT_PATHS
}

export class ApplicationMode {

  constructor(
    public mode: ApplicationModeT,
    public name: string,
    public showDemoRoute: boolean
  )
  { }

}

export const ApplicationModes = [
  new ApplicationMode(ApplicationModeT.DEFAULT, "Default", true),
  new ApplicationMode(ApplicationModeT.EDIT_EDGES, "EditEdges", false),
  new ApplicationMode(ApplicationModeT.EDIT_PATHS, "EditPaths", false)
]
