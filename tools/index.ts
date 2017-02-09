import {Point} from './Point'
import {HelmertTrans} from './HelmertTrans'

import xmllib = require("samchon-framework");

let fs = require('fs');

function readSVG() {
    let contents = fs.readFileSync('rooms_Test2.svg').toString();
    fs.writeFileSync('output.txt', "");

    //Delete Header
    let lines = contents.split('\n');
    lines.splice(0,2);
    contents = lines.join('\n');

    //console.log(contents);

    let xml: xmllib.library.XML = new xmllib.library.XML(contents);

    /////////////////////////////////////////
    // ACCESS TO THE TAG "parameter"
    /////////////////////////////////////////
    // TEST WHETHER THE XML HAS CHILDREN XML TAGS NAMED "parameter"
    console.log( xml.has("g") ); // true
    let xmlList: xmllib.library.XMLList = xml.get("g");


    for (let i: number = 0; i < xmlList.size(); i++)
    {
        if (xmlList.at(i).getProperty("inkscape:label") == "umrisse")
        {
            console.log("found: \"Umrisse\"");
            readBorders(xmlList.at(i));
        }
        else if (xmlList.at(i).getProperty("inkscape:label") == "supportpoints")
        {
            console.log("found: \"Supportpoints\"");
            readSupportPoints(xmlList.at(i));
        }
    }
    /*


    // GET VALUE OF THE FIRST PARAMETER
    console.log( xmlList.at(0).getValue() ); // "simulation"

    // GET VALUE OF THE SECOND PARAMETER
    // NOTE, ALL THE VALUE AND PROPERTIES IN XML ARE 'STRING' TYPE
    console.log( parseInt(xmlList.at(1).getValue()) ); // 3

    // GET PROPERTY 'name' IN 2ND PARAMETER
    console.log( xmlList.at(1).getProperty("name") ); // "sequence"*/
}

function readBorders(xml: xmllib.library.XML)
{
  let xmlList: xmllib.library.XMLList = xml.get("path");
  for (let i: number = 0; i < xmlList.size(); i++)
  {
    let d = xmlList.at(i).getProperty("d");
    console.log("Vectordata: " + d); // "sequence"*/
    readPath(d);
  }
}

function readPath(pathString: string)
{
  let trans = new HelmertTrans();
  let remaindingPath = pathString;
  remaindingPath = remaindingPath.trim();
  let posIsAbsolute = false;
  let lastAbsolutePoint = new Point();
  let polygon: Point[] = [];

  while(remaindingPath.length > 2)
  {
    if(remaindingPath.startsWith("m"))
    {
      posIsAbsolute = true;
      remaindingPath = remaindingPath.slice(2, remaindingPath.length);
    }
    else if(!isNaN(parseInt(remaindingPath[0])) || remaindingPath[0] == "-")
    {
      let endPos = remaindingPath.indexOf(" ");
      let posString = remaindingPath;

      if(endPos > 0)
      {
        posString = remaindingPath.slice(0, endPos);
        remaindingPath = remaindingPath.slice(endPos, remaindingPath.length);
      }
      else
      {
        remaindingPath = "";
      }

      let point = new Point(posString);
      if(!posIsAbsolute)
      {
        point.add(lastAbsolutePoint);
        lastAbsolutePoint = point;
      }
      else
      {
        lastAbsolutePoint = point;
      }
      point.log();

      point = trans.transformPoint(point);
      polygon.push(point);

      posIsAbsolute = false;
    }
    else
    {
      console.log("ERROR: Path not supported: \"" + remaindingPath + "\"");
      break;
    }

    remaindingPath = remaindingPath.trim();
  }

  writePolygon(polygon);
}

function writePolygon(polygon: Point[])
{
  var str = "{\n\
    'type': 'Feature',\n\
    'geometry': {\n\
      'type': 'LineString',\n\
      'coordinates': [\n";

  for(let i = 0; i < polygon.length; i++)
  {
    str += polygon[i].getAsString();
    if(i < polygon.length - 1)
    {
      str += ",\n";
    }
  }
  str += "\n]\
    }\
  },\n";

  fs.appendFileSync('output.txt', str);
}

function readSupportPoints(xml: xmllib.library.XML)
{
  let xmlList: xmllib.library.XMLList = xml.get("circle");
  for (let i: number = 0; i < xmlList.size(); i++)
  {
    let x = parseFloat(xmlList.at(i).getProperty("cx"));
    let y = parseFloat(xmlList.at(i).getProperty("cy"));
    console.log("Support Point: " + x + "/" + y); // "sequence"*/
  }
}


function main()
{
  readSVG();
}

main();
