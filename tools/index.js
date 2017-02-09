"use strict";
var Point_1 = require("./Point");
var HelmertTrans_1 = require("./HelmertTrans");
var xmllib = require("samchon-framework");
var fs = require('fs');
function readSVG() {
    var contents = fs.readFileSync('rooms_Test2.svg').toString();
    fs.writeFileSync('output.txt', "");
    var lines = contents.split('\n');
    lines.splice(0, 2);
    contents = lines.join('\n');
    var xml = new xmllib.library.XML(contents);
    console.log(xml.has("g"));
    var xmlList = xml.get("g");
    for (var i = 0; i < xmlList.size(); i++) {
        if (xmlList.at(i).getProperty("inkscape:label") == "umrisse") {
            console.log("found: \"Umrisse\"");
            readBorders(xmlList.at(i));
        }
        else if (xmlList.at(i).getProperty("inkscape:label") == "supportpoints") {
            console.log("found: \"Supportpoints\"");
            readSupportPoints(xmlList.at(i));
        }
    }
}
function readBorders(xml) {
    var xmlList = xml.get("path");
    for (var i = 0; i < xmlList.size(); i++) {
        var d = xmlList.at(i).getProperty("d");
        console.log("Vectordata: " + d);
        readPath(d);
    }
}
function readPath(pathString) {
    var trans = new HelmertTrans_1.HelmertTrans();
    var remaindingPath = pathString;
    remaindingPath = remaindingPath.trim();
    var posIsAbsolute = false;
    var lastAbsolutePoint = new Point_1.Point();
    var polygon = [];
    while (remaindingPath.length > 2) {
        if (remaindingPath.startsWith("m")) {
            posIsAbsolute = true;
            remaindingPath = remaindingPath.slice(2, remaindingPath.length);
        }
        else if (!isNaN(parseInt(remaindingPath[0])) || remaindingPath[0] == "-") {
            var endPos = remaindingPath.indexOf(" ");
            var posString = remaindingPath;
            if (endPos > 0) {
                posString = remaindingPath.slice(0, endPos);
                remaindingPath = remaindingPath.slice(endPos, remaindingPath.length);
            }
            else {
                remaindingPath = "";
            }
            var point = new Point_1.Point(posString);
            if (!posIsAbsolute) {
                point.add(lastAbsolutePoint);
                lastAbsolutePoint = point;
            }
            else {
                lastAbsolutePoint = point;
            }
            point.log();
            point = trans.transformPoint(point);
            polygon.push(point);
            posIsAbsolute = false;
        }
        else {
            console.log("ERROR: Path not supported: \"" + remaindingPath + "\"");
            break;
        }
        remaindingPath = remaindingPath.trim();
    }
    writePolygon(polygon);
}
function writePolygon(polygon) {
    var str = "{\n\
    'type': 'Feature',\n\
    'geometry': {\n\
      'type': 'LineString',\n\
      'coordinates': [\n";
    for (var i = 0; i < polygon.length; i++) {
        str += polygon[i].getAsString();
        if (i < polygon.length - 1) {
            str += ",\n";
        }
    }
    str += "\n]\
    }\
  },\n";
    fs.appendFileSync('output.txt', str);
}
function readSupportPoints(xml) {
    var xmlList = xml.get("circle");
    for (var i = 0; i < xmlList.size(); i++) {
        var x = parseFloat(xmlList.at(i).getProperty("cx"));
        var y = parseFloat(xmlList.at(i).getProperty("cy"));
        console.log("Support Point: " + x + "/" + y);
    }
}
function main() {
    readSVG();
}
main();
