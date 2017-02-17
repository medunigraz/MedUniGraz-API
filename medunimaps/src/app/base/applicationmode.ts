export class ApplicationMode {

  constructor(
    public name: string,
    public showDemoRoute: boolean
  )
  { }

}

export const ApplicationModes = [
  new ApplicationMode("Default", true),
  new ApplicationMode("EditEdges", false),
  new ApplicationMode("EditPaths", false)
]
