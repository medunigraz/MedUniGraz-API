
const MAX_NUM_OF_ENTRIES = 30;

const MIN_VALUE = -90;

export class SignalBufferFixed {

  id: string;
  currentValue: number = undefined;
  lastOrigValue: number;

  valueAr: number[] = undefined;
  currentIndex: number = 0;
  numberOfValidValues: number = 0;

  name: string;
  battery: number;
  mac: string;

  numberOfEntries = 0;

  private minValue = -90;

  constructor(id, mac, value, name, battery) {

    //console.log("SignalBufferCollection::SignalBufferFixed() - Create new Beacon: " + name + " value: " + value);

    this.id = id;
    this.currentIndex = 0;
    this.valueAr = new Array(MAX_NUM_OF_ENTRIES);
    this.currentValue = undefined;
    this.numberOfValidValues = 0;

    this.name = name;
    this.mac = mac;
    this.battery = battery;

    for (let i = 0; i < MAX_NUM_OF_ENTRIES; i++) {
      this.valueAr[i] = undefined;
    }

    this.setValue(mac, value, name, battery);
  }

  public setValue(mac, value, name, battery) {

    //console.log("SignalBufferCollection::SignalBufferFixed() - setValue: " + name + " value: " + value);

    this.lastOrigValue = value;
    this.currentValue = undefined;

    if (value && value >= MIN_VALUE && value <= 0) {
      this.battery = battery;
      this.currentValue = value;
    }
  }

  public getValue() {

    if (this.numberOfValidValues <= 0 || !this.valueAr || this.valueAr.length <= 0) {
      //console.log("SignalBufferCollection::SignalBufferFixed() - getValues(): UNDEFINED");
      return undefined;
    }

    let sum = 0;
    for (let i = 0; i < MAX_NUM_OF_ENTRIES; i++) {
      if (this.valueAr[i] != undefined) {
        sum += this.valueAr[i];
      }
    }

    console.log("SignalBufferCollection::SignalBufferFixed() #" + this.name + "# getValues(): " + (sum / this.numberOfValidValues) + " # " + this.numberOfValidValues);
    return sum / this.numberOfValidValues;
  }

  public updateTimer() {  //Return true if the buffer is cleared

    if (this.currentValue) {
      //console.log("SignalBufferCollection::SignalBufferFixed() - updateTimer: Insert Value: " + this.currentValue);
      this.addNewValue();
      this.currentValue = undefined;
      this.incCurrentIndex();
    }
    else {
      //console.log("SignalBufferCollection::SignalBufferFixed() - updateTimer: Checkvalues: " + this.numberOfValidValues);
      this.updateBuffer();
      this.incCurrentIndex();
      return this.checkClearBuffer();
    }

    return false;
  }

  private addNewValue() {

    if (this.valueAr[this.currentIndex]) {
      this.numberOfValidValues--;
    }

    this.valueAr[this.currentIndex] = this.currentValue;
    this.numberOfValidValues++;
  }

  private updateBuffer() {

    if (this.valueAr[this.currentIndex]) {
      this.numberOfValidValues--;
    }

    this.valueAr[this.currentIndex] = undefined;
  }

  private checkClearBuffer() {

    if (this.numberOfValidValues <= 0) {
      return true;
    }

    return false;
  }

  private incCurrentIndex() {
    this.currentIndex++;
    if (this.currentIndex >= MAX_NUM_OF_ENTRIES) {
      this.currentIndex = 0;
    }
  }
}
