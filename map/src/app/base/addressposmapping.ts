
export class AddressPosMapping {

  private static mapping =
  [
    { name: "Wartingergasse 43", pos: [1718065.3592334045, 5954868.480997317] },
    { name: "Universitätsstraße 6", pos: [1720039.0968801302, 5954744.54606037] },
    { name: "Universitätsplatz 4", pos: [1719827.7007237782, 5954921.306688281] },
    { name: "Stiftingtalstraße 3", pos: [1721812.4200812723, 5955073.764227941] },
    { name: "Stiftingtalstraße 24", pos: [1721972.1615271026, 5955335.770057318] },
    { name: "Roseggerweg 50", pos: [1722458.2199069767, 5957007.644924518] },
    { name: "Roseggerweg 48", pos: [1722331.919661021, 5957021.67828518] },
    { name: "Neue Stiftingtalstraße 6", pos: [1722082.2901941238, 5955257.740664568] },
    { name: "Neue Stiftingtalstraße 2", pos: [1722082.2901941238, 5955257.740664568] },
    { name: "Heinrichstraße 31a", pos: [1719708.5619030232, 5955091.744806677] },
    { name: "Harrachgasse 21", pos: [1719630.3127543882, 5954746.482604485] },
    { name: "Goethestraße 43", pos: [1719634.229636288, 5954585.607044948] },
    { name: "Billrothgasse 4", pos: [1722039.483486666, 5955509.363481865] },
    { name: "Billrothgasse 20", pos: [1722316.1354430867, 5955450.443509152] },
    { name: "Auenbruggerplatz 9", pos: [1721517.3824054794, 5955099.067998983] },
    { name: "Auenbruggerplatz 8", pos: [1721730.9645881846, 5955335.220180653] },
    { name: "Auenbruggerplatz 5", pos: [1721584.6593387325, 5955208.919934696] },
    { name: "Auenbruggerplatz 48", pos: [1721675.33488702, 5955403.047559214] },
    { name: "Auenbruggerplatz 4", pos: [1721744.1860842856, 5955200.228048974] },
    { name: "Auenbruggerplatz 34", pos: [1721980.4603048125, 5955837.148667004] },
    { name: "Auenbruggerplatz 32", pos: [1721829.3777410933, 5955711.744167473] },
    { name: "Auenbruggerplatz 31", pos: [1721694.9866534323, 5956101.141326329] },
    { name: "Auenbruggerplatz 3", pos: [1721640.236592839, 5955083.867484815] },
    { name: "Auenbruggerplatz 29", pos: [1721444.9638721414, 5955182.39959159] },
    { name: "Auenbruggerplatz 26", pos: [1721968.0287651157, 5955723.455016854] },
    { name: "Auenbruggerplatz 25", pos: [1721412.7248836402, 5955487.143578343] },
    { name: "Auenbruggerplatz 22", pos: [1721782.902854032, 5955613.86337909] },
    { name: "Auenbruggerplatz 2", pos: [1721806.4972581025, 5955091.431528175] },
    { name: "Auenbruggerplatz 15", pos: [1721571.4047143392, 5955325.738185989] },
    { name: "Auenbruggerplatz 14", pos: [1721745.2244744352, 5955469.201191915] },
    { name: "Auenbruggerplatz 1", pos: [1721599.3205197728, 5955034.167011404] }
  ]

  public static getPosForTitle(title: string): number[] {

    //console.log("AddressPosMapping::GetMapping for title: " + title);

    let mapping = AddressPosMapping.mapping;

    for (let i = 0; i < mapping.length; i++) {
      if (title.indexOf(mapping[i].name) >= 0) {
        //console.log("AddressPosMapping::GetMapping FOUND: " + mapping[i].name);
        return mapping[i].pos;
      }
    }

    return undefined;
  }

  public static testValidAddress(title: string): boolean {
    let mapping = AddressPosMapping.mapping;

    for (let i = 0; i < mapping.length; i++) {
      if (title.indexOf(mapping[i].name) >= 0) {
        return true;
      }
    }
    return false;
  }

}
