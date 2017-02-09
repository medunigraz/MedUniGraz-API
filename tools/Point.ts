export  class Point
{
  x: number;
  y: number;

  constructor(text?: string)
  {
    if(text != null)
    {
      this.createFromStringInvY(text);
    }
    else
    {
      this.x = 0;
      this.y = 0;
    }
  }

  createFromString(text: string)
  {
    var split = text.split(",", 2);
    if(split.length == 2)
    {
      //console.log("Splitted point: (" + text + "/" + split[0] + "/" + split[1] + ")");
      this.x = parseFloat(split[0]);
      this.y = parseFloat(split[1]);
    }
  }

  createFromStringInvY(text: string)
  {
    var split = text.split(",", 2);
    if(split.length == 2)
    {
      //console.log("Splitted point: (" + text + "/" + split[0] + "/" + split[1] + ")");
      this.x = parseFloat(split[0]);
      this.y = parseFloat(split[1]) * -1.0;
    }
  }

  add(other: Point)
  {
    this.x = this.x + other.x;
    this.y = this.y + other.y;
  }

  getAsString(): string
  {
    return "[" + this.x + ", " + this.y + "]";
  }

  log()
  {
    console.log("(" + this.x + "/" + this.y + ")");
  }
}
