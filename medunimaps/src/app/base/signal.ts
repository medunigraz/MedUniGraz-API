export class Signal {
  id: string;
  value: number;
  name: string;
  battery: number;

  constructor(id: string, value: number, name: string, battery: number) {
    this.id = id;
    this.value = value;
    this.name = name;
    this.battery = battery;
  }
}
