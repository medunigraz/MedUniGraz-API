export class Signal {
  id: string;
  value: number;
  name: string;
  battery: number;
  origSignal: number;

  constructor(id: string, value: number, name: string, battery: number, origSignal: number) {
    this.id = id;
    this.value = value;
    this.name = name;
    this.battery = battery;
    this.origSignal = origSignal;
  }
}
