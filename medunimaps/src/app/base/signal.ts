export class Signal {
  mac: string;
  value: number;
  name: string;
  battery: number;
  origSignal: number;

  constructor(mac: string, value: number, name: string, battery: number, origSignal: number) {
    this.mac = mac;
    this.value = value;
    this.name = name;
    this.battery = battery;
    this.origSignal = origSignal;
  }
}
