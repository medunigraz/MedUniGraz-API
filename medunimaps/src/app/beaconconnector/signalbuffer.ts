

export class SignalBuffer {
  id: string;
  lastValue: number;
  lastOrigValue: number;
  lastValueTimeStamp: number;

  name: string;
  battery: number;

  private filterValue = 0.5;
  private minValue = -90;

  constructor(id) {
    this.id = id;
    this.clear();
  }

  public setValue(value, name, battery) {

    if (!value) {
      this.clear();
      //value = this.minValue;
    }

    this.lastOrigValue = value;

    if (value > 0) //error code -> Reset Timer and use old value
    {
      let milliseconds = new Date().getTime();
      this.lastValueTimeStamp = milliseconds;
    }
    else {
      let filteredValue = (1 - this.filterValue) * this.lastValue + this.filterValue * value;
      this.lastValue = filteredValue;

      if (this.lastValue < this.minValue) {
        this.lastValue = this.minValue;
      }

      let milliseconds = new Date().getTime();
      this.lastValueTimeStamp = milliseconds;
      this.name = name;
      this.battery = battery;
    }

    //console.log("SignalBuffer::setValue Set value: " + this.lastValue + "/" + this.lastValueTimeStamp);
  }

  public checkClearValue() {
    let milliseconds = new Date().getTime();
    if (!this.lastValue || !this.lastValueTimeStamp) {
      return true;
    }
    if (milliseconds - this.lastValueTimeStamp > 1000) {
      return true;
    }
    return false;
  }

  private clear() {
    this.lastValue = this.minValue;
    this.lastValueTimeStamp = undefined;
  }
}
