
const MAX_NUM_OF_ENTRIES = 20;
const MAX_NUM_OF_VALID_VALUES = 6;

const MAX_TIME_DIFF = 5000;
const MIN_VALUE = -90;

export class SignalBufferTimed {

  name: string;

  valueAr: number[] = undefined;
  timeStampAr: number[] = undefined;

  currentIndex: number = 0;
  lastValidValuesCounter: number = 0;

  private minValue = -90;

  constructor(name, value) {

    //console.log("SignalBufferCollection::SignalBufferFixed() - Create new Beacon: " + name + " value: " + value);
    this.name = name;

    this.currentIndex = -1;
    this.valueAr = new Array(MAX_NUM_OF_ENTRIES);
    this.timeStampAr = new Array(MAX_NUM_OF_ENTRIES);

    for (let i = 0; i < MAX_NUM_OF_ENTRIES; i++) {
      this.valueAr[i] = undefined;
      this.timeStampAr[i] = undefined;
    }

    this.setValue(value);
  }

  public setValue(value) {
    if (value && value >= MIN_VALUE && value <= 0) {
      this.incCurrentIndex();
      //console.log("SignalBufferCollection::SignalBufferFixed() " + this.name + "Set value " + value + " to: " + this.currentIndex);
      this.valueAr[this.currentIndex] = value;
      this.timeStampAr[this.currentIndex] = new Date().getTime();
    }
  }

  public getValue() {
    if (!this.valueAr || this.valueAr.length <= 0) {
      //console.log("SignalBufferCollection::SignalBufferFixed() - getValues(): UNDEFINED");
      return undefined;
    }

    this.lastValidValuesCounter = 0;
    let milliseconds = new Date().getTime();
    let sum = 0;


    for (let i = this.currentIndex; i >= 0 && this.lastValidValuesCounter < MAX_NUM_OF_VALID_VALUES; i--) {
      //console.log("SignalBufferCollection::SignalBufferFixed() #" + i + " time: " + (milliseconds - this.timeStampAr[i]));
      if (this.valueAr[i] && (milliseconds - this.timeStampAr[i]) < MAX_TIME_DIFF) {
        sum += this.valueAr[i];
        this.lastValidValuesCounter++;
      }

    }
    for (let i = MAX_NUM_OF_ENTRIES; i > this.currentIndex && this.lastValidValuesCounter < MAX_NUM_OF_VALID_VALUES; i--) {
      //console.log("SignalBufferCollection::SignalBufferFixed() #" + i + " time: " + (milliseconds - this.timeStampAr[i]));
      if (this.valueAr[i] && (milliseconds - this.timeStampAr[i]) < MAX_TIME_DIFF) {
        sum += this.valueAr[i];
        this.lastValidValuesCounter++;
      }
    }

    let result = undefined;
    if (this.lastValidValuesCounter > 0) {
      result = sum / this.lastValidValuesCounter;
    }

    //console.log("SignalBufferCollection::SignalBufferFixed() #" + this.name + "# getValues(): " + result + " # " + this.lastValidValuesCounter);
    return result;
  }

  private incCurrentIndex() {
    this.currentIndex++;
    if (this.currentIndex >= MAX_NUM_OF_ENTRIES) {
      this.currentIndex = 0;
    }
  }

  public getDebugString() {

    let valString = "";
    let timeString = "";

    for (let i = 0; i < MAX_NUM_OF_ENTRIES; i++) {
      valString += this.valueAr[i];
      timeString += this.timeStampAr[i] + "+";
    }

    return this.name + "X" + this.lastValidValuesCounter + "X" + valString + "X" + timeString + "XXXXXX";
  }
}
