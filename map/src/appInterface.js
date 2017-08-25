
var demoDataStarted = false;

function checkappinterface()
{
  if(typeof JSInterface !== "undefined")
  {
    return true;
  }
  return false;
}

function checkdevice()
{
  //console.log("#JS# checkdevice()");

  if(typeof JSInterface !== "undefined")
  {
    return JSInterface.checkdevice();
  }
  else {
    //console.log("#JS# JSInterface not defined!");
  }

  return -1;
}

function updatesignals(data)
{
  //console.log("#JS# addtableentry() " + data);
  signalDataJson = data;

  //console.log("#JS# LOG: " + "" + new Date().getTime() + ";" + data);
  if(typeof JSInterface !== "undefined")
  {
    //LOG POSITION DATA
    //JSInterface.logrt("" + new Date().getTime() + ";" + data);
  }

  if(window["angularComponentRef"])
  {
    window['angularComponentRef'].zone.run(() => {window['angularComponentRef'].component.signalDataChanged(data);})
  }
}

function startscan()
{
  console.log("#JS# startscan()");
  if(typeof JSInterface !== "undefined")
  {
    JSInterface.startscan();
  }
  else {
    console.log("#JS# JSInterface not defined!");
  }
}


function stopscan()
{
  console.log("#JS# stopscan()");
  if(typeof JSInterface !== "undefined")
  {
    JSInterface.stopscan();
  }
  else {
    console.log("#JS# JSInterface not defined!");
  }
}

function dolog(data)
{
  //console.log("#JS# LOG: " + data);
  if(typeof JSInterface !== "undefined")
  {
    //LOG POSITION DATA
    //return JSInterface.logbuf(data);
  }
  return null;
}

var demoDataTimerActive = false;

function startdemoData()
{
  if(!demoDataTimerActive)
  {
    setTimeout(sendDemoData, 150);
    demoDataTimerActive = true;
  }
}


var appInterfaceObject = (function() {
return {
  testapp: function() {
    return checkappinterface();
  },
  check: function() {
    return checkdevice();
  },
  start: function() {
    return startscan();
  },
  stop: function() {
    return stopscan();
  },
  demo: function() {
    return startdemoData();
  },
  log: function(logstring) {
    return dolog(logstring);
  }
}
})(appInterfaceObject||{})


//DEMO DATA

var counter = 0;

function getData(name, val)
{
  return '{"Name":"' + name + '", "Value":'+val+'}';
}


function sendDemoData()
{
  console.log("#JS# LOG... ");
  //var jsondata = "{ [ {'beacon1':" + counter + "},{'beacon2':" + (counter + 100) + "} ] }";

  var val1 = -30 - Math.random() * 10;
  var val2 = -60 - Math.random() * 10;
  var val3 = -80 - Math.random() * 10;
  var val4 = -30 - Math.random() * 10;

  var jsondata = '[' + getData("D3:52:E0:9C:FA:85", val1) + ', ' + getData("C1:AD:58:D4:C4:D2", val2);

  if(Math.random() > 0.8)
  {
    jsondata += ', ' + getData("E8:78:DB:3C:ED:EE", val3);
  }

  jsondata += ']';
/*
  jsondata = '[' +
  getData("E3:F0:37:DA:11:32", val2) +', ' +
  getData("E8:AA:53:47:4A:67", val3) +', ' +
    getData("FA:7F:B8:61:24:31", val1) + ', ' +
    getData("E3:DE:B3:CD:C5:A8", val4) +', ' +
    getData("F1:61:75:80:F5:AC", val3) +
    ']';
*/

jsondata = '[' +
  getData("8bVP", val1)/* +', ' +
  getData("1iJd", val4) +', ' +
  getData("aaaaa", val1) + ', ' +
  getData("bbbbb", val4) +', ' +
  getData("eeee", val3)*/ +
  ']';

  //jsondata = '[' + getData("FA:7F:B8:61:24:31", val1) + ']';

  counter++;
  updatesignals(jsondata);
  //console.log("#JS# sendDemoData: " + jsondata + "#" + counter);

  if(counter % 10 == 0)
  {
    setTimeout(sendDemoData, 1000);
  }
  else {
    setTimeout(sendDemoData, 1000);
  }
}
